from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, viewsets, mixins
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Project, Issue, Comment
from .serializers import (
    RegisterSerializer, ProjectSerializer,
    IssueListSerializer, IssueCreateSerializer, IssueDetailSerializer,
    CommentSerializer, UserSerializer,
)
from .permissions import IsReporterOrAssigneeCanUpdate
from .filters import IssueFilter

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all().order_by("-id")
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    # Everyone logged-in can create/list projects for assignment scope

class ProjectIssuesView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = IssueFilter
    search_fields = ["title","description"]
    ordering_fields = ["created_at","updated_at","priority","status"]

    def get_queryset(self):
        project_id = self.kwargs["pk"]
        qs = Issue.objects.filter(project_id=project_id).select_related(
            "project","reporter","assignee"
        ).order_by("-created_at")
        return qs

    def get_serializer_class(self):
        if self.request.method == "POST":
            return IssueCreateSerializer
        return IssueListSerializer

    def perform_create(self, serializer):
        project = get_object_or_404(Project, pk=self.kwargs["pk"])
        serializer.save(project=project, reporter=self.request.user)

class IssuePartialUpdateView(generics.UpdateAPIView):
    queryset = Issue.objects.select_related("project","reporter","assignee")
    serializer_class = IssueCreateSerializer  # for PATCH fields
    permission_classes = [permissions.IsAuthenticated, IsReporterOrAssigneeCanUpdate]
    http_method_names = ["patch"]

class IssueDetailView(generics.RetrieveAPIView):
    queryset = Issue.objects.select_related("project","reporter","assignee")
    serializer_class = IssueDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

class IssueCommentsView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        issue_id = self.kwargs["pk"]
        return Comment.objects.filter(issue_id=issue_id)\
            .select_related("author","issue").order_by("created_at")

    def get_serializer_class(self):
        return CommentSerializer

    def perform_create(self, serializer):
        issue = get_object_or_404(Issue, pk=self.kwargs["pk"])
        serializer.save(issue=issue, author=self.request.user)

class UsersListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("username")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
