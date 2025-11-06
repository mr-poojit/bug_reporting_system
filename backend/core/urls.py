from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView,
    ProjectListCreateView,
    ProjectIssuesView,
    IssuePartialUpdateView,
    IssueDetailView,
    IssueCommentsView,
    UsersListView,
)

urlpatterns = [
    # Auth
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Projects
    path("projects/", ProjectListCreateView.as_view(), name="projects"),

    # Issues (nested under project)
    path("projects/<int:pk>/issues/", ProjectIssuesView.as_view(), name="project_issues"),

    # Issue detail + update
    path("issues/<int:pk>/", IssueDetailView.as_view(), name="issue_detail"),
    path("issues/<int:pk>/patch/", IssuePartialUpdateView.as_view(), name="issue_patch"),

    # Comments
    path("issues/<int:pk>/comments/", IssueCommentsView.as_view(), name="issue_comments"),

    # Users (for assignee dropdown)
    path("users/", UsersListView.as_view(), name="users"),
]
