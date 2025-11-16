# AI-LMS: AI-Powered Learning Management System

## Overview
AI-LMS (Artificial Intelligence Learning Management System) is a modern web-based platform that enhances online learning experiences using artificial intelligence.  
The system personalizes course recommendations for learners based on their learning patterns, completed courses, and interests. It also enables instructors to manage courses and track learners’ progress efficiently.

---

## Key Features
- **AI-Powered Course Recommendations:** Learners receive personalized course suggestions using FastAPI and machine learning (TF-IDF similarity model).
- **Dynamic Course Management:** Instructors can add, update, and manage courses stored in MongoDB.
- **User Roles:** Supports Learners, Instructors, and Admins.
- **Modern Frontend:** Built with React for a smooth and responsive user interface.
- **API-Driven Backend:** FastAPI handles intelligent recommendation services and interacts with MongoDB.
- **Database Integration:** Real-time course storage and retrieval via MongoDB Atlas.
- **Secure Configurations:** Environment variables stored using `.env` files.

---

## Tech Stack
| Layer | Technology |
|-------|-------------|
| **Frontend** | React, CSS Modules, Axios |
| **Backend (AI Service)** | FastAPI, Python, Scikit-learn, Uvicorn |
| **Database** | MongoDB Atlas |
| **Hosting** | GitHub Pages (frontend), Render or Railway (backend) |

---ai-lms/
│
├── ai_service/ # FastAPI backend service
│ ├── main.py # AI recommendation logic
│ ├── requirements.txt # Backend dependencies
│ └── .env # MongoDB credentials and port
│
├── client/ # React frontend
│ ├── src/ # Components, pages, and styles
│ ├── public/ # Static files
│ └── package.json # Frontend dependencies
│
└── README.md


---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Ronaldkim807/AI--lms-system.git
cd AI--lms-system

2. Backend Setup (FastAPI)
cd ai_service
python -m venv venv
venv\Scripts\activate       # Windows
# or
source venv/bin/activate    # macOS/Linux

pip install -r requirements.txt


Create a .env file inside ai_service/:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-lms?retryWrites=true&w=majority
DB_NAME=ai-lms
PORT=8000


Run the backend:

uvicorn main:app --host 0.0.0.0 --port 8000


Check backend health:
http://localhost:8000/health

3. Frontend Setup (React)
cd client
npm install
npm start


The app should open on:
http://localhost:3000/


Usage

Learners: Browse courses, receive AI recommendations, and track learning progress.

Instructors: Add, update, and manage courses, and view learner statistics.

Admins: Manage users and maintain overall system integrity.

Contributing

Contributions are welcome! Feel free to fork the repository, make improvements, and submit pull requests.

License

This project is open source under the MIT License.

## Folder Structure
