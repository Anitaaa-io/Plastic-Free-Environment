from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, UserProfileView, UserProfileUpdateView, ChangePasswordView,
    UserDashboardSummaryView, NotificationViewSet, BadgeListView,
    DailyChallengeViewSet, CommunityStoryViewSet, EcoAIAssistantView,
    AdminExportCSVView, PledgeListCreateView, MyPledgesView,
    WasteReportViewSet, MyWasteReportsView, UpdateWasteReportStatusView,
    CleanupEventViewSet, VolunteerRegistrationView, MyVolunteeredEventsView,
    CampaignViewSet, EcoActivityViewSet, EcoLeaderboardView,
    ContactMessageViewSet, PublicOverviewView, AdminAnalyticsView,
    CustomTokenObtainPairView
)

router = DefaultRouter()
router.register(r'waste-reports', WasteReportViewSet, basename='waste-report')
router.register(r'cleanup-events', CleanupEventViewSet, basename='cleanup-event')
router.register(r'campaigns', CampaignViewSet, basename='campaign')
router.register(r'eco-activities', EcoActivityViewSet, basename='eco-activity')
router.register(r'contact', ContactMessageViewSet, basename='contact-message')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'daily-challenges', DailyChallengeViewSet, basename='daily-challenge')
router.register(r'stories', CommunityStoryViewSet, basename='community-story')

urlpatterns = [
    # Authentication & User Management
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='auth_profile'),
    path('auth/profile/update/', UserProfileUpdateView.as_view(), name='auth_profile_update'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth_change_password'),

    # User Dashboard Summary
    path('user/dashboard-summary/', UserDashboardSummaryView.as_view(), name='user_dashboard_summary'),

    # Badges & Gamification
    path('badges/', BadgeListView.as_view(), name='badge_list'),

    # Pledges
    path('pledges/', PledgeListCreateView.as_view(), name='pledges_list_create'),
    path('pledges/my-pledges/', MyPledgesView.as_view(), name='my_pledges'),

    # Waste Reports custom endpoints
    path('waste-reports/my-reports/', MyWasteReportsView.as_view(), name='my_waste_reports'),
    path('waste-reports/<int:pk>/status/', UpdateWasteReportStatusView.as_view(), name='update_waste_report_status'),

    # Cleanup Events volunteering
    path('cleanup-events/<int:event_id>/volunteer/', VolunteerRegistrationView.as_view(), name='volunteer_register'),
    path('cleanup-events/my-volunteering/', MyVolunteeredEventsView.as_view(), name='my_volunteering'),

    # Eco Leaderboard
    path('eco-activities/leaderboard/', EcoLeaderboardView.as_view(), name='eco_leaderboard'),

    # AI Sustainability Assistant
    path('ai-assistant/chat/', EcoAIAssistantView.as_view(), name='ai_assistant_chat'),

    # Public Overview & Admin Analytics / Exports
    path('public/overview/', PublicOverviewView.as_view(), name='public_overview'),
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin_analytics'),
    path('admin/export-csv/', AdminExportCSVView.as_view(), name='admin_export_csv'),

    # Router URLs
    path('', include(router.urls)),
]
