from rapidfuzz import process
from rapidfuzz import fuzz


class InvestigationMatcher:

    def __init__(self, lookup):

        self.lookup = lookup

        self.names = list(lookup.keys())

    def match(self, investigation_name):

        name = investigation_name.strip().lower()

        # Exact match
        if name in self.lookup:

            result = self.lookup[name].copy()

            result["validated"] = True
            result["match_score"] = 100

            return result

        # Fuzzy fallback
        best = process.extractOne(
            name,
            self.names,
            scorer=fuzz.WRatio
        )

        if best is None:

            return None

        matched_name = best[0]
        score = best[1]

        result = self.lookup[matched_name].copy()

        result["validated"] = score >= 85
        result["match_score"] = round(score, 2)

        return result