from paddleocr import PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang='en')

result = ocr.ocr('test.png')
print(result)