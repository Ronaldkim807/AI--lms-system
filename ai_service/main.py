from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import asyncio

# ---------------------------------
# Load environment variables
# ---------------------------------
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "lms_db")
PORT = int(os.getenv("PORT", 8000))

# ---------------------------------
# FastAPI App
# ---------------------------------
app = FastAPI(title="AI-LMS Recommendation Service")

# ---------------------------------
# MongoDB Connection
# ---------------------------------
client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]
courses_collection = db["courses"]

# ---------------------------------
# Data Models
# ---------------------------------
class RecommendationRequest(BaseModel):
    user_id: str
    user_interests: List[str]
    completed_courses: List[str]
    enrolled_courses: List[str]

class RecommendationResponse(BaseModel):
    recommendations: List[dict]
    user_id: str

# ---------------------------------
# Recommendation Logic
# ---------------------------------
def content_based_recommendation(user_interests, courses, top_n=5):
    """Simple content-based recommendation using TF-IDF and cosine similarity"""
    if not courses:
        return []

    # Combine text data from course details
    course_texts = [
        f"{c.get('title', '')} {c.get('description', '')} {' '.join(c.get('tags', []))} {c.get('category', '')}"
        for c in courses
    ]

    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(course_texts)

    # Represent user interests as a vector
    user_text = " ".join(user_interests)
    user_vector = vectorizer.transform([user_text])

    # Compute cosine similarity between user and courses
    similarity_scores = cosine_similarity(user_vector, tfidf_matrix).flatten()
    top_indices = similarity_scores.argsort()[-top_n:][::-1]

    recommendations = []
    for idx in top_indices:
        if similarity_scores[idx] > 0:
            course = courses[idx].copy()
            course["similarity_score"] = round(float(similarity_scores[idx]), 3)
            recommendations.append(course)

    return recommendations

# ---------------------------------
# Routes
# ---------------------------------
@app.get("/")
async def root():
    try:
        await client.server_info()
        return {"message": "✅ AI-LMS Recommendation Service connected to MongoDB"}
    except Exception:
        return {"message": "⚠️ Unable to connect to MongoDB. Check MONGO_URI or whitelist your IP."}

@app.get("/health")
async def health_check():
    try:
        count = await courses_collection.count_documents({})
        return {"status": "healthy", "courses_in_db": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@app.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    try:
        # Try connecting to the DB
        await client.server_info()

        # Fetch all courses
        cursor = courses_collection.find({})
        courses_data = await cursor.to_list(length=1000)

        if not courses_data:
            return RecommendationResponse(
                user_id=request.user_id,
                recommendations=[]
            )

        # Filter out already completed/enrolled courses
        available_courses = [
            course for course in courses_data
            if str(course["_id"]) not in (request.enrolled_courses + request.completed_courses)
        ]

        recommendations = content_based_recommendation(
            request.user_interests, available_courses
        )

        return RecommendationResponse(
            user_id=request.user_id,
            recommendations=recommendations
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

# ---------------------------------
# Run Server
# ---------------------------------
if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Starting AI-LMS service on port {PORT}...")
    uvicorn.run(app, host="0.0.0.0", port=PORT)
