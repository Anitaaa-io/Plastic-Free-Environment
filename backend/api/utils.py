from .models import Notification, Badge, UserBadge

def create_notification(user, title, message, notification_type='system', link=''):
    """Helper to create an in-app notification for a user"""
    if not user or not user.is_authenticated:
        return None
    try:
        return Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            link=link
        )
    except Exception:
        return None

def award_badge(user, slug, notify=True):
    """Safely award a badge to user if not already earned"""
    if not user or not user.is_authenticated:
        return False
    try:
        badge = Badge.objects.filter(slug=slug).first()
        if not badge:
            return False
        user_badge, created = UserBadge.objects.get_or_create(user=user, badge=badge)
        if created and notify:
            create_notification(
                user=user,
                title=f"🏆 Achievement Unlocked: {badge.name}!",
                message=badge.description,
                notification_type='achievement',
                link='/profile'
            )
        return created
    except Exception:
        return False

def check_and_award_badges(user):
    """Evaluate criteria and award all eligible badges for user"""
    if not user or not user.is_authenticated:
        return []
    
    awarded = []
    
    # 1. Pledge Pioneer
    if hasattr(user, 'profile') and user.profile.pledge_taken:
        if award_badge(user, 'pledge-pioneer'):
            awarded.append('pledge-pioneer')
    elif user.pledges.exists():
        if award_badge(user, 'pledge-pioneer'):
            awarded.append('pledge-pioneer')
            
    # 2. Eco Scout (1+ waste reports)
    reports_count = user.waste_reports.count()
    if reports_count >= 1:
        if award_badge(user, 'eco-scout'):
            awarded.append('eco-scout')
            
    # 3. Waste Warrior (3+ waste reports)
    if reports_count >= 3:
        if award_badge(user, 'waste-warrior'):
            awarded.append('waste-warrior')
            
    # 4. Cleanup Hero (1+ volunteer registrations)
    if user.volunteered_events.exists():
        if award_badge(user, 'cleanup-hero'):
            awarded.append('cleanup-hero')
            
    # Points based badges
    if hasattr(user, 'profile'):
        pts = user.profile.eco_points
        if pts >= 100:
            if award_badge(user, 'centurion'):
                awarded.append('centurion')
        if pts >= 400:
            if award_badge(user, 'forest-guardian'):
                awarded.append('forest-guardian')
        if pts >= 600:
            if award_badge(user, 'zero-waste-master'):
                awarded.append('zero-waste-master')
                
    return awarded

