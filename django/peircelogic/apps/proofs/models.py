from django.db import models
from django.contrib.auth.models import User
from django.forms import ModelForm

class Proof(models.Model):
    name = models.CharField(max_length=128)
    user = models.ForeignKey(User)
    proof = models.TextField()

    def __unicode__(self):
        return "%s (%s)" % (self.name, self.user.username)

class NewProofForm(ModelForm):
    class Meta:
        model = Proof
        fields = ('name', 'proof',)

class ProofForm(ModelForm):
    class Meta:
        model = Proof
        fields = ('proof',)