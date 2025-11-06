from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsReporterOrAssigneeCanUpdate(BasePermission):
    """
    Allow PATCH/PUT/DELETE only for reporter or assignee.
    Read allowed to authenticated (or per view).
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return user and user.is_authenticated and (obj.reporter_id == user.id or (obj.assignee_id == user.id if obj.assignee_id else False))
