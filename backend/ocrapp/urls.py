from django.urls import path
from .views import *

urlpatterns = [
    path('extract/', extract_text),
]