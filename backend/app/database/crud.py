import json
from app.database.models import Prescription
from sqlalchemy.orm import Session
from app.database.models import Prescription


def save_prescription(
    db: Session,
    image_path: str,
    result: dict
):

    prescription = Prescription(

        image_path=image_path,

        result_json=json.dumps(
            result,
            indent=4
        )

    )

    db.add(prescription)

    db.commit()

    db.refresh(prescription)

    return prescription

def get_all_prescriptions(db: Session):
    return (
        db.query(Prescription)
        .order_by(Prescription.id.desc())
        .all()
    )


def get_prescription(db: Session, prescription_id: int):
    return (
        db.query(Prescription)
        .filter(Prescription.id == prescription_id)
        .first()
    )