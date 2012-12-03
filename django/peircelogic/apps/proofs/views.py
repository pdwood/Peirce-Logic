from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from peircelogic.apps.proofs.models import Proof, NewProofForm, ProofForm

def debug(request):
    return HttpResponse('<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>')

def create_proof(request):
    if request.user.is_anonymous():
        return HttpResponse("authentication failure")
    proof_form = NewProofForm(request.POST)
    if proof_form.is_valid():
        proof = proof_form.save(commit=False)
        proof.user = request.user
        proof.save()
        return HttpResponse("success")
    else:
        return HttpResponse(str(proof.errors))

def get_proof(request, proof_id):
    proof = get_object_or_404(Proof, pk=proof_id)
    if proof.user == request.user:
        return HttpResponse(proof.proof)
    else:
        return HttpResponse("authentication failure")

def update_proof(request, proof_id):
    proof = get_object_or_404(Proof, pk=proof_id)
    if proof.user == request.user:
        proof = ProofForm(request.POST, instance=proof)
        if proof.is_valid():
            proof.save()
            return HttpResponse("success")
        else:
            return HttpResponse(str(proof.errors))
    else:
        return HttpResponse("authentication failure")

def delete_proof(request, proof_id):
    proof = get_object_or_404(Proof, pk=proof_id)
    if proof.user == request.user:
        proof.delete()
        return HttpResponse("success")
    else:
        return HttpResponse("authentication failure")