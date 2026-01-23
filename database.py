import pymysql
from pymysql.cursors import DictCursor
from contextlib import contextmanager
from config import DB_CONFIG

DB_CONFIG['cursorclass'] = DictCursor

def get_db_connection():
    try:
        conn = pymysql.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        raise

@contextmanager
def get_db_cursor():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        yield cursor, conn
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def check_connection():
    try:
        with get_db_cursor() as (cursor, conn):
            # Check to see if tables exist / are accessible
            cursor.execute("SHOW TABLES")
            existing_tables = [table[0] for table in cursor.fetchall()]
            
            print(f"Connected to database: {DB_CONFIG['database']}")
            print(f"Available tables: {existing_tables}")
        return True
    except Exception as e:
        print(f"Connection check warning: {str(e)}")
        return False