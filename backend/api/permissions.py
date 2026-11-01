from rest_framework import permissions

class IsAdminUserOrReadOnly(permissions.BasePermission):
    """
    Allows read permissions to anyone, but only admin users can write.
    """
    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or getattr(getattr(request.user, 'profile', None), 'role', None) == 'admin'))


class IsAdminRole(permissions.BasePermission):
    """
    Strictly allows access only to Administrators.
    """
    def has_permission(self, request, view) -> bool:
        return bool(
            request.user and request.user.is_authenticated and (
                request.user.is_staff or 
                request.user.is_superuser or 
                getattr(getattr(request.user, 'profile', None), 'role', None) == 'admin'
            )
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allows object level edit to owner or administrator.
    """
    def has_object_permission(self, request, view, obj) -> bool:
        if request.user and (request.user.is_staff or getattr(getattr(request.user, 'profile', None), 'role', None) == 'admin'):
            return True
        
        # Check ownership
        if hasattr(obj, 'user'):
            return bool(obj.user == request.user)
        return False

