from .settings import *
import os

DEBUG = False

ALLOWED_HOSTS = [
    'rachab.pythonanywhere.com',
    'localhost',
    '127.0.0.1'
]

# CORS pour Vercel
CORS_ALLOWED_ORIGINS = [
    'https://my-tripplanner-two.vercel.app',
    'http://localhost:5173',
]

CORS_ALLOW_ALL_ORIGINS = False

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Whitenoise pour servir les fichiers statiques
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Sécurité
SECURE_SSL_REDIRECT = False  # PythonAnywhere gère déjà SSL
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
