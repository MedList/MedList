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
    minVotes: int = None,
    skip: int = 0,
    limit: int = 20,
    sort: str = None,
    order: str = "desc"
):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        base_query = "SELECT * FROM anime_data WHERE 1=1"
        count_query = "SELECT COUNT(*) as total FROM anime_data WHERE 1=1"
        params = []
        
        if name:
            base_query += " AND primaryTitle LIKE %s"
            count_query += " AND primaryTitle LIKE %s"
            params.append(f"%{name}%")
        if genre:
            base_query += " AND genres LIKE %s"
            count_query += " AND genres LIKE %s"
            params.append(f"%{genre}%")
        if minYear and maxYear:
            base_query += " AND startYear BETWEEN %s AND %s"
            count_query += " AND startYear BETWEEN %s AND %s"
            params.append(minYear)
            params.append(maxYear)
        elif minYear:
            base_query += " AND startYear >= %s"
            count_query += " AND startYear >= %s"
            params.append(minYear)
        elif maxYear:
            base_query += " AND startYear <= %s"
            count_query += " AND startYear <= %s"
            params.append(maxYear)
        if minRating is not None:
            base_query += " AND averageRating >= %s"
            count_query += " AND averageRating >= %s"
            params.append(minRating)
        if maxRating is not None:
            base_query += " AND averageRating <= %s"
            count_query += " AND averageRating <= %s"
            params.append(maxRating)
        if minVotes is not None:
            base_query += " AND numVotes >= %s"
            count_query += " AND numVotes >= %s"
            params.append(minVotes)
        
        cursor.execute(count_query, params)
        total_results = cursor.fetchone()['total']
                
        if sort in ["rating", "year", "votes"]:
            sort_column = {"rating": "averageRating", "year": "startYear", "votes": "numVotes"}[sort]
            order_dir = "ASC" if order == "asc" else "DESC"
            base_query += f" ORDER BY {sort_column} {order_dir}"
        
        base_query += " LIMIT %s OFFSET %s"
        query_params = params + [limit, skip]
        
        cursor.execute(base_query, query_params)
        results = cursor.fetchall()
        
        return {
            "type": "anime",
            "total": total_results,
            "skip": skip,
            "limit": limit,
            "count": len(results),
            "data": results
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



#Movies search endpoint

@router.get("/movies/search")
def searchMovies(
    name: str = None,
    genre: str = None,
    minYear: str = None,
    maxYear: str = None,
    minRating: float = None,
    maxRating: float = 10.0,
    minVotes: int = None,
    skip: int = 0,
    limit: int = 20,
    sort: str = None,
    order: str = "desc"
):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        base_query = "SELECT * FROM movies_data WHERE 1=1"
        count_query = "SELECT COUNT(*) as total FROM movies_data WHERE 1=1"
        params = []
        
        if name:
            base_query += " AND primaryTitle LIKE %s"
            count_query += " AND primaryTitle LIKE %s"
            params.append(f"%{name}%")
        if genre:
            base_query += " AND genres LIKE %s"
            count_query += " AND genres LIKE %s"
            params.append(f"%{genre}%")
        if minYear and maxYear:
            base_query += " AND startYear BETWEEN %s AND %s"
            count_query += " AND startYear BETWEEN %s AND %s"
            params.append(minYear)
            params.append(maxYear)
        elif minYear:
            base_query += " AND startYear >= %s"
            count_query += " AND startYear >= %s"
            params.append(minYear)
        elif maxYear:
            base_query += " AND startYear <= %s"
            count_query += " AND startYear <= %s"
            params.append(maxYear)
        if minRating is not None:
            base_query += " AND averageRating >= %s"
            count_query += " AND averageRating >= %s"
            params.append(minRating)
        if maxRating is not None:
            base_query += " AND averageRating <= %s"
            count_query += " AND averageRating <= %s"
            params.append(maxRating)
        if minVotes is not None:
            base_query += " AND numVotes >= %s"
            count_query += " AND numVotes >= %s"
            params.append(minVotes)
        
        cursor.execute(count_query, params)
        total_results = cursor.fetchone()['total']
        
        if sort in ["rating", "year", "votes"]:
            sort_column = {"rating": "averageRating", "year": "startYear", "votes": "numVotes"}[sort]
            order_dir = "ASC" if order == "asc" else "DESC"
            base_query += f" ORDER BY {sort_column} {order_dir}"
        
        base_query += " LIMIT %s OFFSET %s"
        query_params = params + [limit, skip]
        
        cursor.execute(base_query, query_params)
        results = cursor.fetchall()
        
        return {
            "type": "movies",
            "total": total_results,
            "skip": skip,
            "limit": limit,
            "count": len(results),
            "data": results
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

#Shows search endpoint

@router.get("/shows/search")
def searchShows(
    name: str = None,
    genre: str = None,
    minYear: str = None,
    maxYear: str = None,
    minRating: float = None,
    maxRating: float = 10.0,
    minVotes: int = None,
    skip: int = 0,
    limit: int = 20,
    sort: str = None,
    order: str = "desc"
):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        base_query = "SELECT * FROM shows_data WHERE 1=1"
        count_query = "SELECT COUNT(*) as total FROM shows_data WHERE 1=1"
        params = []
        
        if name:
            base_query += " AND primaryTitle LIKE %s"
            count_query += " AND primaryTitle LIKE %s"
            params.append(f"%{name}%")
        if genre:
            base_query += " AND genres LIKE %s"
            count_query += " AND genres LIKE %s"
            params.append(f"%{genre}%")
        if minYear and maxYear:
            base_query += " AND startYear BETWEEN %s AND %s"
            count_query += " AND startYear BETWEEN %s AND %s"
            params.append(minYear)
            params.append(maxYear)
        elif minYear:
            base_query += " AND startYear >= %s"
            count_query += " AND startYear >= %s"
            params.append(minYear)
        elif maxYear:
            base_query += " AND startYear <= %s"
            count_query += " AND startYear <= %s"
            params.append(maxYear)
        if minRating is not None:
            base_query += " AND averageRating >= %s"
            count_query += " AND averageRating >= %s"
            params.append(minRating)
        if maxRating is not None:
            base_query += " AND averageRating <= %s"
            count_query += " AND averageRating <= %s"
            params.append(maxRating)
        if minVotes is not None:
            base_query += " AND numVotes >= %s"
            count_query += " AND numVotes >= %s"
            params.append(minVotes)
        
        cursor.execute(count_query, params)
        total_results = cursor.fetchone()['total']
        
        if sort in ["rating", "year", "votes"]:
            sort_column = {"rating": "averageRating", "year": "startYear", "votes": "numVotes"}[sort]
            order_dir = "ASC" if order == "asc" else "DESC"
            base_query += f" ORDER BY {sort_column} {order_dir}"
        
        base_query += " LIMIT %s OFFSET %s"
        query_params = params + [limit, skip]
        
        cursor.execute(base_query, query_params)
        results = cursor.fetchall()
        
        return {
            "type": "shows",
            "total": total_results,
            "skip": skip,
            "limit": limit,
            "count": len(results),
            "data": results
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()