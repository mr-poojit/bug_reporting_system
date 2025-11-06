import django_filters
from .models import Issue

class IssueFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")
    priority = django_filters.CharFilter(field_name="priority", lookup_expr="iexact")
    search = django_filters.CharFilter(method="filter_search")

    class Meta:
        model = Issue
        fields = ["status","priority"]

    def filter_search(self, queryset, name, value):
        return queryset.filter(title__icontains=value) | queryset.filter(description__icontains=value)
