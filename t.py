from paddleocr import PaddleOCR
import numpy as np
ocr = PaddleOCR(use_angle_cls=True, lang='en')
result = ocr.ocr('test.png')
print(result)
