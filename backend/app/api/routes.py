from pathlib import Path
import shutil
import uuid
import json
from fastapi import APIRouter
from fastapi import Depends
from fastapi import File
from fastapi import HTTPException
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.dependencies import pipeline
from app.database.database import get_db
from app.database.crud import (
    save_prescription,
    get_all_prescriptions,
    get_prescription,
)

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@router.post("/analyze")
async def analyze_prescription(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Analyze a doctor's prescription image.
    """

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed."
        )

    extension = Path(file.filename).suffix
    filename = f"{uuid.uuid4()}{extension}"
    filepath = UPLOAD_DIR / filename

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Run AI pipeline
        result = pipeline.process(str(filepath))

        # Save to database
        save_prescription(
            db=db,
            image_path=str(filepath),
            result=result
        )

        return result

    except RuntimeError as e:

        if "Gemini is temporarily unavailable" in str(e):
            raise HTTPException(
                status_code=503,
                detail="Gemini is temporarily unavailable. Please try again in a few moments."
            )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    except Exception as e:

        print("\n========== ANALYSIS ERROR ==========")
        print(type(e).__name__)
        print(str(e))
        print("====================================\n")

        raise HTTPException(
            status_code=500,
            detail="An error occurred while analyzing the prescription."
        )

    finally:
        if filepath.exists():
            filepath.unlink()

@router.get("/prescriptions")
def get_prescriptions(
    db: Session = Depends(get_db)
):
    prescriptions = get_all_prescriptions(db)

    results = []

    for prescription in prescriptions:

        results.append({
            "id": prescription.id,
            "image_path": prescription.image_path,
            "created_at": prescription.created_at,
            "result": json.loads(
                prescription.result_json
            )
        })

    return results
@router.get("/prescriptions/{prescription_id}")
def get_single_prescription(
    prescription_id: int,
    db: Session = Depends(get_db)
):

    prescription = get_prescription(
        db,
        prescription_id
    )

    if not prescription:
        raise HTTPException(
            status_code=404,
            detail="Prescription not found"
        )

    return {
        "id": prescription.id,
        "image_path": prescription.image_path,
        "created_at": prescription.created_at,
        "result": json.loads(
            prescription.result_json
        )
    }
@router.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db)
):

    prescriptions = get_all_prescriptions(db)

    total_prescriptions = len(prescriptions)

    total_investigations = 0
    validated_investigations = 0
    unvalidated_investigations = 0

    confidence_values = []

    investigation_counts = {}


    # --------------------------------
    # Process every prescription
    # --------------------------------

    for prescription in prescriptions:

        try:
            result = json.loads(
                prescription.result_json
            )
        except (json.JSONDecodeError, TypeError):
            continue


        investigations = result.get(
            "investigations",
            []
        )


        for investigation in investigations:

            total_investigations += 1


            # -------------------------
            # Validation
            # -------------------------

            if investigation.get(
                "validated",
                False
            ):

                validated_investigations += 1

            else:

                unvalidated_investigations += 1


            # -------------------------
            # Confidence
            # -------------------------

            confidence = investigation.get(
                "confidence"
            )

            if isinstance(confidence, (int, float)):

                # If confidence is 0.95
                if confidence <= 1:

                    confidence *= 100

                confidence_values.append(
                    confidence
                )


            # -------------------------
            # Investigation frequency
            # -------------------------

            name = (
                investigation.get("canonical_name")
                or investigation.get("raw_name")
                or "Unknown"
            )


            investigation_counts[name] = (
                investigation_counts.get(name, 0) + 1
            )


    # --------------------------------
    # Average confidence
    # --------------------------------

    if confidence_values:

        average_confidence = (
            sum(confidence_values)
            / len(confidence_values)
        )

    else:

        average_confidence = 0


    # --------------------------------
    # Most detected investigations
    # --------------------------------

    most_detected = sorted(
        investigation_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )


    # Keep top 10

    most_detected = most_detected[:10]


    return {

        "total_prescriptions":
            total_prescriptions,

        "total_investigations":
            total_investigations,

        "validated_investigations":
            validated_investigations,

        "unvalidated_investigations":
            unvalidated_investigations,

        "average_confidence":
            round(average_confidence, 2),

        "most_detected":
            [
                {
                    "name": name,
                    "count": count
                }

                for name, count
                in most_detected
            ]

    }
@router.get("/health")
def health():
    return {
        "status": "healthy"
    }