# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Proof.name'
        db.add_column('proofs_proof', 'name',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=128),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Proof.name'
        db.delete_column('proofs_proof', 'name')


    models = {
        'proofs.proof': {
            'Meta': {'object_name': 'Proof'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'proof': ('django.db.models.fields.TextField', [], {})
        }
    }

    complete_apps = ['proofs']