from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class RefinedBill(models.Model):
    bill_id=models.PositiveIntegerField()
    employee = models.CharField(max_length = 30)
    name=models.CharField(max_length=30)
    quantity=models.CharField(max_length=10)
    price=models.CharField(max_length=30)
    total=models.DecimalField(max_digits=10,decimal_places=2)
    payment=models.CharField(max_length=10)
    time=models.TimeField()
    def __str__(self):
        return self.name
    