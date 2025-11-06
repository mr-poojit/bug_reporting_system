from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.name

class Issue(models.Model):
    STATUS_CHOICES = [("open","open"),("in_progress","in_progress"),("closed","closed")]
    PRIORITY_CHOICES = [("low","low"),("medium","medium"),("high","high"),("critical","critical")]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="medium")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    project = models.ForeignKey(Project, related_name="issues", on_delete=models.CASCADE)
    reporter = models.ForeignKey(User, related_name="reported_issues", on_delete=models.CASCADE)
    assignee = models.ForeignKey(User, related_name="assigned_issues", null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self): return f"{self.project.name}: {self.title}"

class Comment(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    issue = models.ForeignKey(Issue, related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(User, related_name="comments", on_delete=models.CASCADE)

    def __str__(self): return f"C#{self.id} on {self.issue_id}"
