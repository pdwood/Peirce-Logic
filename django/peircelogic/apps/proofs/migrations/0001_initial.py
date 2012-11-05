# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Proof'
        db.create_table('proofs_proof', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('proof', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal('proofs', ['Proof'])


    def backwards(self, orm):
        # Deleting model 'Proof'
        db.delete_table('proofs_proof')


    models = {
        'proofs.proof': {
            'Meta': {'object_name': 'Proof'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'proof': ('django.db.models.fields.TextField', [], {})
        }
    }

    complete_apps = ['proofs']