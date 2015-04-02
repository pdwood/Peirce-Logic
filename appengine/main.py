import cgi
import datetime
import urllib
import webapp2
import jinja2
import os
import json

from google.appengine.ext import ndb
from google.appengine.api import users

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

def userproofs_key(email=None):
    return ndb.Key('userproofs', email)

class Proofs(ndb.Model):
    title = ndb.StringProperty(indexed=True)
    description = ndb.StringProperty(indexed=False)
    proof = ndb.StringProperty(indexed=False)

    def serialize(self):
        return { "title": self.title, "description": self.description, "proof": self.proof }

class IndexHandler(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()
        if user:
            logButt = ('<a href="%s">Sign out</a>' %
                       users.create_logout_url('/'))
            username = user.nickname()
        else:
            logButt = ('<a href="%s">Sign in</a>' %
                       users.create_login_url('/'))
            username = None

        template_values = {
            "user": user,
            "logButt": logButt,
            "username": username
        }
        template = jinja_environment.get_template('templates/index.html')
        self.response.out.write(template.render(template_values))

class SaveTheProof(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()
        if(user):
            title = self.request.get('title')
            qry = Proofs.query(ancestor=userproofs_key(user.email()))
            qry2 = qry.filter(Proofs.title == title )
            exists = qry2.fetch(1);
            if(exists):
                self.response.out.write(1)
            else:
                self.response.out.write(0);

    def post(self):
        user = users.get_current_user()
        if(user):
            proofData = Proofs(parent=userproofs_key(users.get_current_user().email()))
            proofData.title = self.request.get('title')
            proofData.description = self.request.get('description')
            proofData.proof = self.request.get('proof')
            proofData.put()

class LoadProofs(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if(user):
            proof_query = Proofs.query(ancestor=userproofs_key(user.email()))
            proofs = proof_query.fetch(1000)
            prooflist = []
            for curProof in proofs:
                prooflist.append(curProof.serialize())
            self.response.headers['Content-Type'] = 'application/json'
            self.response.out.write(json.dumps(prooflist))

class DeleteTheProof(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()
        if(user):
            title = self.request.get('title')
            qry = Proofs.query(ancestor=userproofs_key(user.email()))
            qry2 = qry.filter(Proofs.title == title )
            terminalProof = qry2.fetch(1)
            tpKey = terminalProof[0].put();
            tpKey.delete();

app = webapp2.WSGIApplication([
    ('/', IndexHandler),
    ('/saveproof', SaveTheProof),
    ('/loadproof', LoadProofs),
    ('/deleteproof', DeleteTheProof)
], debug=True)
