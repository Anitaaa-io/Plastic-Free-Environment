import csv
from datetime import timedelta
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count, Sum
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import generics, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .ai_knowledge import answer_environmental_query
from .models import (
    Badge, Campaign, CleanupEvent, CommunityStory, ContactMessage,
    DailyChallenge, EcoActivity, Notification, Pledge, UserBadge,
    UserChallenge, UserProfile, WasteReport, Volunteer
)
from .permissions import IsAdminRole, IsOwnerOrAdmin
from .serializers import (
    BadgeSerializer, CampaignSerializer, ChangePasswordSerializer,
    CleanupEventSerializer, CommunityStorySerializer, ContactMessageSerializer,
    CustomTokenObtainPairSerializer, DailyChallengeSerializer,
    EcoActivitySerializer, NotificationSerializer, PledgeSerializer,
    UserBadgeSerializer, UserProfileSerializer, UserProfileUpdateSerializer,
    UserRegistrationSerializer, UserSerializer, VolunteerSerializer,
    WasteReportSerializer
)
from .utils import check_and_award_badges, create_notification


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        user_data = UserSerializer(user).data

        create_notification(
            user=user,
            title="Welcome to the Plastic-Free Platform! 🌱",
            message=f"Welcome {user.first_name or user.username}! Start by taking the sustainability pledge and exploring daily challenges.",
            notification_type="system",
            link="/dashboard"
        )

        return Response({
            "message": "User registered successfully.",
            "user": user_data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        user = self.request.user
        profile = getattr(user, 'profile', None)
        if profile is not None:
            profile.update_level()
        return user


class UserProfileUpdateView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileUpdateSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_object(self):
        return self.request.user


class ChangePasswordView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        validated = getattr(serializer, 'validated_data', {})
        old_password = validated.get('old_password', '') if isinstance(validated, dict) else ''
        new_password = validated.get('new_password', '') if isinstance(validated, dict) else ''
        if not user.check_password(str(old_password)):
            return Response({"old_password": ["Current password is incorrect."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(str(new_password))
        user.save()

        create_notification(
            user=user,
            title="Security Alert: Password Updated",
            message="Your account password was successfully updated.",
            notification_type="system"
        )

        return Response({"message": "Password changed successfully."})


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({"unread_count": count})

    @action(detail=True, methods=['patch', 'post'])
    def read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save(update_fields=['is_read'])
        return Response(NotificationSerializer(notif).data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read."})


class PledgeListCreateView(generics.ListCreateAPIView):
    serializer_class = PledgeSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return Pledge.objects.filter(is_public=True)

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()


class MyPledgesView(generics.ListAPIView):
    serializer_class = PledgeSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Pledge.objects.filter(user=self.request.user)


class WasteReportViewSet(viewsets.ModelViewSet):
    serializer_class = WasteReportSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            return [AllowAny()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsOwnerOrAdmin()]
        return [IsAdminRole()]

    def get_queryset(self):
        queryset = WasteReport.objects.all()
        category = self.request.query_params.get('category')
        status_param = self.request.query_params.get('status')
        tracking_id = self.request.query_params.get('tracking_id')
        if category:
            queryset = queryset.filter(category=category)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if tracking_id:
            queryset = queryset.filter(tracking_id__iexact=tracking_id)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        report = serializer.save(user=user)

        if user:
            # Award initial reporting points & notification
            create_notification(
                user=user,
                title=f"Report #{report.tracking_id} Submitted!",
                message=f"Your waste report '{report.title}' is currently Pending review by administrators.",
                notification_type="report_status",
                link="/waste-reports"
            )
            check_and_award_badges(user)


class MyWasteReportsView(generics.ListAPIView):
    serializer_class = WasteReportSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return WasteReport.objects.filter(user=self.request.user)


class UpdateWasteReportStatusView(views.APIView):
    permission_classes = (IsAdminRole,)

    def patch(self, request, pk):
        try:
            report = WasteReport.objects.get(pk=pk)
        except ObjectDoesNotExist:
            return Response({"error": "Report not found."}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes', '')

        if new_status:
            report.status = new_status
            if new_status == 'resolved':
                report.resolved_at = timezone.now()
        if admin_notes:
            report.admin_notes = admin_notes
        report.save()

        # Notify the reporter if registered user
        if report.user:
            title_map = {
                'approved': 'Waste Report Approved & Scheduled! (+50 Eco Points)',
                'in_progress': 'Cleanup In Progress on Your Waste Report',
                'resolved': 'Waste Report Resolved & Cleaned Up! (+100 Eco Points)',
                'rejected': 'Update on Your Waste Report Submission',
            }
            create_notification(
                user=report.user,
                title=title_map.get(new_status, f"Report Status Updated: {report.get_status_display()}"),
                message=f"Your report {report.tracking_id} ('{report.title}') is now marked as '{report.get_status_display()}'. {admin_notes}".strip(),
                notification_type="report_status",
                link="/waste-reports"
            )

            # Bonus points for approved or resolved
            if new_status == 'approved':
                report.user.profile.eco_points += 50
                report.user.profile.update_level()
                report.user.profile.save()
            elif new_status == 'resolved':
                report.user.profile.eco_points += 100
                report.user.profile.update_level()
                report.user.profile.save()

            check_and_award_badges(report.user)

        return Response(WasteReportSerializer(report, context={'request': request}).data)


class CleanupEventViewSet(viewsets.ModelViewSet):
    serializer_class = CleanupEventSerializer
    lookup_field = 'id'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        queryset = CleanupEvent.objects.all()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title', 'cleanup-event')
        import re
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')
        base_slug = slug
        counter = 1
        while CleanupEvent.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        serializer.save(slug=slug, created_by=self.request.user if self.request.user.is_authenticated else None)


class VolunteerRegistrationView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request, event_id):
        try:
            event = CleanupEvent.objects.get(pk=event_id)
        except ObjectDoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        email = request.data.get('email', '').lower().strip()
        if not email:
            return Response({"email": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        if Volunteer.objects.filter(event=event, email=email).exists():
            return Response({"error": "You have already registered for this event with this email."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user if request.user.is_authenticated else None
        volunteer = Volunteer.objects.create(
            event=event,
            user=user,
            full_name=request.data.get('full_name', ''),
            email=email,
            phone=request.data.get('phone', ''),
            emergency_contact=request.data.get('emergency_contact', ''),
            notes=request.data.get('notes', '')
        )

        # Award points if user is logged in
        if user and hasattr(user, 'profile'):
            user.profile.eco_points += 40
            user.profile.update_level()
            user.profile.save()
            check_and_award_badges(user)
            create_notification(
                user=user,
                title="Cleanup Registration Confirmed! (+40 pts)",
                message=f"You are registered for '{event.title}' on {event.event_date.strftime('%B %d, %Y')}.",
                notification_type="event",
                link="/cleanup-events"
            )

        return Response({
            "message": "Registered successfully as a volunteer!",
            "volunteer": VolunteerSerializer(volunteer).data
        }, status=status.HTTP_201_CREATED)


class MyVolunteeredEventsView(generics.ListAPIView):
    serializer_class = VolunteerSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Volunteer.objects.filter(user=self.request.user)


class CampaignViewSet(viewsets.ModelViewSet):
    serializer_class = CampaignSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        queryset = Campaign.objects.all()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset


class EcoActivityViewSet(viewsets.ModelViewSet):
    serializer_class = EcoActivitySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        is_admin_user = getattr(self.request.user, 'is_staff', False) or getattr(getattr(self.request.user, 'profile', None), 'role', None) == 'admin'
        if is_admin_user:
            return EcoActivity.objects.all()
        return EcoActivity.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EcoLeaderboardView(views.APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        top_profiles = UserProfile.objects.select_related('user').order_by('-eco_points')[:15]
        data = [
            {
                "id": p.user.id,
                "username": p.user.username,
                "full_name": f"{p.user.first_name} {p.user.last_name}".strip() or p.user.username,
                "city": p.city,
                "eco_points": p.eco_points,
                "level": p.level,
                "level_title": p.level_title,
                "plastic_saved_grams": p.plastic_saved_total_grams,
                "pledge_taken": p.pledge_taken,
                "role": p.role,
            }
            for p in top_profiles
        ]
        return Response(data)


class BadgeListView(views.APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        badges = Badge.objects.all().order_by('points_required')
        serializer = BadgeSerializer(badges, many=True, context={'user': request.user})
        return Response(serializer.data)


class DailyChallengeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = DailyChallengeSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return DailyChallenge.objects.filter(is_active=True)

    def get_serializer_context(self):
        return {'user': self.request.user}

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def complete(self, request, pk=None):
        challenge = self.get_object()
        today = timezone.localdate()
        existing = UserChallenge.objects.filter(user=request.user, challenge=challenge, date_completed=today).first()
        if existing:
            return Response({"error": "You have already completed this daily challenge today!"}, status=status.HTTP_400_BAD_REQUEST)

        UserChallenge.objects.create(
            user=request.user,
            challenge=challenge,
            date_completed=today,
            completed=True
        )

        profile = request.user.profile
        profile.eco_points += challenge.points_reward
        profile.plastic_saved_total_grams += challenge.plastic_saved_grams
        profile.update_level()
        profile.save()

        # Record activity
        EcoActivity.objects.create(
            user=request.user,
            activity_type='other',
            title=f"Challenge: {challenge.title}",
            description=f"Completed daily challenge: {challenge.description}",
            items_avoided_count=1,
            plastic_saved_grams=challenge.plastic_saved_grams,
            eco_points_earned=challenge.points_reward,
            activity_date=today
        )

        check_and_award_badges(request.user)
        create_notification(
            user=request.user,
            title="🎯 Daily Challenge Completed!",
            message=f"You earned +{challenge.points_reward} eco points and prevented {challenge.plastic_saved_grams}g of plastic!",
            notification_type="points",
            link="/dashboard"
        )

        return Response({
            "message": f"Awesome! You completed '{challenge.title}' and earned +{challenge.points_reward} eco points!",
            "points_earned": challenge.points_reward,
            "plastic_saved_grams": challenge.plastic_saved_grams,
            "total_points": profile.eco_points,
            "level": profile.level,
            "level_title": profile.level_title
        })


class CommunityStoryViewSet(viewsets.ModelViewSet):
    serializer_class = CommunityStorySerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'like']:
            return [AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        qs = CommunityStory.objects.all()
        cat = self.request.query_params.get('category')
        if cat:
            qs = qs.filter(category=cat)
        return qs

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def like(self, request, pk=None):
        story = self.get_object()
        story.likes_count += 1
        story.save(update_fields=['likes_count'])
        return Response({"likes_count": story.likes_count})


class EcoAIAssistantView(views.APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        prompt = (request.data.get('prompt') or request.data.get('message') or '').strip()
        if not prompt:
            return Response({"error": "Prompt cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
        result = answer_environmental_query(prompt)
        return Response(result)


class AdminExportCSVView(views.APIView):
    permission_classes = (IsAdminRole,)

    def get(self, request):
        export_type = request.query_params.get('type', 'reports')
        timestamp = timezone.now().strftime('%Y%m%d_%H%M%S')
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = f'attachment; filename="plastic_free_{export_type}_{timestamp}.csv"'
        writer = csv.writer(response)

        if export_type == 'reports':
            writer.writerow(['Tracking ID', 'Reporter', 'Phone', 'Email', 'Title', 'Category', 'Severity', 'Location', 'City', 'Status', 'Date'])
            for r in WasteReport.objects.all():
                writer.writerow([r.tracking_id or f'#{r.id}', r.reporter_name, r.reporter_phone, r.reporter_email, r.title, r.get_category_display(), r.get_waste_severity_display(), r.location_address, r.city, r.get_status_display(), r.created_at.strftime('%Y-%m-%d %H:%M')])
        elif export_type == 'pledges':
            writer.writerow(['Name', 'Email', 'Phone', 'City', 'Category', 'Commitments Count', 'Statement', 'Date'])
            for p in Pledge.objects.all():
                writer.writerow([p.full_name, p.email, p.phone, p.get_category_display(), len(p.commitments), p.pledge_statement, p.created_at.strftime('%Y-%m-%d %H:%M')])
        elif export_type == 'volunteers':
            writer.writerow(['Event', 'Volunteer Name', 'Email', 'Phone', 'Status', 'Registered At'])
            for v in Volunteer.objects.select_related('event').all():
                writer.writerow([v.event.title, v.full_name, v.email, v.phone, v.get_attendance_status_display(), v.registered_at.strftime('%Y-%m-%d %H:%M')])
        elif export_type == 'activities':
            writer.writerow(['User', 'Activity Type', 'Title', 'Items Avoided', 'Plastic Saved (g)', 'Eco Points', 'Date'])
            for a in EcoActivity.objects.select_related('user').all():
                writer.writerow([a.user.username, a.get_activity_type_display(), a.title, a.items_avoided_count, a.plastic_saved_grams, a.eco_points_earned, a.activity_date.strftime('%Y-%m-%d')])
        else:
            return Response({"error": "Invalid export type. Choose reports, pledges, volunteers, or activities."}, status=status.HTTP_400_BAD_REQUEST)

        return response


class UserDashboardSummaryView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)
        if not profile:
            profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.update_level()

        check_and_award_badges(user)

        user_pledges = Pledge.objects.filter(user=user)
        user_reports = WasteReport.objects.filter(user=user)
        user_cleanups = Volunteer.objects.filter(user=user)
        user_activities = EcoActivity.objects.filter(user=user)

        earned_badges = UserBadge.objects.filter(user=user).select_related('badge')
        total_badges = Badge.objects.count()

        today = timezone.localdate()
        daily_challenges = DailyChallenge.objects.filter(is_active=True)
        completed_challenge_ids = set(UserChallenge.objects.filter(user=user, date_completed=today).values_list('challenge_id', flat=True))

        challenges_data = [
            {
                "id": c.id,
                "title": c.title,
                "description": c.description,
                "points_reward": c.points_reward,
                "plastic_saved_grams": c.plastic_saved_grams,
                "icon": c.icon,
                "completed_today": c.id in completed_challenge_ids
            }
            for c in daily_challenges
        ]

        unread_notifications = Notification.objects.filter(user=user, is_read=False).count()

        return Response({
            "profile": UserProfileSerializer(profile, context={'request': request}).data,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
            },
            "stats": {
                "eco_points": profile.eco_points,
                "level": profile.level,
                "level_title": profile.level_title,
                "plastic_saved_grams": profile.plastic_saved_total_grams,
                "plastic_saved_kg": round(profile.plastic_saved_total_grams / 1000.0, 2),
                "pledges_count": user_pledges.count(),
                "reports_count": user_reports.count(),
                "cleanups_count": user_cleanups.count(),
                "activities_count": user_activities.count(),
                "badges_earned_count": earned_badges.count(),
                "total_badges_count": total_badges,
                "unread_notifications": unread_notifications,
            },
            "recent_reports": WasteReportSerializer(user_reports[:5], many=True, context={'request': request}).data,
            "recent_activities": EcoActivitySerializer(user_activities[:6], many=True).data,
            "earned_badges": UserBadgeSerializer(earned_badges, many=True).data,
            "daily_challenges": challenges_data,
        })


class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        return ContactMessage.objects.all()


class PublicOverviewView(views.APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        total_pledges = Pledge.objects.count()
        total_reports = WasteReport.objects.count()
        resolved_reports = WasteReport.objects.filter(status='resolved').count()
        total_events = CleanupEvent.objects.count()
        total_volunteers = Volunteer.objects.count()
        total_users = User.objects.count()

        total_plastic_grams = EcoActivity.objects.aggregate(total=Sum('plastic_saved_grams'))['total'] or 0
        total_waste_collected_kg = CleanupEvent.objects.aggregate(total=Sum('waste_collected_kg'))['total'] or 0
        total_saved_kg = round(float(total_plastic_grams) / 1000.0 + float(total_waste_collected_kg), 1)

        recent_pledges = PledgeSerializer(Pledge.objects.order_by('-created_at')[:6], many=True).data
        upcoming_events = CleanupEventSerializer(CleanupEvent.objects.filter(status='upcoming')[:3], many=True, context={'request': request}).data
        featured_campaigns = CampaignSerializer(Campaign.objects.filter(status='active', featured=True)[:3], many=True, context={'request': request}).data
        recent_stories = CommunityStorySerializer(CommunityStory.objects.order_by('-created_at')[:3], many=True, context={'request': request}).data

        return Response({
            "stats": {
                "total_users": total_users,
                "total_pledges": total_pledges,
                "total_reports": total_reports,
                "resolved_reports": resolved_reports,
                "total_events": total_events,
                "total_volunteers": total_volunteers,
                "total_plastic_saved_kg": total_saved_kg,
            },
            "recent_pledges": recent_pledges,
            "upcoming_events": upcoming_events,
            "featured_campaigns": featured_campaigns,
            "recent_stories": recent_stories,
        })


class AdminAnalyticsView(views.APIView):
    permission_classes = (IsAdminRole,)

    def get(self, request):
        total_users = User.objects.count()
        total_pledges = Pledge.objects.count()
        total_reports = WasteReport.objects.count()
        pending_reports = WasteReport.objects.filter(status='pending').count()
        approved_reports = WasteReport.objects.filter(status='approved').count()
        resolved_reports = WasteReport.objects.filter(status='resolved').count()
        total_events = CleanupEvent.objects.count()
        total_volunteers = Volunteer.objects.count()
        total_messages = ContactMessage.objects.count()
        unread_messages = ContactMessage.objects.filter(is_read=False).count()

        # Waste reports by category
        reports_by_category = list(WasteReport.objects.values('category').annotate(count=Count('id')).order_by('-count'))
        category_labels = dict(WasteReport.CATEGORY_CHOICES)
        category_data = [
            {"name": category_labels.get(item['category'], item['category']), "count": item['count'], "key": item['category']}
            for item in reports_by_category
        ]

        # Waste reports by status
        reports_by_status = list(WasteReport.objects.values('status').annotate(count=Count('id')))
        status_labels = dict(WasteReport.STATUS_CHOICES)
        status_data = [
            {"name": status_labels.get(item['status'], item['status']), "count": item['count'], "key": item['status']}
            for item in reports_by_status
        ]

        # Eco activities breakdown
        activities_breakdown = list(EcoActivity.objects.values('activity_type').annotate(
            count=Count('id'),
            total_saved_grams=Sum('plastic_saved_grams'),
            total_points=Sum('eco_points_earned')
        ).order_by('-count'))
        activity_labels = dict(EcoActivity.ACTIVITY_CHOICES)
        activity_data = [
            {
                "name": activity_labels.get(item['activity_type'], item['activity_type']),
                "count": item['count'],
                "saved_kg": round(item['total_saved_grams'] / 1000.0, 2) if item['total_saved_grams'] else 0,
                "points": item['total_points'] or 0
            }
            for item in activities_breakdown
        ]

        # Monthly trends (last 6 months approximation)
        now = timezone.now()
        monthly_trend = []
        for i in range(5, -1, -1):
            month_date = now - timedelta(days=i * 30)
            month_name = month_date.strftime('%b %Y')
            month_reports = WasteReport.objects.filter(created_at__month=month_date.month, created_at__year=month_date.year).count()
            month_pledges = Pledge.objects.filter(created_at__month=month_date.month, created_at__year=month_date.year).count()
            monthly_trend.append({
                "month": month_name,
                "reports": month_reports,
                "pledges": month_pledges
            })

        # Recent items
        recent_reports = WasteReportSerializer(WasteReport.objects.order_by('-created_at')[:10], many=True, context={'request': request}).data
        recent_pledges = PledgeSerializer(Pledge.objects.order_by('-created_at')[:8], many=True).data
        recent_volunteers = VolunteerSerializer(Volunteer.objects.order_by('-registered_at')[:8], many=True).data
        recent_messages = ContactMessageSerializer(ContactMessage.objects.order_by('-created_at')[:8], many=True).data

        return Response({
            "metrics": {
                "total_users": total_users,
                "total_pledges": total_pledges,
                "total_reports": total_reports,
                "pending_reports": pending_reports,
                "approved_reports": approved_reports,
                "resolved_reports": resolved_reports,
                "total_events": total_events,
                "total_volunteers": total_volunteers,
                "total_messages": total_messages,
                "unread_messages": unread_messages,
            },
            "category_data": category_data,
            "status_data": status_data,
            "activity_data": activity_data,
            "monthly_trend": monthly_trend,
            "recent_reports": recent_reports,
            "recent_pledges": recent_pledges,
            "recent_volunteers": recent_volunteers,
            "recent_messages": recent_messages,
        })
