from django.urls import path
from .views import CompanyListView, CompanyRolesView, RoleDetailView

urlpatterns = [
    path("", CompanyListView.as_view()),
    path("<int:company_id>/roles/", CompanyRolesView.as_view()),
    path("<int:company_id>/roles/<int:role_id>/", RoleDetailView.as_view()),
]
