from django.contrib import admin
from arc_app.models import UserProfile, Contract, Session, ContractMeeting, Subject
# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Contract)
admin.site.register(Session)
admin.site.register(ContractMeeting)
admin.site.register(Subject)
