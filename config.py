import os

# Connecting to the database in AWS using RDS
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'mediallist.cyfeomk0unfi.us-east-1.rds.amazonaws.com'),
    'user': os.getenv('DB_USER', 'mediallist'),
    'password': os.getenv('DB_PASSWORD', 'mediallist'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'database': os.getenv('DB_NAME', 'media'),
    'cursorclass': None # To be set in database.py
}

TABLES = ['anime_data', 'movies_data', 'shows_data']