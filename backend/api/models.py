import random
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    objects = models.Manager()

    ROLE_CHOICES = (
        ('user', 'Normal User'),
        ('admin', 'Administrator'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    phone = models.CharField(max_length=20, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='Narasaraopet')
    state = models.CharField(max_length=100, blank=True, default='Andhra Pradesh')
    bio = models.TextField(blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    eco_points = models.IntegerField(default=50)
    level = models.IntegerField(default=1)
    plastic_saved_total_grams = models.IntegerField(default=0)
    pledge_taken = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def update_level(self):
        """Calculate and update user level based on points"""
        pts = self.eco_points
        if pts >= 600:
            new_level = 5  # Forest Master
        elif pts >= 400:
            new_level = 4  # Tree Guardian
        elif pts >= 250:
            new_level = 3  # Sapling Champion
        elif pts >= 100:
            new_level = 2  # Sprout Crusader
        else:
            new_level = 1  # Seedling Advocate
        if self.level != new_level:
            setattr(self, 'level', new_level)
            self.save(update_fields=['level'])
        return self.level

    @property
    def level_title(self):
        titles = {
            1: 'Seedling Advocate',
            2: 'Sprout Crusader',
            3: 'Sapling Champion',
            4: 'Tree Guardian',
            5: 'Forest Master',
        }
        return titles.get(getattr(self, 'level', 1), 'Eco Advocate')

    def __str__(self):
        return f"{self.user.username} ({self.role}) - Level {self.level}"


class Pledge(models.Model):
    objects = models.Manager()

    CATEGORY_CHOICES = (
        ('individual', 'Individual Citizen'),
        ('student', 'Student / Youth'),
        ('household', 'Household / Family'),
        ('merchant', 'Merchant / Retailer'),
        ('institution', 'School / Institution'),
    )

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='pledges')
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, default='')
    city = models.CharField(max_length=100, default='Narasaraopet')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='individual')
    pledge_statement = models.TextField(default="I pledge to minimize single-use plastics, adopt eco-friendly alternatives, and safeguard our local environment.")
    commitments = models.JSONField(default=list, help_text="List of commitments chosen by user")
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Pledge by {self.full_name} ({self.city})"


class WasteReport(models.Model):
    objects = models.Manager()

    CATEGORY_CHOICES = (
        ('dump_yard', 'Illegal Dump Yard'),
        ('waterbody', 'Water Body / Stream / Pond'),
        ('roadside', 'Roadside / Public Footpath'),
        ('school_park', 'School / Community Park'),
        ('commercial', 'Commercial / Market Area'),
        ('other', 'Other Location'),
    )

    SEVERITY_CHOICES = (
        ('low', 'Low (Minor litter)'),
        ('medium', 'Medium (Noticeable buildup)'),
        ('high', 'High (Heavy accumulation)'),
        ('critical', 'Critical (Environmental / health hazard)'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('approved', 'Approved & Scheduled'),
        ('under_review', 'Under Review'),
        ('in_progress', 'Cleanup In Progress'),
        ('resolved', 'Resolved & Cleaned'),
        ('rejected', 'Rejected / Inaccurate'),
        ('dismissed', 'Dismissed / Inaccurate'),
    )

    tracking_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='waste_reports')
    reporter_name = models.CharField(max_length=150)
    reporter_phone = models.CharField(max_length=20)
    reporter_email = models.EmailField(blank=True, default='')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='roadside')
    waste_severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='medium')
    location_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default='Narasaraopet')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    image = models.ImageField(upload_to='waste_reports/', null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, default='')
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.tracking_id:
            rand_num = random.randint(1000, 9999)
            setattr(self, 'tracking_id', f"WR-2026-{rand_num}")
        super().save(*args, **kwargs)

    def __str__(self):
        tracking = self.tracking_id or f"#{self.pk}"
        status_display = getattr(self, 'get_status_display')()
        return f"Report {tracking}: {self.title} [{status_display}]"


class Campaign(models.Model):
    objects = models.Manager()

    CATEGORY_CHOICES = (
        ('awareness', 'Community Awareness Drive'),
        ('school_outreach', 'School & Student Education'),
        ('plastic_ban', 'Single-Use Plastic Ban'),
        ('recycling_drive', 'Plastic Collection & Recycling'),
        ('policy_advocacy', 'Local Civic Advocacy'),
    )

    STATUS_CHOICES = (
        ('active', 'Active & Ongoing'),
        ('upcoming', 'Upcoming Event'),
        ('completed', 'Successfully Completed'),
    )

    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=250, blank=True, default='')
    description = models.TextField()
    objective = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='awareness')
    target_reach = models.IntegerField(default=500)
    current_reach = models.IntegerField(default=0)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to='campaigns/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return str(self.title)


class CleanupEvent(models.Model):
    objects = models.Manager()

    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()
    organizer = models.CharField(max_length=150, default='Plastic-Free Community Team')
    event_date = models.DateTimeField()
    location_name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default='Narasaraopet')
    target_volunteers = models.IntegerField(default=30)
    waste_collected_kg = models.DecimalField(max_digits=7, decimal_places=2, default=0.0)
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['event_date']

    def __str__(self):
        return f"{self.title} on {self.event_date.strftime('%Y-%m-%d')}"

    @property
    def registered_count(self):
        volunteers_mgr = getattr(self, 'volunteers', None)
        if volunteers_mgr is not None:
            return volunteers_mgr.filter(attendance_status__in=['registered', 'confirmed', 'attended']).count()
        return 0


class Volunteer(models.Model):
    objects = models.Manager()

    ATTENDANCE_CHOICES = (
        ('registered', 'Registered'),
        ('confirmed', 'Confirmed Attendance'),
        ('attended', 'Attended & Participated'),
        ('cancelled', 'Cancelled Registration'),
    )

    event = models.ForeignKey(CleanupEvent, on_delete=models.CASCADE, related_name='volunteers')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='volunteered_events')
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    emergency_contact = models.CharField(max_length=50, blank=True, default='')
    attendance_status = models.CharField(max_length=20, choices=ATTENDANCE_CHOICES, default='registered')
    notes = models.TextField(blank=True, default='')
    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'email')
        ordering = ['-registered_at']

    def __str__(self):
        return f"{self.full_name} - {self.event.title}"


class EcoActivity(models.Model):
    objects = models.Manager()

    ACTIVITY_CHOICES = (
        ('reusable_bag', 'Carried Reusable Cloth/Jute Bag'),
        ('avoid_plastic_bottle', 'Used Refillable Steel/Glass Bottle'),
        ('recycle_plastic', 'Segregated & Recycled Household Plastics'),
        ('cleanup_participation', 'Joined Local Cleanup or Litter Pick-up'),
        ('reusable_container', 'Opted for Reusable Meal Container/Cutlery'),
        ('eco_pledge_shared', 'Spread Plastic-Free Awareness in Community'),
        ('other', 'Other Sustainable Eco Action'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='eco_activities')
    activity_type = models.CharField(max_length=50, choices=ACTIVITY_CHOICES)
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True, default='')
    items_avoided_count = models.PositiveIntegerField(default=1)
    plastic_saved_grams = models.PositiveIntegerField(default=50)
    eco_points_earned = models.PositiveIntegerField(default=15)
    activity_date = models.DateField(default=timezone.localdate)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-activity_date', '-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.title} (+{self.eco_points_earned} pts)"


class ContactMessage(models.Model):
    objects = models.Manager()

    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=25, blank=True, default='')
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    replied = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name}: {self.subject}"


# ==========================================
# ADVANCED EXTENSIONS (Gamification, Alerts, Stories)
# ==========================================

class Notification(models.Model):
    objects = models.Manager()

    TYPE_CHOICES = (
        ('achievement', 'Achievement / Badge Unlocked'),
        ('report_status', 'Waste Report Status Update'),
        ('pledge', 'Pledge Milestone'),
        ('event', 'Cleanup Drive Notification'),
        ('points', 'Eco Points Credited'),
        ('announcement', 'Community Announcement'),
        ('system', 'System Message'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='system')
    link = models.CharField(max_length=200, blank=True, default='')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"


class Badge(models.Model):
    objects = models.Manager()

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, default='Award')  # Lucide icon identifier
    points_required = models.IntegerField(default=0)
    category = models.CharField(max_length=50, default='milestone')

    def __str__(self):
        return str(self.name)


class UserBadge(models.Model):
    objects = models.Manager()

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='earned_badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='recipients')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.user.username} earned {self.badge.name}"


class DailyChallenge(models.Model):
    objects = models.Manager()

    title = models.CharField(max_length=200)
    description = models.TextField()
    challenge_type = models.CharField(max_length=50, default='refuse_plastic')
    points_reward = models.IntegerField(default=25)
    plastic_saved_grams = models.IntegerField(default=100)
    icon = models.CharField(max_length=50, default='Sparkles')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (+{self.points_reward} pts)"


class UserChallenge(models.Model):
    objects = models.Manager()

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='completed_challenges')
    challenge = models.ForeignKey(DailyChallenge, on_delete=models.CASCADE)
    date_completed = models.DateField(default=timezone.localdate)
    completed = models.BooleanField(default=True)

    class Meta:
        unique_together = ('user', 'challenge', 'date_completed')

    def __str__(self):
        return f"{self.user.username} completed {self.challenge.title} on {self.date_completed}"


class CommunityStory(models.Model):
    objects = models.Manager()

    CATEGORY_CHOICES = (
        ('story', 'Impact Story'),
        ('announcement', 'Civic Announcement'),
        ('update', 'Field Project Update'),
        ('achievement', 'Milestone Celebration'),
    )

    title = models.CharField(max_length=250)
    slug = models.SlugField(max_length=260, unique=True, blank=True)
    author_name = models.CharField(max_length=150, default='CSP Research Team')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='story')
    content = models.TextField()
    impact_summary = models.CharField(max_length=255, blank=True, default='')
    image = models.ImageField(upload_to='stories/', null=True, blank=True)
    likes_count = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.category}] {self.title}"
