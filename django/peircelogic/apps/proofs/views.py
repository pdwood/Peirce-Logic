from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from peircelogic.apps.proofs.models import Proof

def create_proof(request):
    proof_name = request.POST['proof_name']
    if proof_name == '':
        return HttpResponse("proof name cannot be blank")
    if request.user == None:
        return HttpResponse("authentication failure")
    proof = Proof.objects.create(name=proof_name, user=request.user)
    return HttpResponse("success")

def get_proof(request, proof_id):
    proof = get_object_or_404(Proof, pk=proof_id)
    if proof.user == request.user:
        return HttpResponse(proof.proof)
    else:
        return HttpResponse("authentication failure")

def update_proof(request, proof_id):
    proof = get_object_or_404(Proof, pk=proof_id)
    if proof.user == request.user:
        proof.proof = request.POST['proof_content']
        proof.save()
        return HttpResponse("success")
    else:
        return HttpResponse("authentication failure")

def delete_proof(request, proof_id):
    proof = get_object_or_404(Proof, pk=proof_id)
    if proof.user == request.user:
        proof.delete()
        return HttpResponse("success")
    else:
        return HttpResponse("authentication failure")