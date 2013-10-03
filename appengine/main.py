import cgi
import datetime
import urllib
import webapp2
import jinja2
import os

from google.appengine.ext import db
from google.appengine.api import users

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


def proof_key(proof_name=None):
    """Constructs a Datastore key for a Proof entity with proof_name."""
    return db.Key.from_path('Proof', proof_name)


class IndexHandler(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()
        if user:
            greeting = ('Welcome, <a href="#" class="username">%s!</a> (<a href="%s">Sign out</a>)' %
                       (user.nickname(), users.create_logout_url('/')))
        else:
            self.redirect(users.create_login_url(self.request.uri))
            greeting = ('<a href="%s">Sign in or register</a>.' %
                       users.create_login_url('/'))

        template_values = {
            "user": user,
            "greeting": greeting
        }
        template = jinja_environment.get_template('templates/index.html')
        self.response.out.write(template.render(template_values))


class ProofHandler(webapp2.RequestHandler):

    def get(self):
        self.response.out.write('<html><body>')

        proofs = db.GqlQuery("SELECT * "
                             "FROM Proof "
                             "WHERE ANCESTOR IS :1 "
                             "ORDER BY date DESC LIMIT 10",
                             proof_key(proof_name))

        for proof in proofs:
            self.response.out.write('<b>%s</b> wrote:' % proof.author)
            self.response.out.write('<blockquote>%s</blockquote>' %
                                    cgi.escape(proof.proof))

        self.response.out.write("</body></html>")

app = webapp2.WSGIApplication([
    ('/', IndexHandler),
    ('/proofs', ProofHandler)
], debug=True)
