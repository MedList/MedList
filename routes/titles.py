from fastapi import APIRouter, HTTPException, Query
from models import TitleUpdate
from database import get_db_connection
from config import TABLES

router = APIRouter(tags=["titles"])


#Functions to get all data from specific media type(To be used in media homepage's)

@router.get("/anime")
def getAnime(skip: int = 0, limit: int = 20, sort: str = None, order: str = "desc"):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as total FROM anime_data")
        total = cursor.fetchone()['total']
        
        order_clause = ""
        if sort in ["rating", "year", "votes"]:
            sort_column = {"rating": "averageRating", "year": "startYear", "votes": "numVotes"}[sort]
            order_dir = "ASC" if order == "asc" else "DESC"
            order_clause = f" ORDER BY {sort_column} {order_dir}"
        
        query = f"SELECT * FROM anime_data{order_clause} LIMIT %s OFFSET %s"
        cursor.execute(query, (limit, skip))
        data = cursor.fetchall()
        
        return {
            "type": "anime",
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/movies")
def getMovies(skip: int = 0, limit: int = 20, sort: str = None, order: str = "desc"):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as total FROM movies_data")
        total = cursor.fetchone()['total']
        
        order_clause = ""
        if sort in ["rating", "year", "votes"]:
            sort_column = {"rating": "averageRating", "year": "startYear", "votes": "numVotes"}[sort]
            order_dir = "ASC" if order == "asc" else "DESC"
            order_clause = f" ORDER BY {sort_column} {order_dir}"
        
        query = f"SELECT * FROM movies_data{order_clause} LIMIT %s OFFSET %s"
        cursor.execute(query, (limit, skip))
        data = cursor.fetchall()
        
        return {
            "type": "movies",
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/shows")
def getShows(skip: int = 0, limit: int = 20, sort: str = None, order: str = "desc"):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as total FROM shows_data")
        total = cursor.fetchone()['total']
        
        order_clause = ""
        if sort in ["rating", "year", "votes"]:
            sort_column = {"rating": "averageRating", "year": "startYear", "votes": "numVotes"}[sort]
            order_dir = "ASC" if order == "asc" else "DESC"
            order_clause = f" ORDER BY {sort_column} {order_dir}"
        
        query = f"SELECT * FROM shows_data{order_clause} LIMIT %s OFFSET %s"
        cursor.execute(query, (limit, skip))
        data = cursor.fetchall()
        
        return {
            "type": "shows",
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

#Function to get data of a specific title (to be used to fetch in detail page)

@router.get("/anime/{tconst}")
def getAnimeByTconst(tconst: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM anime_data WHERE tconst = %s"
        cursor.execute(query, (tconst,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Anime not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/movies/{tconst}")
def getMovieByTconst(tconst: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM movies_data WHERE tconst = %s"
        cursor.execute(query, (tconst,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/shows/{tconst}")
def getShowByTconst(tconst: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT * FROM shows_data WHERE tconst = %s"
        cursor.execute(query, (tconst,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Show not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.put("/anime/{tconst}")
def updateAnime(tconst: str, updates: TitleUpdate):
    try:
        update_data = updates.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No update fields provided")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        set_clause = ", ".join([f"{field} = %s" for field in update_data.keys()])
        values = list(update_data.values()) + [tconst]
        
        query = f"UPDATE anime_data SET {set_clause} WHERE tconst = %s"
        cursor.execute(query, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Anime not found")
        
        cursor.execute("SELECT * FROM anime_data WHERE tconst = %s", (tconst,))
        updated = cursor.fetchone()
        
        return {
            "message": "Anime updated successfully",
            "data": updated
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

@router.put("/movies/{tconst}")
def updateMovie(tconst: str, updates: TitleUpdate):
    try:
        update_data = updates.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No update fields provided")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        set_clause = ", ".join([f"{field} = %s" for field in update_data.keys()])
        values = list(update_data.values()) + [tconst]
        
        query = f"UPDATE movies_data SET {set_clause} WHERE tconst = %s"
        cursor.execute(query, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        cursor.execute("SELECT * FROM movies_data WHERE tconst = %s", (tconst,))
        updated = cursor.fetchone()
        
        return {
            "message": "Movie updated successfully",
            "data": updated
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

@router.put("/shows/{tconst}")
def updateShow(tconst: str, updates: TitleUpdate):
    try:
        update_data = updates.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No update fields provided")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        set_clause = ", ".join([f"{field} = %s" for field in update_data.keys()])
        values = list(update_data.values()) + [tconst]
        
        query = f"UPDATE shows_data SET {set_clause} WHERE tconst = %s"
        cursor.execute(query, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Show not found")
        
        cursor.execute("SELECT * FROM shows_data WHERE tconst = %s", (tconst,))
        updated = cursor.fetchone()
        
        return {
            "message": "Show updated successfully",
            "data": updated
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