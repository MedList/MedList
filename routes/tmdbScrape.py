import requests
from fastapi import APIRouter, HTTPException
from config import TMDB_API_KEY
import time

router = APIRouter(prefix="/images", tags=["images"])

# In-memory cache
cache = {}
CACHE_EXPIRY = 86400  # 24 hours

# Retry configuration
MAX_RETRIES = 3
TIMEOUT = 10
RETRY_DELAY = 1


def get_cached(key):
    """Check if item is in cache and not expired"""
    if key in cache:
        data, timestamp = cache[key]
        if time.time() - timestamp < CACHE_EXPIRY:
            return data
        else:
            del cache[key]
    return None


def set_cached(key, data):
    """Store item in cache"""
    if len(cache) > 1000:
        oldest = sorted(cache.items(), key=lambda x: x[1][1])[:100]
        for k, _ in oldest:
            del cache[k]
    cache[key] = (data, time.time())


def make_request_with_retry(url, params):
    """Make HTTP request with retry logic"""
    last_error = None
    
    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url, params=params, timeout=TIMEOUT)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.Timeout:
            last_error = "Request timed out"
            print(f"TMDB timeout (attempt {attempt + 1}/{MAX_RETRIES}): {url}")
        except requests.exceptions.RequestException as e:
            last_error = str(e)
            print(f"TMDB request error (attempt {attempt + 1}/{MAX_RETRIES}): {e}")
        
        if attempt < MAX_RETRIES - 1:
            time.sleep(RETRY_DELAY)
    
    print(f"TMDB failed after {MAX_RETRIES} attempts: {last_error}")
    return None


def get_tmdb_id_from_imdb(imdb_id):
    """Get TMDB ID and media type from IMDB ID"""
    url = f"https://api.themoviedb.org/3/find/{imdb_id}"
    params = {"api_key": TMDB_API_KEY, "external_source": "imdb_id"}
    
    data = make_request_with_retry(url, params)
    if not data:
        return None, None

    if data.get("movie_results"):
        return data["movie_results"][0]["id"], "movie"
    if data.get("tv_results"):
        return data["tv_results"][0]["id"], "tv"

    return None, None


@router.get("/details/{tconst}")
def getDetails(tconst: str):
    """Get overview, posterUrl, and trailerUrl from TMDB"""
    try:
        # Check cache first
        cached = get_cached(f"details_{tconst}")
        if cached:
            return cached
        
        tmdb_id, media_type = get_tmdb_id_from_imdb(tconst)
        if tmdb_id is None:
            raise HTTPException(status_code=404, detail="Title not found on TMDB")
        
        # Get details with videos
        url = f"https://api.themoviedb.org/3/{media_type}/{tmdb_id}"
        params = {
            "api_key": TMDB_API_KEY,
            "append_to_response": "videos"
        }
        
        data = make_request_with_retry(url, params)
        if not data:
            raise HTTPException(status_code=404, detail="Failed to fetch from TMDB")
        
        # Get poster URL with original size
        poster_url = None
        if data.get("poster_path"):
            poster_url = f"https://image.tmdb.org/t/p/original{data['poster_path']}"
        
        # Get trailer URL
        trailer_url = None
        if data.get("videos", {}).get("results"):
            for video in data["videos"]["results"]:
                if video.get("site") == "YouTube" and video.get("type") in ["Trailer", "Teaser"]:
                    trailer_url = f"https://www.youtube.com/watch?v={video['key']}"
                    break
        
        result = {
            "tconst": tconst,
            "overview": data.get("overview"),
            "posterUrl": poster_url,
            "trailerUrl": trailer_url
        }
        
        set_cached(f"details_{tconst}", result)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))