from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    UserProfile, Pledge, WasteReport, Campaign, CleanupEvent,
    Volunteer, EcoActivity, ContactMessage,
    Notification, Badge, UserBadge, DailyChallenge, UserChallenge, CommunityStory
)
from .utils import award_badge, check_and_award_badges, create_notification


class UserProfileSerializer(serializers.ModelSerializer):
    level_title = serializers.CharField(read_only=True)
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = (
            'role', 'phone', 'city', 'state', 'bio', 'avatar', 'avatar_url',
            'eco_points', 'level', 'level_title', 'plastic_saved_total_grams',
            'pledge_taken', 'created_at'
        )
        read_only_fields = ('eco_points', 'level', 'level_title', 'plastic_saved_total_grams', 'pledge_taken', 'created_at')

    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'profile')
        read_only_fields = ('id', 'is_staff')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get('username', '').strip()
        password = attrs.get('password', '')

        target_username = username_or_email
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email__iexact=username_or_email)
                target_username = user_obj.username
            except (ObjectDoesNotExist, MultipleObjectsReturned):
                pass
        else:
            try:
                user_obj = User.objects.get(username__iexact=username_or_email)
                target_username = user_obj.username
            except ObjectDoesNotExist:
                pass

        user = authenticate(username=target_username, password=password)
        if not user:
            raise serializers.ValidationError({"detail": "Invalid username or password. Please verify your credentials."})

        if not user.is_active:
            raise serializers.ValidationError({"detail": "This account is inactive. Please contact administrator."})

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(source='profile.phone', required=False, allow_blank=True)
    city = serializers.CharField(source='profile.city', required=False, allow_blank=True)
    state = serializers.CharField(source='profile.state', required=False, allow_blank=True)
    bio = serializers.CharField(source='profile.bio', required=False, allow_blank=True)
    avatar = serializers.ImageField(source='profile.avatar', required=False, allow_null=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'phone', 'city', 'state', 'bio', 'avatar')

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        new_email = validated_data.get('email', instance.email)
        if new_email and new_email != instance.email:
            if User.objects.filter(email__iexact=new_email).exclude(pk=instance.pk).exists():
                raise serializers.ValidationError({"email": "This email address is already in use."})
            instance.email = new_email
        instance.save()

        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "New passwords do not match."})
        return attrs


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=UserProfile.ROLE_CHOICES, default='user', write_only=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, write_only=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password2', 'role', 'phone', 'city')

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value.lower()

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        role = validated_data.pop('role', 'user')
        phone = validated_data.pop('phone', '')
        city = validated_data.pop('city', 'Narasaraopet')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        
        # Profile is created via signal or retrieved, update extra fields
        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = role
        profile.phone = phone
        profile.city = city
        if role == 'admin':
            user.is_staff = True
            user.save()
        profile.save()

        # Award welcome badge
        award_badge(user, 'pledge-pioneer', notify=False)

        return user


class PledgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pledge
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

    def create(self, validated_data):
        user = validated_data.get('user', None)
        pledge = super().create(validated_data)
        if user and hasattr(user, 'profile'):
            user.profile.pledge_taken = True
            user.profile.eco_points += 50  # Reward points for pledge
            user.profile.update_level()
            user.profile.save()

            award_badge(user, 'pledge-pioneer')
            create_notification(
                user=user,
                title="Pledge Recorded! (+50 Eco Points)",
                message=f"Thank you, {user.first_name or user.username}, for taking the Plastic-Free Commitment!",
                notification_type="pledge",
                link="/pledge"
            )
        return pledge


class WasteReportSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = WasteReport
        fields = '__all__'
        read_only_fields = ('user', 'tracking_id', 'created_at', 'updated_at')

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def validate_image(self, value):
        if value:
            # Validate file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image file size cannot exceed 5MB.")
            # Validate extension
            valid_extensions = ['.jpg', '.jpeg', '.png', '.webp']
            ext = value.name.lower().split('.')[-1]
            if f".{ext}" not in valid_extensions:
                raise serializers.ValidationError("Only JPG, JPEG, PNG, and WEBP images are supported.")
        return value


class CampaignSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = '__all__'
        read_only_fields = ('created_at',)

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class VolunteerSerializer(serializers.ModelSerializer):
    event_title = serializers.ReadOnlyField(source='event.title')
    event_date = serializers.ReadOnlyField(source='event.event_date')
    event_location = serializers.ReadOnlyField(source='event.location_name')

    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ('registered_at',)


class CleanupEventSerializer(serializers.ModelSerializer):
    registered_count = serializers.IntegerField(read_only=True)
    image_url = serializers.SerializerMethodField()
    volunteers = VolunteerSerializer(many=True, read_only=True)

    class Meta:
        model = CleanupEvent
        fields = '__all__'
        read_only_fields = ('created_at', 'registered_count')

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class EcoActivitySerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = EcoActivity
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'plastic_saved_grams', 'eco_points_earned')

    def create(self, validated_data):
        activity_type = validated_data.get('activity_type')
        count = validated_data.get('items_avoided_count', 1)

        # Calculate impact points and grams
        grams_map = {
            'reusable_bag': 40,
            'avoid_plastic_bottle': 60,
            'recycle_plastic': 100,
            'cleanup_participation': 500,
            'reusable_container': 80,
            'eco_pledge_shared': 30,
            'other': 50,
        }
        points_map = {
            'reusable_bag': 15,
            'avoid_plastic_bottle': 20,
            'recycle_plastic': 25,
            'cleanup_participation': 100,
            'reusable_container': 20,
            'eco_pledge_shared': 15,
            'other': 10,
        }

        unit_grams = grams_map.get(activity_type, 50)
        unit_points = points_map.get(activity_type, 15)

        total_grams = unit_grams * count
        total_points = unit_points * count

        validated_data['plastic_saved_grams'] = total_grams
        validated_data['eco_points_earned'] = total_points

        activity = super().create(validated_data)

        # Update user profile points & total plastic saved
        user = validated_data.get('user')
        if user and hasattr(user, 'profile'):
            user.profile.eco_points += total_points
            user.profile.plastic_saved_total_grams += total_grams
            user.profile.update_level()
            user.profile.save()

            check_and_award_badges(user)
            create_notification(
                user=user,
                title=f"Activity Logged! (+{total_points} pts)",
                message=f"You prevented {total_grams}g of plastic waste through '{activity.title}'.",
                notification_type="points",
                link="/eco-tracker"
            )

        return activity


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ('created_at', 'is_read', 'replied')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class BadgeSerializer(serializers.ModelSerializer):
    unlocked = serializers.SerializerMethodField()
    earned_at = serializers.SerializerMethodField()

    class Meta:
        model = Badge
        fields = ('id', 'slug', 'name', 'description', 'icon', 'points_required', 'category', 'unlocked', 'earned_at')

    def get_unlocked(self, obj):
        user = self.context.get('user')
        if user and user.is_authenticated:
            return UserBadge.objects.filter(user=user, badge=obj).exists()
        return False

    def get_earned_at(self, obj):
        user = self.context.get('user')
        if user and user.is_authenticated:
            ub = UserBadge.objects.filter(user=user, badge=obj).first()
            return ub.earned_at if ub else None
        return None


class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ('id', 'badge', 'earned_at')


class DailyChallengeSerializer(serializers.ModelSerializer):
    completed_today = serializers.SerializerMethodField()

    class Meta:
        model = DailyChallenge
        fields = ('id', 'title', 'description', 'challenge_type', 'points_reward', 'plastic_saved_grams', 'icon', 'is_active', 'completed_today')

    def get_completed_today(self, obj):
        user = self.context.get('user')
        if user and user.is_authenticated:
            return UserChallenge.objects.filter(user=user, challenge=obj, date_completed=timezone.localdate()).exists()
        return False


class CommunityStorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = CommunityStory
        fields = '__all__'
        read_only_fields = ('created_at', 'likes_count')

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
