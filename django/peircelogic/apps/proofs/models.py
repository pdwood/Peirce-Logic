from django.db import models

class Proof(models.Model):
    name = models.CharField(max_length=128)
    proof = models.TextField()

    def __unicode__(self):
        return 'Proof'