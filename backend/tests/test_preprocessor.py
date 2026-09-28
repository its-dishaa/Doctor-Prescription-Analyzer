from app.preprocessing import ImagePreprocessor


def main():
    processor = ImagePreprocessor()

    output = processor.preprocess(
        "sample_prescriptions/sample1.jpg"
    )

    print(output)


if __name__ == "__main__":
    main()