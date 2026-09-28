from app.ai import GeminiService


def main():

    service = GeminiService()

    result = service.analyze_image(
        "sample_prescriptions/sample1.jpg"
    )

    print(result.model_dump_json(indent=4))


if __name__ == "__main__":
    main()