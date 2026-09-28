from pathlib import Path

import cv2
import numpy as np


class ImagePreprocessor:
    """
    Preprocesses prescription images before sending them to Gemini.
    """

    MAX_WIDTH = 1600

    def preprocess(self, image_path: str) -> str:

        image_path = Path(image_path)

        image = cv2.imread(str(image_path))

        if image is None:
            raise ValueError(f"Unable to read image: {image_path}")

        image = self.resize(image)

        image = self.enhance(image)

        output_dir = image_path.parent / "processed"

        output_dir.mkdir(exist_ok=True)

        output_path = output_dir / image_path.name

        cv2.imwrite(str(output_path), image)

        return str(output_path)

    def resize(self, image):

        h, w = image.shape[:2]

        if w <= self.MAX_WIDTH:
            return image

        scale = self.MAX_WIDTH / w

        new_size = (
            int(w * scale),
            int(h * scale)
        )

        return cv2.resize(
            image,
            new_size,
            interpolation=cv2.INTER_AREA
        )

    def enhance(self, image):

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        clahe = cv2.createCLAHE(
            clipLimit=2.0,
            tileGridSize=(8, 8)
        )

        gray = clahe.apply(gray)

        gray = cv2.fastNlMeansDenoising(
            gray,
            None,
            10,
            7,
            21
        )

        return cv2.cvtColor(
            gray,
            cv2.COLOR_GRAY2BGR
        )