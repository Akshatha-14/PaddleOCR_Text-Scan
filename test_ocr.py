from paddleocr import PaddleOCR
import os

# Initialize OCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')

image_folder = "dataset/ch4_training_images"

for img in os.listdir(image_folder):
    img_path = os.path.join(image_folder, img)

    # Skip non-image files (important!)
    if not img.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
        continue

    result = ocr.ocr(img_path, cls=True)

    print(f"\nImage: {img}")

    # ✅ SAFE CHECK (prevents crash)
    if result and result[0]:
        for line in result[0]:
            text = line[1][0]
            confidence = line[1][1]
            print(f"{text}  (confidence: {confidence:.2f})")
    else:
        print("No text detected")
