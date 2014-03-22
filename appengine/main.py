import cgi
import datetime
import urllib
import webapp2
import jinja2
import os

from google.appengine.ext import ndb
from google.appengine.api import users

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))


def userlog_key(email=None):
    return ndb.Key('userlog', email)

class Message(ndb.Model):
    content = ndb.StringProperty(indexed=False)

class IndexHandler(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()
        proofList = []
        if user:
            greeting = ('Welcome, <a href="#" class="username">%s!</a> (<a href="%s">Sign out</a>)' %
                       (user.nickname(), users.create_logout_url('/')))
            message_query = Message.query(ancestor=userlog_key(user.email()))
            messages = message_query.fetch(10)
            for message in messages:
                proofList.append(message.content)
        else:
            greeting = ('<a href="%s">Sign in or register</a>.' %
                       users.create_login_url('/'))

        template_values = {
            "user": user,
            "greeting": greeting,
            "proofList": proofList
        }
        template = jinja_environment.get_template('templates/index.html')
        self.response.out.write(template.render(template_values))

class SaveTheProof(webapp2.RequestHandler):

    def post(self):
        user = users.get_current_user()
        if(user):
            message = Message(parent=userlog_key(users.get_current_user().email()))
            message.content = self.request.get('serializedProof')
            message.put()

            query_params = {'userlog': users.get_current_user().email()}
            self.redirect('/?' + urllib.urlencode(query_params))
        else:
            self.redirect('/')


app = webapp2.WSGIApplication([
    ('/', IndexHandler),
    ('/saveproof', SaveTheProof)
], debug=True)
