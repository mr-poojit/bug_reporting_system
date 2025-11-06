from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User

class APISmoke(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="u1", password="pass12345")
        resp = self.client.post(reverse("token_obtain_pair"), {"username":"u1","password":"pass12345"})
        self.token = resp.data["access"]
        self.auth = {"HTTP_AUTHORIZATION": f"Bearer {self.token}"}

    def test_project_create_list(self):
        # create
        r = self.client.post("/api/projects/", {"name":"Project A","description":"Desc"}, **self.auth)
        self.assertEqual(r.status_code, 201)
        # list
        r = self.client.get("/api/projects/", **self.auth)
        self.assertEqual(r.status_code, 200)
        self.assertTrue(len(r.data["results"]) >= 1)
