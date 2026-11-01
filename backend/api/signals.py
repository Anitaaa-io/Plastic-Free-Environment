from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        role = 'admin' if instance.is_superuser or instance.is_staff else 'user'
        UserProfile.objects.create(user=instance, role=role)
    else:
        if hasattr(instance, 'profile'):
            if instance.is_superuser or instance.is_staff:
                if instance.profile.role != 'admin':
                    instance.profile.role = 'admin'
                    instance.profile.save()

