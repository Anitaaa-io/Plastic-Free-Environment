from django.apps import AppConfig

class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        import api.signals
        _ = api.signals

