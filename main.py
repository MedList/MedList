from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import check_connection
from routes import titles, search
from routes.tmdbScrape import router as images_router

# Create the FastAPI application
app = FastAPI(
    title="IMDB Titles API",
    description="API for accessing IMDB titles from anime, movies, and shows tables",
    version="1.0.0"
)

# CORS for web app access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    print("Starting API server...")
    check_connection()

@app.get("/")
def root():
    return {
        "message": "IMDB Titles API",
        "version": "1.0.0",
        "description": "Query anime, movies, and shows from MySQL database"
    }

# Include routers
app.include_router(search.router)
app.include_router(titles.router)
app.include_router(images_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)