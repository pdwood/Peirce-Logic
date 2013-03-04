import cgi
import datetime
import urllib
import webapp2

from google.appengine.ext import db
from google.appengine.api import users


class Proof(db.Model):
    """Models an individual Proof entry with an author, title, proof, and date."""
    author = db.StringProperty()
    name = db.StringProperty()
    proof = db.StringProperty(multiline=True)
    date = db.DateTimeProperty(auto_now_add=True)
