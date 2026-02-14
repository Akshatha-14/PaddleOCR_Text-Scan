from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from paddleocr import PaddleOCR
from PIL import Image
import tempfile

# Load model ONCE (very important)
ocr = PaddleOCR(use_angle_cls=True, lang='en')

@api_view(['POST'])
def extract_text(request):
    if request.method == 'POST':
        image = request.FILES.get('image')

        with tempfile.NamedTemporaryFile(delete=False) as temp:
            for chunk in image.chunks():
                temp.write(chunk)

            temp_path = temp.name

        result = ocr.ocr(temp_path)

        extracted_text = []
        for line in result[0]:
            extracted_text.append(line[1][0])

        return JsonResponse({"text": extracted_text})