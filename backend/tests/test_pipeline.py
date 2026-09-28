from pathlib import Path

from app.pipeline import PrescriptionPipeline


def main():

    root = Path(__file__).resolve().parents[1]

    image = root / "sample_prescriptions" / "sample1.jpg"

    pipeline = PrescriptionPipeline()

    result = pipeline.process(str(image))

    print(result)


if __name__ == "__main__":
    main()