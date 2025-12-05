from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import csv

# These classes define what data structure the API expects
class TitleBase(BaseModel):
    tconst: str
    titleType: Optional[str] = None
    primaryTitle: Optional[str] = None
    startYear: Optional[str] = None
    endYear: Optional[str] = None
    genres: Optional[str] = None
    averageRating: Optional[float] = None
    numVotes: Optional[int] = None
    title_x: Optional[str] = None
    imdb_url: Optional[str] = None
    title_y: Optional[str] = None

class TitleUpdate(BaseModel):
    titleType: Optional[str] = None
    primaryTitle: Optional[str] = None
    startYear: Optional[str] = None
    endYear: Optional[str] = None
    genres: Optional[str] = None
    averageRating: Optional[float] = None
    numVotes: Optional[int] = None
    title_x: Optional[str] = None
    imdb_url: Optional[str] = None
    title_y: Optional[str] = None

# This list holds all our data in memory
titlesData = []

def loadCsvFile(csvPath: str = "anime_truncated.csv"):
    global titlesData
    titlesData = []
    
    try:
        with open(csvPath, 'r', encoding='utf-8') as file:
            csvReader = csv.DictReader(file)
            for idx, row in enumerate(csvReader, start=1):
                # Convert each CSV row into a dictionary
                title = {
                    "id": idx,
                    "tconst": row.get('tconst', ''),
                    "titleType": row.get('titleType', ''),
                    "primaryTitle": row.get('primaryTitle', ''),
                    "startYear": row.get('startYear', ''),
                    "endYear": row.get('endYear', ''),
                    "genres": row.get('genres', ''),
                    "averageRating": float(row['averageRating']) if row.get('averageRating') and row.get('averageRating') != '' else None,
                    "numVotes": int(row['numVotes']) if row.get('numVotes') and row.get('numVotes') != '' else None,
                    "title_x": row.get('title_x', ''),
                    "imdb_url": row.get('imdb_url', ''),
                    "title_y": row.get('title_y', '')
                }
                titlesData.append(title)
        
        print(f"Loaded {len(titlesData)} titles from {csvPath}")
        return True
    except FileNotFoundError:
        print(f"Error: Could not find file '{csvPath}'")
        return False
    except Exception as e:
        print(f"Error loading CSV: {str(e)}")
        return False

# Create the FastAPI application
app = FastAPI(
    title="IMDB Titles API",
    description="API for IMDB titles data",
    version="1.0.0"
)

# This middleware allows requests from any domain (needed for web apps)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startupEvent():
    # This runs once when the server starts
    print("Starting server...")
    loadCsvFile("anime_truncated.csv")

@app.get("/")
def getRoot():
    # Basic info endpoint
    return {
        "message": "IMDB Titles API",
        "version": "1.0.0",
        "totalTitles": len(titlesData)
    }

@app.get("/titles")
def getAllTitles(skip: int = 0, limit: int = 40000):
    # Returns a chunk of data, useful for pagination
    if not titlesData:
        raise HTTPException(status_code=404, detail="No data loaded")
    
    end = skip + limit
    return {
        "total": len(titlesData),
        "skip": skip,
        "limit": limit,
        "data": titlesData[skip:end]
    }

@app.get("/search/name")
def searchByName(q: str):
    # Search for titles by name
    results = [
        title for title in titlesData
        if title.get("primaryTitle") and q.lower() in title["primaryTitle"].lower()
    ]
    
    if not results:
        raise HTTPException(status_code=404, detail="No titles found")
    
    return {
        "query": q,
        "totalResults": len(results),
        "data": results
    }

@app.get("/search/genre")
def searchByGenre(q: str):
    # Search titles that contain this genre
    results = [
        title for title in titlesData
        if title.get("genres") and q.lower() in title["genres"].lower()
    ]
    
    if not results:
        raise HTTPException(status_code=404, detail="No titles found")
    
    return {
        "query": q,
        "totalResults": len(results),
        "data": results
    }

@app.get("/search/type")
def searchByType(q: str):
    # Search by type like "movie" or "tvSeries"
    results = [
        title for title in titlesData
        if q.lower() in title.get("titleType", "").lower()
    ]
    
    if not results:
        raise HTTPException(status_code=404, detail="No titles found")
    
    return {
        "query": q,
        "totalResults": len(results),
        "data": results
    }

@app.get("/search/year")
def searchByYear(q: str):
    # Find titles from a specific year
    results = [
        title for title in titlesData
        if q in title.get("startYear", "")
    ]
    
    if not results:
        raise HTTPException(status_code=404, detail="No titles found")
    
    return {
        "query": q,
        "totalResults": len(results),
        "data": results
    }

@app.get("/search/tconst")
def searchByTconst(q: str):
    # Search by IMDB ID (partial match works)
    results = [
        title for title in titlesData
        if q.lower() in title.get("tconst", "").lower()
    ]
    
    if not results:
        raise HTTPException(status_code=404, detail="No titles found")
    
    return {
        "query": q,
        "totalResults": len(results),
        "data": results
    }

@app.get("/search/rating")
def searchByRating(min: float, max: float = 10.0):
    # Find titles within a rating range
    results = [
        title for title in titlesData
        if title.get("averageRating") and min <= title.get("averageRating") <= max
    ]
    
    if not results:
        raise HTTPException(status_code=404, detail="No titles found")
    
    return {
        "minRating": min,
        "maxRating": max,
        "totalResults": len(results),
        "data": results
    }

@app.get("/search/votes")
def searchByVotes(min: int):
    # Find titles with at least this many votes
    results = [
        title for title in titlesData
        if title.get("numVotes") and title.get("numVotes") >= min
    ]
    
    if not results:
        raise HTTPException(status_code=404, detail="No titles found")
    
    return {
        "minVotes": min,
        "totalResults": len(results),
        "data": results
    }

@app.get("/search/url")
def searchByUrl(q: str):
    # Search by URL (partial match)
    results = [
        title for title in titlesData
        if q.lower() in title.get("imdb_url", "").lower()
    ]
    
    if not results:
        raise HTTPException(status_code=404, detail="No titles found")
    
    return {
        "query": q,
        "totalResults": len(results),
        "data": results
    }

@app.get("/titles/id/{titleId}")
def getTitleById(titleId: int):
    # Find a specific title using its ID number
    for title in titlesData:
        if title["id"] == titleId:
            return title
    
    raise HTTPException(status_code=404, detail="Title not found")

@app.get("/titles/tconst/{tconst}")
def getTitleByTconst(tconst: str):
    # Find a title using its IMDB identifier (like tt0111161)
    for title in titlesData:
        if title["tconst"] == tconst:
            return title
    
    raise HTTPException(status_code=404, detail="Title not found")

@app.put("/titles/{titleId}")
def updateTitleById(titleId: int, titleUpdate: TitleUpdate):
    # Update a title's information by its ID
    for title in titlesData:
        if title["id"] == titleId:
            updateData = titleUpdate.model_dump(exclude_unset=True)
            for field, value in updateData.items():
                title[field] = value
            
            return {
                "message": "Title updated",
                "data": title
            }
    
    raise HTTPException(status_code=404, detail="Title not found")

@app.put("/titles/tconst/{tconst}")
def updateTitleByTconst(tconst: str, titleUpdate: TitleUpdate):
    # Update a title using its IMDB identifier
    for title in titlesData:
        if title["tconst"] == tconst:
            updateData = titleUpdate.model_dump(exclude_unset=True)
            for field, value in updateData.items():
                title[field] = value
            
            return {
                "message": "Title updated",
                "data": title
            }
    
    raise HTTPException(status_code=404, detail="Title not found")

@app.post("/admin/reload")
def reloadCsv(csvPath: str = "anime_truncated.csv"):
    # Manually reload the CSV file if needed
    if loadCsvFile(csvPath):
        return {"message": f"Reloaded {len(titlesData)} titles"}
    else:
        raise HTTPException(status_code=500, detail="Failed to reload CSV")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)