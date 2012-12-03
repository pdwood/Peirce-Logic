from django.conf.urls import patterns, include, url


from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Debug
    url(r'^debug/', 'peircelogic.apps.proofs.views.debug'),

    # Users
    url(r'^login/', 'django.contrib.auth.views.login'),
    url(r'^logout/', 'django.contrib.auth.views.logout'),

    # CRUD
    url(r'^create_proof/', 'peircelogic.apps.proofs.views.create_proof'),
    url(r'^get_proof/(\d+)/', 'peircelogic.apps.proofs.views.get_proof'),
    url(r'^update_proof/(\d+)/', 'peircelogic.apps.proofs.views.update_proof'),
    url(r'^delete_proof/(\d+)/', 'peircelogic.apps.proofs.views.delete_proof'),

    # Admin
    url(r'^admin/', include(admin.site.urls)),
)
