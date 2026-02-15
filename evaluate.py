from paddleocr import PaddleOCR
import os

# Initialize OCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')

# Paths
image_dir = "dataset/ch4_test_images"
gt_dir = "dataset/ch4_test_localization_transcription_gt"

correct = 0
total = 0

for img_name in os.listdir(image_dir):

    if not img_name.lower().endswith((".jpg", ".png", ".jpeg")):
        continue

    img_path = os.path.join(image_dir, img_name)

    # Build GT filename → img_1.jpg → gt_img_1.txt
    base_name = os.path.splitext(img_name)[0]
    gt_file = f"gt_{base_name}.txt"
    gt_path = os.path.join(gt_dir, gt_file)

    if not os.path.exists(gt_path):
        print(f"❌ Missing GT: {gt_file}")
        continue

    # Read GT text(s)
    gt_texts = []
    with open(gt_path, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split(",")
            if len(parts) < 9:
                continue

            text = parts[-1].strip().lower()
            if text == "###":
                continue

            gt_texts.append(text)

    if not gt_texts:
        print(f"⚠️ No valid GT text in {gt_file}")
        continue

    # OCR
    result = ocr.ocr(img_path, cls=True)
    if result and result[0]:
        predicted_text = " ".join([line[1][0] for line in result[0]]).lower()
    else:
        predicted_text = ""

    print(f"\nImage: {img_name}")
    print(f"OCR : {predicted_text}")
    print(f"GT  : {gt_texts}")

    # Compare
    matched = False
    for gt in gt_texts:
        total += 1
        if gt in predicted_text:
            correct += 1
            matched = True
            break

    if not matched:
        print("❌ No match")

accuracy = (correct / total) * 100 if total > 0 else 0
print(f"\n✅ OCR Accuracy: {accuracy:.2f}%")
