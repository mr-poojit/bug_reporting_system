from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Issue, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ["username", "email", "password"]
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "description", "created_at"]

class IssueListSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    assignee = UserSerializer(read_only=True)
    project = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Issue
        fields = ["id","title","status","priority","created_at","updated_at","project","reporter","assignee"]

class IssueCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["id","title","description","status","priority","assignee"]
        read_only_fields = ["id"]

class IssueDetailSerializer(serializers.ModelSerializer):
    reporter = UserSerializer(read_only=True)
    assignee = UserSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    class Meta:
        model = Issue
        fields = ["id","title","description","status","priority","created_at","updated_at","project","reporter","assignee"]

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ["id","content","created_at","author","issue"]
        read_only_fields = ["id","created_at","author","issue"]
