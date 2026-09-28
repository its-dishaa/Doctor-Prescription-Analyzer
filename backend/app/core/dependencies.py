from app.ai import GeminiService
from app.preprocessing import ImagePreprocessor
from app.validation import InvestigationValidator
from app.pipeline import PrescriptionPipeline

preprocessor = ImagePreprocessor()

gemini_service = GeminiService()

validator = InvestigationValidator()

pipeline = PrescriptionPipeline(
    preprocessor=preprocessor,
    gemini_service=gemini_service,
    validator=validator
)