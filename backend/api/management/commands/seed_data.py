from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta, date
from api.models import (
    Pledge, WasteReport, Campaign, CleanupEvent,
    Volunteer, EcoActivity, ContactMessage,
    Notification, Badge, UserBadge, DailyChallenge, CommunityStory
)

class Command(BaseCommand):
    help = 'Seeds initial realistic and verified data for Plastic-Free Environment Platform'

    def handle(self, *args, **options):
        self.stdout.write("Starting database seeding...")

        # 1. Create or ensure Admin user
        admin_user, _ = User.objects.get_or_create(username='admin')
        admin_user.email = 'admin@plasticfree.org'
        admin_user.first_name = 'Project'
        admin_user.last_name = 'Administrator'
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.set_password('admin123')
        admin_user.save()
        
        # Ensure profile role is admin
        if hasattr(admin_user, 'profile'):
            admin_user.profile.role = 'admin'
            admin_user.profile.city = 'Narasaraopet'
            admin_user.profile.phone = '+91 98765 43210'
            admin_user.profile.bio = 'Lead Environmental Coordinator & System Administrator'
            admin_user.profile.eco_points = 650
            admin_user.profile.plastic_saved_total_grams = 4500
            admin_user.profile.update_level()
            admin_user.profile.save()
        self.stdout.write("Admin user 'admin' configured with password 'admin123'.")

        # 2. Create or ensure Normal demo user (user / user123)
        normal_user, _ = User.objects.get_or_create(username='user')
        normal_user.email = 'user@plasticfree.org'
        normal_user.first_name = 'Demo'
        normal_user.last_name = 'User'
        normal_user.is_staff = False
        normal_user.is_superuser = False
        normal_user.set_password('user123')
        normal_user.save()

        if hasattr(normal_user, 'profile'):
            normal_user.profile.role = 'user'
            normal_user.profile.city = 'Lingamguntla Agraharam'
            normal_user.profile.phone = '+91 94401 99999'
            normal_user.profile.bio = 'Dedicated community member adopting zero-plastic lifestyle'
            normal_user.profile.eco_points = 180
            normal_user.profile.plastic_saved_total_grams = 1450
            normal_user.profile.pledge_taken = True
            normal_user.profile.update_level()
            normal_user.profile.save()
        self.stdout.write("Normal user 'user' configured with password 'user123'.")

        # 3. Create Badges
        badges_data = [
            {
                'slug': 'pledge-pioneer',
                'name': 'Pledge Pioneer',
                'description': 'Committed to the plastic-free revolution by signing the sustainability pledge.',
                'icon': 'Award',
                'points_required': 50,
                'category': 'pledge'
            },
            {
                'slug': 'eco-scout',
                'name': 'Eco Scout',
                'description': 'Reported the first plastic pollution hotspot in the local neighborhood.',
                'icon': 'Search',
                'points_required': 75,
                'category': 'reporting'
            },
            {
                'slug': 'waste-warrior',
                'name': 'Waste Warrior',
                'description': 'Reported 3 or more plastic pollution hotspots for community remediation.',
                'icon': 'ShieldCheck',
                'points_required': 150,
                'category': 'reporting'
            },
            {
                'slug': 'cleanup-hero',
                'name': 'Cleanup Hero',
                'description': 'Volunteered and mobilized for an on-ground community cleanup drive.',
                'icon': 'Users',
                'points_required': 100,
                'category': 'volunteer'
            },
            {
                'slug': 'centurion',
                'name': 'Green Centurion',
                'description': 'Accumulated over 100 eco points through consistent sustainable habits.',
                'icon': 'Zap',
                'points_required': 100,
                'category': 'points'
            },
            {
                'slug': 'forest-guardian',
                'name': 'Forest Guardian',
                'description': 'Reached Level 4 Tree Guardian with over 400 eco points.',
                'icon': 'TreePine',
                'points_required': 400,
                'category': 'level'
            },
            {
                'slug': 'zero-waste-master',
                'name': 'Zero-Waste Master',
                'description': 'Top-tier environmental crusader with 600+ points and verified field impact.',
                'icon': 'Crown',
                'points_required': 600,
                'category': 'level'
            }
        ]

        created_badges = {}
        for b_data in badges_data:
            badge, _ = Badge.objects.get_or_create(
                slug=b_data['slug'],
                defaults=b_data
            )
            created_badges[b_data['slug']] = badge
        self.stdout.write("Badges seeded.")

        # 4. Create Daily Challenges
        challenges_data = [
            {
                'title': 'Refuse Single-Use Straws & Cups',
                'description': 'Say NO to disposable straws, thermocol tea cups, and take-away lids today.',
                'challenge_type': 'refuse_plastic',
                'points_reward': 25,
                'plastic_saved_grams': 60,
                'icon': 'Coffee',
                'is_active': True
            },
            {
                'title': 'Carry Your Reusable Bag',
                'description': 'Take a durable cloth or jute bag for all vegetable, fruit, and grocery errands.',
                'challenge_type': 'reusable_bag',
                'points_reward': 30,
                'plastic_saved_grams': 80,
                'icon': 'ShoppingBag',
                'is_active': True
            },
            {
                'title': 'Refillable Bottle Day',
                'description': 'Drink exclusively from a refillable steel or copper flask; refuse buying bottled water.',
                'challenge_type': 'avoid_bottle',
                'points_reward': 35,
                'plastic_saved_grams': 120,
                'icon': 'Droplets',
                'is_active': True
            },
            {
                'title': 'Segregate Household Plastics',
                'description': 'Rinse and separate all dry clean packaging plastics in the blue bin for recycling.',
                'challenge_type': 'segregation',
                'points_reward': 40,
                'plastic_saved_grams': 200,
                'icon': 'Recycle',
                'is_active': True
            },
            {
                'title': 'Spread Plastic-Free Awareness',
                'description': 'Talk to a neighbor, friend, or local merchant about substituting single-use polybags.',
                'challenge_type': 'outreach',
                'points_reward': 30,
                'plastic_saved_grams': 50,
                'icon': 'Share2',
                'is_active': True
            }
        ]

        for ch_data in challenges_data:
            DailyChallenge.objects.get_or_create(
                title=ch_data['title'],
                defaults=ch_data
            )
        self.stdout.write("Daily Challenges seeded.")

        # 5. Create sample community users
        users_data = [
            {
                'username': 'bhavya_sri',
                'email': 'bhavya.sri@nec.edu.in',
                'first_name': 'B. Bhavya',
                'last_name': 'Sai Sri',
                'city': 'Narasaraopet',
                'phone': '+91 94401 23456',
                'eco_points': 480,
                'plastic_saved': 3800,
                'bio': 'B.Tech CSE (Data Science) Student Researcher & Project Lead (Roll: 24471A4402)'
            },
            {
                'username': 'aparna_m',
                'email': 'aparna.m@nec.edu.in',
                'first_name': 'M.',
                'last_name': 'Aparna',
                'city': 'Narasaraopet',
                'phone': '+91 94402 34567',
                'eco_points': 390,
                'plastic_saved': 2900,
                'bio': 'B.Tech CSE (DS) Survey Coordinator & Eco Researcher (Roll: 24471A4425)'
            },
            {
                'username': 'ramesh_farmer',
                'email': 'ramesh.lingamguntla@gmail.com',
                'first_name': 'Ramesh',
                'last_name': 'Reddy',
                'city': 'Lingamguntla Agraharam',
                'phone': '+91 98480 11223',
                'eco_points': 220,
                'plastic_saved': 1700,
                'bio': 'Local resident committed to plastic-free agriculture and clean water sources'
            },
            {
                'username': 'priya_teacher',
                'email': 'priya.zphs@school.ap.gov.in',
                'first_name': 'Priya',
                'last_name': 'Kumari',
                'city': 'Narasaraopet',
                'phone': '+91 98491 55667',
                'eco_points': 420,
                'plastic_saved': 3100,
                'bio': 'Science Teacher at ZPH School Lingamguntla Agraharam promoting zero plastic in schools'
            }
        ]

        created_users = []
        for u_data in users_data:
            user, u_created = User.objects.get_or_create(
                username=u_data['username'],
                defaults={
                    'email': u_data['email'],
                    'first_name': u_data['first_name'],
                    'last_name': u_data['last_name'],
                }
            )
            if u_created:
                user.set_password('user123')
                user.save()
            profile = user.profile
            profile.city = u_data['city']
            profile.phone = u_data['phone']
            profile.bio = u_data['bio']
            profile.eco_points = u_data['eco_points']
            profile.plastic_saved_total_grams = u_data['plastic_saved']
            profile.pledge_taken = True
            profile.update_level()
            profile.save()
            created_users.append(user)

        # Award badges to demo user and community members
        for u in [normal_user, admin_user] + created_users:
            UserBadge.objects.get_or_create(user=u, badge=created_badges['pledge-pioneer'])
            if u.profile.eco_points >= 100:
                UserBadge.objects.get_or_create(user=u, badge=created_badges['centurion'])
            if u.profile.eco_points >= 400:
                UserBadge.objects.get_or_create(user=u, badge=created_badges['forest-guardian'])

        # 6. Create Seed Pledges
        pledges_data = [
            {
                'user': created_users[0],
                'full_name': 'B. Bhavya Sai Sri',
                'email': 'bhavya.sri@nec.edu.in',
                'city': 'Narasaraopet',
                'category': 'student',
                'commitments': ['carry_cloth_bags', 'refuse_plastic_straws', 'carry_water_bottle', 'segregate_waste'],
                'pledge_statement': 'I commit to lead our campus and rural community towards zero single-use plastics.'
            },
            {
                'user': normal_user,
                'full_name': 'Demo User',
                'email': 'user@plasticfree.org',
                'city': 'Lingamguntla Agraharam',
                'category': 'individual',
                'commitments': ['carry_cloth_bags', 'carry_water_bottle', 'segregate_waste'],
                'pledge_statement': 'I pledge to adopt reusable bags, refuse plastic bottles, and keep our village clean.'
            },
            {
                'user': created_users[1],
                'full_name': 'M. Aparna',
                'email': 'aparna.m@nec.edu.in',
                'city': 'Narasaraopet',
                'category': 'student',
                'commitments': ['carry_cloth_bags', 'carry_water_bottle', 'avoid_packaged_items'],
                'pledge_statement': 'I pledge to refuse plastic carry bags and carry steel bottles wherever I go.'
            },
            {
                'user': created_users[2],
                'full_name': 'Ramesh Reddy',
                'email': 'ramesh.lingamguntla@gmail.com',
                'city': 'Lingamguntla Agraharam',
                'category': 'household',
                'commitments': ['carry_cloth_bags', 'segregate_waste', 'support_local_ban'],
                'pledge_statement': 'I pledge to protect our village farmlands and cattle from plastic ingestion.'
            },
            {
                'user': created_users[3],
                'full_name': 'Priya Kumari',
                'email': 'priya.zphs@school.ap.gov.in',
                'city': 'Narasaraopet',
                'category': 'institution',
                'commitments': ['carry_cloth_bags', 'carry_water_bottle', 'refuse_plastic_straws', 'educate_others'],
                'pledge_statement': 'I pledge to teach over 200 school children to avoid single-use wrappers and plastic pens.'
            },
            {
                'user': None,
                'full_name': 'Siva Kumar Varma',
                'email': 'siva.merchant@gmail.com',
                'city': 'Narasaraopet',
                'category': 'merchant',
                'commitments': ['carry_cloth_bags', 'avoid_packaged_items', 'segregate_waste'],
                'pledge_statement': 'As a local store owner, I pledge to offer paper and cloth bags to customers instead of polybags.'
            }
        ]

        for p_data in pledges_data:
            Pledge.objects.get_or_create(
                email=p_data['email'],
                defaults=p_data
            )
        self.stdout.write("Pledges seeded.")

        # 7. Create Seed Campaigns
        campaigns_data = [
            {
                'title': 'School Eco-Champions & Zero Plastic Habit',
                'subtitle': 'Classroom workshops and alternatives distribution at ZPH School Lingamguntla Agraharam',
                'description': 'Direct interactive workshops with rural high school students to eliminate disposable plastic wrappers, plastic water bottles, and non-biodegradable stationery.',
                'objective': 'Empower 300+ rural students with reusable cloth bags, steel water flasks, and waste segregation knowledge.',
                'category': 'school_outreach',
                'target_reach': 350,
                'current_reach': 285,
                'start_date': date(2026, 6, 15),
                'end_date': date(2026, 12, 31),
                'status': 'active',
                'featured': True,
            },
            {
                'title': 'Say NO to Single-Use Polybags in Local Markets',
                'subtitle': 'Merchant and shopper awareness across Narasaraopet vegetable and grocery markets',
                'description': 'Partnering with local shopkeepers and street vendors to eliminate plastic carry bags less than 120 microns and promote jute and cotton bags.',
                'objective': 'Achieve 70% reduction in single-use plastic bag consumption across 5 major market hubs in Narasaraopet.',
                'category': 'plastic_ban',
                'target_reach': 2500,
                'current_reach': 1820,
                'start_date': date(2026, 7, 1),
                'end_date': date(2026, 11, 30),
                'status': 'active',
                'featured': True,
            },
            {
                'title': 'Clean Canals & Waterways Protection Drive',
                'subtitle': 'Preventing plastic contamination in rural irrigation canals and groundwater aquifers',
                'description': 'Mobilizing youth and farmers in Lingamguntla Agraharam to clear choking plastic bottles and multilayered packaging from village water canals.',
                'objective': 'Safeguard water quality, farm soil health, and domestic animals from plastic contamination.',
                'category': 'recycling_drive',
                'target_reach': 1000,
                'current_reach': 760,
                'start_date': date(2026, 8, 10),
                'end_date': date(2026, 11, 20),
                'status': 'active',
                'featured': False,
            }
        ]

        for c_data in campaigns_data:
            Campaign.objects.get_or_create(
                title=c_data['title'],
                defaults=c_data
            )
        self.stdout.write("Campaigns seeded.")

        # 8. Create Seed Cleanup Events
        now = timezone.now()
        events_data = [
            {
                'title': 'ZPH School & Village Green Cleanup Drive',
                'slug': 'zph-school-village-green-cleanup',
                'description': 'Comprehensive community cleanup around ZPH School campus, school playground, and surrounding village streets in Lingamguntla Agraharam.',
                'organizer': 'CSP Student Research Team & School Eco-Club',
                'event_date': now + timedelta(days=5, hours=3),
                'location_name': 'ZPH School Campus',
                'address': 'Main Road, Lingamguntla Agraharam, Narasaraopet Mandal',
                'city': 'Lingamguntla Agraharam',
                'target_volunteers': 50,
                'waste_collected_kg': 120.50,
                'status': 'upcoming',
                'created_by': admin_user
            },
            {
                'title': 'Narasaraopet Market Road Plastic-Free Sweep',
                'slug': 'narasaraopet-market-road-plastic-sweep',
                'description': 'Early morning volunteer drive collecting discarded plastics, segregation into recyclable polymers, and distributing reusable cloth shopping bags to shoppers.',
                'organizer': 'Narasaraopet Green Volunteers & Youth League',
                'event_date': now + timedelta(days=12, hours=2),
                'location_name': 'Daily Vegetable & Fruit Market',
                'address': 'Station Road, Narasaraopet',
                'city': 'Narasaraopet',
                'target_volunteers': 40,
                'waste_collected_kg': 85.00,
                'status': 'upcoming',
                'created_by': admin_user
            },
            {
                'title': 'Palnadu Rural Canal Bank Cleanliness Mission',
                'slug': 'palnadu-rural-canal-bank-cleanliness',
                'description': 'Removal of trapped plastic debris, bags, and thermocol along the irrigation canal feeding agricultural fields in rural Narasaraopet.',
                'organizer': 'Lingamguntla Agraharam Farmers & Youth Society',
                'event_date': now - timedelta(days=20),
                'location_name': 'North Canal Aqueduct',
                'address': 'Canal Bund, Lingamguntla Agraharam',
                'city': 'Lingamguntla Agraharam',
                'target_volunteers': 35,
                'waste_collected_kg': 245.80,
                'status': 'completed',
                'created_by': admin_user
            }
        ]

        created_events = []
        for e_data in events_data:
            event, e_created = CleanupEvent.objects.get_or_create(
                slug=e_data['slug'],
                defaults=e_data
            )
            created_events.append(event)
        self.stdout.write("Cleanup Events seeded.")

        # 9. Create Seed Volunteers
        volunteers_data = [
            {
                'event': created_events[0],
                'user': created_users[0],
                'full_name': 'B. Bhavya Sai Sri',
                'email': 'bhavya.sri@nec.edu.in',
                'phone': '+91 94401 23456',
                'attendance_status': 'confirmed',
                'notes': 'Bringing 50 cloth bags for distribution.'
            },
            {
                'event': created_events[0],
                'user': normal_user,
                'full_name': 'Demo User',
                'email': 'user@plasticfree.org',
                'phone': '+91 94401 99999',
                'attendance_status': 'confirmed',
                'notes': 'Participating in waste collection and weighing.'
            },
            {
                'event': created_events[0],
                'user': created_users[1],
                'full_name': 'M. Aparna',
                'email': 'aparna.m@nec.edu.in',
                'phone': '+91 94402 34567',
                'attendance_status': 'confirmed',
                'notes': 'Managing volunteer registration table.'
            },
            {
                'event': created_events[1],
                'user': created_users[3],
                'full_name': 'Priya Kumari',
                'email': 'priya.zphs@school.ap.gov.in',
                'phone': '+91 98491 55667',
                'attendance_status': 'registered',
                'notes': 'Participating with 10 high school eco-club leaders.'
            }
        ]

        for v_data in volunteers_data:
            Volunteer.objects.get_or_create(
                event=v_data['event'],
                email=v_data['email'],
                defaults=v_data
            )
        self.stdout.write("Volunteers seeded.")

        # 10. Create Seed Waste Reports with Tracking IDs
        reports_data = [
            {
                'tracking_id': 'WR-2026-4401',
                'user': created_users[0],
                'reporter_name': 'B. Bhavya Sai Sri',
                'reporter_phone': '+91 94401 23456',
                'reporter_email': 'bhavya.sri@nec.edu.in',
                'title': 'Plastic wrappers & polybags accumulated near village bus shelter',
                'description': 'Large volume of single-use snack packaging and polythene bags dumped beside the main road bus shelter. Stray cattle observed chewing on plastic waste.',
                'category': 'roadside',
                'waste_severity': 'high',
                'location_address': 'Near Gram Panchayat Bus Stop, Lingamguntla Agraharam',
                'city': 'Lingamguntla Agraharam',
                'latitude': 16.1528,
                'longitude': 80.0492,
                'status': 'under_review',
                'admin_notes': 'Scheduled for cleanup crew review with local Panchayat Secretary.'
            },
            {
                'tracking_id': 'WR-2026-4402',
                'user': normal_user,
                'reporter_name': 'Demo User',
                'reporter_phone': '+91 94401 99999',
                'reporter_email': 'user@plasticfree.org',
                'title': 'Accumulated PET bottles and cups near canal road curve',
                'description': 'Noticeable pile of discarded plastic bottles and plastic teacups left in ditch.',
                'category': 'roadside',
                'waste_severity': 'medium',
                'location_address': 'Canal Road Bend, Lingamguntla Agraharam',
                'city': 'Lingamguntla Agraharam',
                'latitude': 16.1542,
                'longitude': 80.0505,
                'status': 'approved',
                'admin_notes': 'Verified by volunteer coordinator; team assigned for weekend pickup.'
            },
            {
                'tracking_id': 'WR-2026-4403',
                'user': created_users[2],
                'reporter_name': 'Ramesh Reddy',
                'reporter_phone': '+91 98480 11223',
                'reporter_email': 'ramesh.lingamguntla@gmail.com',
                'title': 'Discarded pesticide plastic bottles choking minor drainage culvert',
                'description': 'Plastic containers and empty chemical bottles discarded directly into the agricultural runoff ditch. Risk of soil and groundwater toxic chemical contamination.',
                'category': 'waterbody',
                'waste_severity': 'critical',
                'location_address': 'East Canal Culvert, Agricultural Fields, Lingamguntla Agraharam',
                'city': 'Lingamguntla Agraharam',
                'latitude': 16.1550,
                'longitude': 80.0520,
                'status': 'in_progress',
                'admin_notes': 'Panchayat sanitation team alerted; safe removal initiated.'
            },
            {
                'tracking_id': 'WR-2026-4404',
                'user': None,
                'reporter_name': 'Anil Kumar',
                'reporter_phone': '+91 91234 56789',
                'reporter_email': 'anil.k@gmail.com',
                'title': 'Open burning of plastic waste behind market complex',
                'description': 'Piles of thermocol and plastic shipping bags being burned in the open creating acrid toxic fumes containing dioxins and particulate matter.',
                'category': 'commercial',
                'waste_severity': 'critical',
                'location_address': 'Behind Old Vegetable Market, Station Road',
                'city': 'Narasaraopet',
                'latitude': 16.2350,
                'longitude': 80.0480,
                'status': 'resolved',
                'admin_notes': 'Market committee issued warning and placed segregated collection bins. Burning halted.',
                'resolved_at': now - timedelta(days=3)
            },
            {
                'tracking_id': 'WR-2026-4405',
                'user': created_users[3],
                'reporter_name': 'Priya Kumari',
                'reporter_phone': '+91 98491 55667',
                'reporter_email': 'priya.zphs@school.ap.gov.in',
                'title': 'Littered single-use cups and straws around school playground boundary',
                'description': 'Scattered tea cups, juice tetra packs, and plastic straws along the school perimeter fence left by passersby and roadside vendors.',
                'category': 'school_park',
                'waste_severity': 'medium',
                'location_address': 'ZPH School West Boundary Wall',
                'city': 'Lingamguntla Agraharam',
                'latitude': 16.1534,
                'longitude': 80.0498,
                'status': 'resolved',
                'admin_notes': 'Cleaned up during the 29 June 2026 CSP field session with students.',
                'resolved_at': now - timedelta(days=10)
            }
        ]

        for r_data in reports_data:
            WasteReport.objects.get_or_create(
                tracking_id=r_data['tracking_id'],
                defaults=r_data
            )
        self.stdout.write("Waste Reports seeded.")

        # 11. Create Seed Eco Activities
        activities_data = [
            {
                'user': normal_user,
                'activity_type': 'reusable_bag',
                'title': 'Carried cotton tote bag for vegetable market',
                'description': 'Substituted 4 polybags with a reusable cloth tote at Narasaraopet market.',
                'items_avoided_count': 4,
                'plastic_saved_grams': 160,
                'eco_points_earned': 60,
                'activity_date': date.today() - timedelta(days=1)
            },
            {
                'user': normal_user,
                'activity_type': 'avoid_plastic_bottle',
                'title': 'Refilled stainless steel flask instead of buying water bottle',
                'description': 'Avoided two 1L single-use PET bottles during travel.',
                'items_avoided_count': 2,
                'plastic_saved_grams': 120,
                'eco_points_earned': 40,
                'activity_date': date.today()
            },
            {
                'user': created_users[0],
                'activity_type': 'avoid_plastic_bottle',
                'title': 'Refilled copper water bottle throughout college classes',
                'description': 'Avoided buying two 1-litre single-use PET mineral water bottles.',
                'items_avoided_count': 2,
                'plastic_saved_grams': 120,
                'eco_points_earned': 40,
                'activity_date': date.today()
            },
            {
                'user': created_users[1],
                'activity_type': 'recycle_plastic',
                'title': 'Segregated clean HDPE bottles & milk sachets for scrap recycling',
                'description': 'Collected and handed over 1.2 kg clean dry plastics to local kabadiwala.',
                'items_avoided_count': 12,
                'plastic_saved_grams': 1200,
                'eco_points_earned': 150,
                'activity_date': date.today() - timedelta(days=2)
            }
        ]

        for act_data in activities_data:
            EcoActivity.objects.get_or_create(
                user=act_data['user'],
                title=act_data['title'],
                activity_date=act_data['activity_date'],
                defaults=act_data
            )
        self.stdout.write("Eco Activities seeded.")

        # 12. Create Community Stories
        stories_data = [
            {
                'slug': 'zph-school-field-study-insights',
                'title': 'Field Study Insights: Single-Use Plastic Awareness at ZPH School Lingamguntla Agraharam',
                'author_name': 'B. Bhavya Sai Sri (Lead Researcher, CSE-DS)',
                'category': 'update',
                'impact_summary': 'Educated 200+ students & teachers on resin codes and eco-substitutes',
                'content': (
                    "On 29 June 2026, our B.Tech CSE (Data Science) project team conducted an extensive field study and community awareness session at ZPH School, Lingamguntla Agraharam. "
                    "We engaged over 200 students and teachers, demonstrating the toxic life-cycle of single-use plastics, explaining Resin Codes 1 through 7, and distributing reusable cloth bags. "
                    "Through direct surveys, 87% of students pledged to stop carrying disposable polythene bags and transition to refillable steel water bottles."
                ),
                'likes_count': 42,
                'featured': True,
            },
            {
                'slug': 'eliminating-roadside-plastic-dumps',
                'title': 'Village Cleanliness Initiative: Eliminating Roadside Plastic Dumps',
                'author_name': 'Ramesh Reddy & Panchayat Youth Wing',
                'category': 'story',
                'impact_summary': 'Remediated 140kg of discarded single-use plastic waste',
                'content': (
                    "Through coordination between local residents and student volunteers, the illegal waste dumping site near the Lingamguntla Agraharam bus stop was successfully cleared. "
                    "Two segregated metal waste receptacles have been installed by the Gram Panchayat, preventing stray cattle from ingesting toxic plastic film debris."
                ),
                'likes_count': 29,
                'featured': True,
            },
            {
                'slug': 'market-bag-distribution-drive',
                'title': 'Jute and Cloth Bag Distribution Drive in Narasaraopet Markets',
                'author_name': 'Narasaraopet Eco Forum & Faculty Guides',
                'category': 'announcement',
                'impact_summary': 'Replaced 1,500 plastic carry bags across local weekly santas',
                'content': (
                    "To support the district single-use plastic prohibition, our volunteer network distributed 1,500 reusable jute and cotton carry bags to shoppers and street vendors across Station Road market. "
                    "Participating merchants have displayed 'Plastic-Free Store' badges and agreed to charge for any emergency paper packaging."
                ),
                'likes_count': 35,
                'featured': False,
            }
        ]

        for s_data in stories_data:
            CommunityStory.objects.get_or_create(
                slug=s_data['slug'],
                defaults=s_data
            )
        self.stdout.write("Community Stories seeded.")

        # 13. Create sample notifications for Demo User
        notifications_data = [
            {
                'user': normal_user,
                'title': '🏆 Badge Unlocked: Green Centurion!',
                'message': 'Congratulations! You have crossed 100 eco points through active sustainable commitments.',
                'notification_type': 'achievement',
                'link': '/profile',
                'is_read': False
            },
            {
                'user': normal_user,
                'title': 'Waste Report Approved & Scheduled!',
                'message': 'Your report WR-2026-4402 has been verified by the coordinator and scheduled for cleanup.',
                'notification_type': 'report_status',
                'link': '/waste-reports',
                'is_read': False
            },
            {
                'user': normal_user,
                'title': 'Upcoming Cleanup Drive Reminder',
                'message': 'The ZPH School & Village Green Cleanup Drive is taking place in 5 days. We look forward to seeing you!',
                'notification_type': 'event',
                'link': '/cleanup-events',
                'is_read': True
            }
        ]

        for n_data in notifications_data:
            Notification.objects.get_or_create(
                user=n_data['user'],
                title=n_data['title'],
                defaults=n_data
            )
        self.stdout.write("Notifications seeded.")

        # 14. Create Seed Contact Messages
        messages_data = [
            {
                'name': 'Dr. K. Srinivas',
                'email': 'dr.ksrinivas@health.ap.gov.in',
                'phone': '+91 98480 33445',
                'subject': 'Collaborative Workshop on Microplastics and Rural Health',
                'message': 'We appreciated your student initiative at Lingamguntla Agraharam ZPH School. We would like to invite your team to present your findings at our upcoming public health awareness forum.',
                'is_read': True,
                'replied': True
            },
            {
                'name': 'Panchayat Officer Lingamguntla Agraharam',
                'email': 'secretary.lingamguntla@ap.gov.in',
                'phone': '+91 8647 223344',
                'subject': 'Installation of Segregated Bins and Collection Schedule',
                'message': 'Following the community feedback and student recommendations, the Panchayat has approved the placement of 4 dual-bin sets near the school and marketplace.',
                'is_read': False,
                'replied': False
            }
        ]

        for m_data in messages_data:
            ContactMessage.objects.get_or_create(
                email=m_data['email'],
                subject=m_data['subject'],
                defaults=m_data
            )
        self.stdout.write("Contact Messages seeded.")

        self.stdout.write("All seed data created successfully!")
