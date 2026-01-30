import requests
from fastapi import APIRouter, HTTPException
from config import TMDB_API_KEY, OMDB_API_KEY
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


def get_omdb_data(imdb_id):
    """Get poster and plot from OMDB as fallback"""
    try:
        response = requests.get(f"http://www.omdbapi.com/?i={imdb_id}&apikey={OMDB_API_KEY}", timeout=TIMEOUT)
        if response.ok:
            data = response.json()
            if data.get("Response") == "True":
                poster = data.get("Poster")
                return (None if poster == "N/A" else poster), data.get("Plot")
    except:
        pass
    return None, None


@router.get("/details/{tconst}")
def getDetails(tconst: str):
    """Get overview, posterUrl, and trailerUrl from TMDB"""
    try:
        # Check cache first
        cached = get_cached(f"details_{tconst}")
        if cached:
            return cached
        
        poster_url = None
        overview = None
        trailer_url = None
        
        tmdb_id, media_type = get_tmdb_id_from_imdb(tconst)
        if tmdb_id:
            # Get details with videos
            url = f"https://api.themoviedb.org/3/{media_type}/{tmdb_id}"
            params = {"api_key": TMDB_API_KEY, "append_to_response": "videos"}
            
            data = make_request_with_retry(url, params)
            if data:
                overview = data.get("overview")
                if data.get("poster_path"):
                    poster_url = f"https://image.tmdb.org/t/p/original{data['poster_path']}"
                
                if data.get("videos", {}).get("results"):
                    for video in data["videos"]["results"]:
                        if video.get("site") == "YouTube" and video.get("type") in ["Trailer", "Teaser"]:
                            trailer_url = f"https://www.youtube.com/watch?v={video['key']}"
                            break

        # Fallback to OMDB if TMDB data is missing
        if not poster_url or not overview:
            omdb_poster, omdb_plot = get_omdb_data(tconst)
            poster_url = poster_url or omdb_poster
            overview = overview or omdb_plot

        if not poster_url and not overview:
            raise HTTPException(status_code=404, detail="Title details not found")
        
        result = {
            "tconst": tconst,
            "overview": overview,
            "posterUrl": poster_url,
            "trailerUrl": trailer_url
        }
        
        set_cached(f"details_{tconst}", result)
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))