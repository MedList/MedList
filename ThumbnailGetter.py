import requests

TMDB_API_KEY = "9f44b8813e2acbb2bd638d8698b5b7b4"

def get_tmdb_id_from_imdb(imdb_id):
    url = f"https://api.themoviedb.org/3/find/{imdb_id}"
    params = {"api_key": TMDB_API_KEY, "external_source": "imdb_id"}
    r = requests.get(url, params=params).json()

    if r["movie_results"]:
        return r["movie_results"][0]["id"], "movie"
    if r["tv_results"]:
        return r["tv_results"][0]["id"], "tv"

    return None, None

def get_poster_from_imdb(imdb_id):
    tmdb_id, media_type = get_tmdb_id_from_imdb(imdb_id)
    if tmdb_id is None:
        return None
    return f"https://image.tmdb.org/t/p/w500" + \
           requests.get(
               f"https://api.themoviedb.org/3/{media_type}/{tmdb_id}",
               params={"api_key": TMDB_API_KEY}
           ).json()["poster_path"]
