# from app.ai import GeminiService
# from app.preprocessing import ImagePreprocessor
# from app.validation import InvestigationValidator


# class PrescriptionPipeline:
#     """
#     Complete prescription analysis pipeline.
#     """

#     def __init__(
#         self,
#         preprocessor,
#         gemini_service,
#         validator,
#     ):

#         self.preprocessor = preprocessor
#         self.gemini = gemini_service
#         self.validator = validator

#     def process(self, image_path: str):

#         # Step 1
#         processed_image = self.preprocessor.preprocess(
#             image_path
#         )

#         # Step 2
#         gemini_response = self.gemini.analyze_image(
#             processed_image
#         )

#         # Step 3
#         validated = []

#         for investigation in gemini_response.investigations:

#             validated.append(

#                 self.validator.validate(

#                     investigation.model_dump()

#                 )

#             )

#         return {

#             "total_investigations": len(validated),

#             "investigations": validated

#         }


from app.ai import GeminiService
from app.preprocessing import ImagePreprocessor
from app.validation import InvestigationValidator


class PrescriptionPipeline:
    """
    Complete prescription analysis pipeline.
    """

    def __init__(
        self,
        preprocessor,
        gemini_service,
        validator,
    ):
        self.preprocessor = preprocessor
        self.gemini = gemini_service
        self.validator = validator

    def process(self, image_path: str):

        # Step 1: Preprocess prescription image
        processed_image = self.preprocessor.preprocess(
            image_path
        )

        # Step 2: Gemini extracts investigations
        gemini_response = self.gemini.analyze_image(
            processed_image
        )

        # Step 3: Return Gemini result directly
        investigations = [
            investigation.model_dump()
            for investigation in gemini_response.investigations
        ]

        return {
            "total_investigations": len(investigations),
            "investigations": investigations
        }

