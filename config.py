import os

TMDB_API_KEY = os.getenv('TMDB_API_KEY', '9f44b8813e2acbb2bd638d8698b5b7b4')
OMDB_API_KEY = os.getenv('OMDB_API_KEY', '59b204c7')

# Connecting to the database in AWS using RDS
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'mediallist-eu.cj02amagspex.eu-north-1.rds.amazonaws.com'),
    'user': os.getenv('DB_USER', 'mediallist'),
    'password': os.getenv('DB_PASSWORD', 'mediallist'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'database': os.getenv('DB_NAME', 'media'),
    'cursorclass': None # To be set in database.py
}

TABLES = ['anime_data', 'movies_data', 'shows_data']