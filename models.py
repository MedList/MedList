from pydantic import BaseModel
from typing import Optional

class TitleBase(BaseModel):
    tconst: str
    titleType: Optional[str] = None
    primaryTitle: Optional[str] = None
    startYear: Optional[str] = None
    endYear: Optional[str] = None
    genres: Optional[str] = None
    averageRating: Optional[float] = None
    numVotes: Optional[int] = None
    imdb_url: Optional[str] = None

class TitleUpdate(BaseModel):
    titleType: Optional[str] = None
    primaryTitle: Optional[str] = None
    startYear: Optional[str] = None
    endYear: Optional[str] = None
    genres: Optional[str] = None
    averageRating: Optional[float] = None
    numVotes: Optional[int] = None
    imdb_url: Optional[str] = None