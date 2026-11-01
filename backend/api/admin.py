from django.contrib import admin
from .models import (
    UserProfile, Pledge, WasteReport, Campaign, CleanupEvent,
    Volunteer, EcoActivity, ContactMessage,
    Notification, Badge, UserBadge, DailyChallenge, UserChallenge, CommunityStory
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'city', 'eco_points', 'pledge_taken', 'created_at')
    list_filter = ('role', 'pledge_taken', 'city')
    search_fields = ('user__username', 'user__email', 'city')


@admin.register(Pledge)
class PledgeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'city', 'is_public', 'created_at')
    list_filter = ('city', 'is_public', 'created_at')
    search_fields = ('full_name', 'email', 'city')


@admin.register(WasteReport)
class WasteReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'waste_severity', 'status', 'city', 'created_at')
    list_filter = ('status', 'category', 'waste_severity', 'city')
    search_fields = ('title', 'description', 'reporter_name', 'location_address')
    list_editable = ('status',)


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status', 'target_reach', 'current_reach', 'featured', 'start_date')
    list_filter = ('status', 'category', 'featured')
    search_fields = ('title', 'description', 'objective')


class VolunteerInline(admin.TabularInline):
    model = Volunteer
    extra = 0
    readonly_fields = ('registered_at',)


@admin.register(CleanupEvent)
class CleanupEventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'location_name', 'city', 'status', 'target_volunteers', 'registered_count')
    list_filter = ('status', 'city', 'event_date')
    search_fields = ('title', 'description', 'location_name')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [VolunteerInline]


@admin.register(Volunteer)
class VolunteerAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'phone', 'event', 'attendance_status', 'registered_at')
    list_filter = ('attendance_status', 'event')
    search_fields = ('full_name', 'email', 'phone')
    list_editable = ('attendance_status',)


@admin.register(EcoActivity)
class EcoActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'title', 'items_avoided_count', 'plastic_saved_grams', 'eco_points_earned', 'activity_date')
    list_filter = ('activity_type', 'activity_date')
    search_fields = ('user__username', 'title')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'replied', 'created_at')
    list_filter = ('is_read', 'replied', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    list_editable = ('is_read', 'replied')


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'category', 'points_required')
    search_fields = ('name', 'slug', 'description')
    list_filter = ('category',)


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    list_filter = ('badge', 'earned_at')
    search_fields = ('user__username', 'badge__name')


@admin.register(DailyChallenge)
class DailyChallengeAdmin(admin.ModelAdmin):
    list_display = ('title', 'challenge_type', 'points_reward', 'plastic_saved_grams', 'is_active')
    list_filter = ('challenge_type', 'is_active')
    search_fields = ('title', 'description')


@admin.register(UserChallenge)
class UserChallengeAdmin(admin.ModelAdmin):
    list_display = ('user', 'challenge', 'date_completed', 'completed')
    list_filter = ('date_completed', 'completed')
    search_fields = ('user__username', 'challenge__title')


@admin.register(CommunityStory)
class CommunityStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'author_name', 'category', 'featured', 'created_at')
    list_filter = ('category', 'featured', 'created_at')
    search_fields = ('title', 'content', 'author_name')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')
    search_fields = ('user__username', 'title', 'message')
    list_editable = ('is_read',)
