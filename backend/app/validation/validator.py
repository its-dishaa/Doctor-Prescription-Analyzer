
from rapidfuzz import fuzz

from app.validation.loader import InvestigationLoader


class InvestigationValidator:

    FUZZY_THRESHOLD = 85

    def __init__(self):
        loader = InvestigationLoader()
        self.df = loader.get_dataframe()

    # ---------------------------------------------------------
    # Normalize text for comparison
    # ---------------------------------------------------------
    def _normalize(self, text):
        if text is None:
            return ""

        text = str(text).strip().lower()

        # Basic normalization
        text = text.replace("-", " ")
        text = text.replace("/", " ")

        # Remove duplicate spaces
        text = " ".join(text.split())

        return text

    # ---------------------------------------------------------
    # Check whether candidate adds words that were NOT present
    # in the raw investigation.
    #
    # Example:
    #
    # raw:
    #     PET CT
    #
    # candidate:
    #     PSMA PET CT
    #
    # -> False
    #
    # raw:
    #     Core Biopsy Right Breast
    #
    # candidate:
    #     Breast Biopsy
    #
    # -> True
    # ---------------------------------------------------------
    def _is_safe_specific_match(self, raw_name, candidate):

        raw = self._normalize(raw_name)
        candidate = self._normalize(candidate)

        raw_tokens = set(raw.split())
        candidate_tokens = set(candidate.split())

        # Candidate must not introduce words that are absent
        # from the prescription text.
        extra_tokens = candidate_tokens - raw_tokens

        if extra_tokens:
            return False

        return True

    # ---------------------------------------------------------
    # Exact canonical / alias match
    # ---------------------------------------------------------
    def _find_exact_match(self, raw_name):

        normalized_raw = self._normalize(raw_name)

        for _, row in self.df.iterrows():

            canonical = self._normalize(row["canonical_name"])

            # Exact canonical match
            if normalized_raw == canonical:

                return row, 100

            # Exact alias match
            aliases = str(row["aliases"]).split(";")

            for alias in aliases:

                alias = self._normalize(alias)

                if alias and normalized_raw == alias:

                    return row, 100

        return None, -1

    # ---------------------------------------------------------
    # Fuzzy matching
    # ---------------------------------------------------------
    def _find_fuzzy_match(self, raw_name):

        best_score = -1
        best_row = None

        for _, row in self.df.iterrows():

            candidates = [
                row["canonical_name"]
            ]

            aliases = str(row["aliases"]).split(";")

            candidates.extend(aliases)

            for candidate in candidates:

                candidate = str(candidate).strip()

                if not candidate:
                    continue

                score = fuzz.token_sort_ratio(
                    self._normalize(raw_name),
                    self._normalize(candidate)
                )

                # Only consider a candidate if it is sufficiently
                # similar AND does not introduce new information.
                if score >= self.FUZZY_THRESHOLD:

                    if not self._is_safe_specific_match(
                        raw_name,
                        candidate
                    ):
                        continue

                    if score > best_score:

                        best_score = score
                        best_row = row

        return best_row, best_score

    # ---------------------------------------------------------
    # Main validation function
    # ---------------------------------------------------------
    def validate(self, investigation):
        raw_name = str(
            investigation.get("name", "")
        ).strip()
        reason = investigation.get("reason", "")
        if not raw_name:
            return {
                "name": "",
                "canonical_name": None,
                "validated": False,
                "match_score": 0,
                "reason": reason
        }

    # --------------------------------------------------
    # 1. Exact match
    # --------------------------------------------------

        best_row, best_score = self._find_exact_match(raw_name)
        if best_row is None:
            best_row, best_score = self._find_fuzzy_match(
                raw_name
            )
        if best_row is None:
            return {
                "name": raw_name,
                "canonical_name": None,
                "validated": False,
                "match_score": 0,
                "reason": reason
            }



        validated = best_score >= self.FUZZY_THRESHOLD
        return {
            "name": raw_name,
            "id": int(best_row["id"]),
            "canonical_name": best_row["canonical_name"],
            "aliases": best_row["aliases"],
            "department": best_row["department"],
            "category": best_row["category"],
            "fasting": best_row["fasting"],
            "validated": validated,
            "match_score": round(best_score, 2),
            "reason": reason
    }