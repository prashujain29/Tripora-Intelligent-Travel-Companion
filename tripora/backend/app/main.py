from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.api.endpoints import trips, itinerary, destinations, budget, assistant, profile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tripora")

app = FastAPI(
    title="Tripora API — Your Intelligent Travel Companion",
    description="Backend API powering the Tripora Personalized Travel Planning Platform.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(trips.router, prefix="/api/v1/trips", tags=["Trips"])
app.include_router(itinerary.router, prefix="/api/v1/itinerary", tags=["Itinerary"])
app.include_router(destinations.router, prefix="/api/v1/destinations", tags=["Destinations"])
app.include_router(budget.router, prefix="/api/v1/budget", tags=["Budget"])
app.include_router(assistant.router, prefix="/api/v1/assistant", tags=["AI Assistant"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["Profile & Settings"])

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Tripora Travel Platform API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "mock_mode": settings.MOCK_MODE,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

@app.get("/")
async def root():
    return {
        "message": "Welcome to Tripora — Your Intelligent Travel Companion API",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error handler caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again."}
    )

