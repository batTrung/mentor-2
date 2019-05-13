from django.urls import path
from . import views

urlpatterns = [
    path('cau-a/', views.cau_a, name='cau_a'),
    path('cau-b/', views.cau_b, name='cau_b'),
    path('cau-c/', views.cau_c, name='cau_c'),
]

