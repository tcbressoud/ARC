from rest_framework import permissions

class IsTutorOrIsAdminReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.userprofiles.is_tutor:
            return True
        elif request.user.userprofiles.is_admin:
            if request.method in permissions.SAFE_METHODS:
                return True
            else:
                return False
        else:
            return False
