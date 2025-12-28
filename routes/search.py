from fastapi import APIRouter, HTTPException
from database import get_db_connection

router = APIRouter(tags=["search"])


#Anime search endpoint

@router.get("/anime/search")
def searchAnime(
    name: str = None,
    genre: str = None,
    minYear: str = None,
    maxYear: str = None,
    minRating: float = None,
    maxRating: float = 10.0,
    minVotes: int = None
):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM anime_data WHERE 1=1"
        params = []
        
        if name:
            query += " AND primaryTitle LIKE %s"
            params.append(f"%{name}%")
        if genre:
            query += " AND genres LIKE %s"
            params.append(f"%{genre}%")
        if minYear and maxYear:
            query += " AND startYear BETWEEN %s AND %s"
            params.append(minYear)
            params.append(maxYear)
        elif minYear:
            query += " AND startYear >= %s"
            params.append(minYear)
        elif maxYear:
            query += " AND startYear <= %s"
            params.append(maxYear)
        if minRating is not None:
            query += " AND averageRating >= %s"
            params.append(minRating)
        if maxRating is not None:
            query += " AND averageRating <= %s"
            params.append(maxRating)
        if minVotes is not None:
            query += " AND numVotes >= %s"
            params.append(minVotes)
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        if not results:
            raise HTTPException(status_code=404, detail="No anime matching your filters")
        
        return {
            "type": "anime",
            "count": len(results),
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



#Movies search endpoint

@router.get("/movies/search")
def searchMovies(
    name: str = None,
    genre: str = None,
    minYear: str = None,
    maxYear: str = None,
    minRating: float = None,
    maxRating: float = 10.0,
    minVotes: int = None
):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM movies_data WHERE 1=1"
        params = []
        
        if name:
            query += " AND primaryTitle LIKE %s"
            params.append(f"%{name}%")
        if genre:
            query += " AND genres LIKE %s"
            params.append(f"%{genre}%")
        if minYear and maxYear:
            query += " AND startYear BETWEEN %s AND %s"
            params.append(minYear)
            params.append(maxYear)
        elif minYear:
            query += " AND startYear >= %s"
            params.append(minYear)
        elif maxYear:
            query += " AND startYear <= %s"
            params.append(maxYear)
        if minRating is not None:
            query += " AND averageRating >= %s"
            params.append(minRating)
        if maxRating is not None:
            query += " AND averageRating <= %s"
            params.append(maxRating)
        if minVotes is not None:
            query += " AND numVotes >= %s"
            params.append(minVotes)
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        if not results:
            raise HTTPException(status_code=404, detail="No movies matching your filters")
        
        return {
            "type": "movies",
            "count": len(results),
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Shows search endpoint

@router.get("/shows/search")
def searchShows(
    name: str = None,
    genre: str = None,
    minYear: str = None,
    maxYear: str = None,
    minRating: float = None,
    maxRating: float = 10.0,
    minVotes: int = None
):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM shows_data WHERE 1=1"
        params = []
        
        if name:
            query += " AND primaryTitle LIKE %s"
            params.append(f"%{name}%")
        if genre:
            query += " AND genres LIKE %s"
            params.append(f"%{genre}%")
        if minYear and maxYear:
            query += " AND startYear BETWEEN %s AND %s"
            params.append(minYear)
            params.append(maxYear)
        elif minYear:
            query += " AND startYear >= %s"
            params.append(minYear)
        elif maxYear:
            query += " AND startYear <= %s"
            params.append(maxYear)
        if minRating is not None:
            query += " AND averageRating >= %s"
            params.append(minRating)
        if maxRating is not None:
            query += " AND averageRating <= %s"
            params.append(maxRating)
        if minVotes is not None:
            query += " AND numVotes >= %s"
            params.append(minVotes)
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        if not results:
            raise HTTPException(status_code=404, detail="No shows matching your filters")
        
        return {
            "type": "shows",
            "count": len(results),
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))