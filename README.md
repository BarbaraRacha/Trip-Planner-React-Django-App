# 🗺️ Trip Planner React-Django App

[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Frontend Build](https://img.shields.io/badge/frontend-ready-green.svg)]()
[![Backend Build](https://img.shields.io/badge/backend-ready-green.svg)]()

A **full-stack Trip Planner** application built with **Django** (backend) and **React** (frontend).  
The app allows drivers to enter trip details and outputs an **interactive route map** with stops and rest points, as well as **daily ELD (Electronic Logging Device) log sheets** automatically generated based on trip length.

---

## 🔗 Repository
**GitHub Repository:** [Trip-Planner-React-Django-App](https://github.com/BarbaraRacha/Trip-Planner-React-Django-App)

---

## 🎯 Features
- Input fields for:
  - Current location
  - Pickup location
  - Dropoff location
  - Current cycle hours used
- Route calculation and map visualization
- Automatic rest and fuel stops placement
- Generation of daily ELD log sheets for long trips
- Responsive, clean, and driver-friendly UI

---

## 🧰 Tech Stack
- **Backend:** Django, Django REST Framework (Python)
- **Frontend:** React, React Hooks, Leaflet.js
- **Routing / Map API:** OpenRouteService (free routing API)
- **Map Rendering:** Leaflet.js
- **Hosting:**
  - Frontend → [Vercel](https://vercel.com)
  - Backend → Render / Fly.io / Railway / Heroku (or serverless via Vercel)

---

## 📁 Project Structure
/
├── backend/ # Django backend
│ ├── manage.py
│ ├── requirements.txt
│ ├── tripplanner/ # Django app: models, views, serializers, urls
│ └── ...
├── frontend/ # React frontend
│ ├── package.json
│ ├── public/
│ └── src/
│ ├── components/
│ │ ├── InputForm.jsx
│ │ ├── MapView.jsx
│ │ └── DailyLog.jsx
│ ├── services/
│ │ └── api.js
│ └── App.jsx
├── .gitignore
└── README.md

yaml
Copier le code

---

## ⚙️ Installation (Local Setup)

> **Requirements:** Python 3.10+ and Node.js 16+ (or newer)

### Backend (Django)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
Frontend (React)
bash
Copier le code
cd frontend
npm install
# set environment variable REACT_APP_API_URL to backend base URL (e.g. http://localhost:8000)
npm start
🌍 Environment Variables
Create .env files for backend and frontend.

backend/.env

ini
Copier le code
DJANGO_SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
ROUTING_API_KEY=your_openrouteservice_api_key
frontend/.env

ini
Copier le code
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_MAP_API_KEY=your_map_api_key_if_needed
🔌 API Endpoints (examples)
POST /api/trip/ → Submits trip details and returns route, stops, and daily logs

GET /api/trips/:id/ → Fetch trip details and generated logs

GET /api/status/ → Backend status check

(Adjust endpoint paths if your backend differs.)

🧭 Usage Example
Open the live hosted app or run locally.

Fill in example data:

Current Location: Casablanca, Morocco

Pickup Location: Paris, France

Dropoff Location: Marrakech, Morocco

Current Cycle Used: 35 hours

Click Submit / Calculate.

The app will display:

An interactive route map with stops and rest points

Automatically generated daily ELD logs for the entire trip

You can zoom, pan, and inspect stops directly on the map.

✅ Assumptions
Property-carrying driver

70 hours / 8 days cycle

No adverse driving conditions

1 hour for pickup and drop-off

Fueling at least once every 1,000 miles

🎨 UI / UX Highlights
Minimal and responsive design

Clear, organized route visualization

Simple and intuitive data entry form

Instant feedback and smooth animations

Clean typography and color palette for readability

🚀 Deployment
Frontend:
Deploy on Vercel.
Set environment variable REACT_APP_API_URL to your backend URL.

Backend:
Deploy on Render, Fly.io, Railway, or Heroku.
Ensure your ROUTING_API_KEY and Django settings are correctly configured for production.

🧩 Known Limitations
Free routing APIs may have rate limits or small deviations.

Hours-of-service rules simplified for demonstration purposes.

For real-world usage, more accurate ELD and HOS logic would be required.

Cross-border trips (e.g., Casablanca → Paris → Marrakech) depend on external API route data.

🛠️ Developer Notes
Keep all API keys hidden using .env files.

The backend handles trip logic; the frontend handles visualization and user input.

Add unit tests for route and log generation logic.

The structure is modular and easy to extend.

🧪 Demo
Watch a short Loom demo explaining:

The project overview

How to use the app

The code structure (frontend & backend)

Example results for a Casablanca → Paris → Marrakech trip

👉 Loom Demo Video (replace with your Loom link)

📬 Contact
For any questions or feedback:
📧 your-email@example.com

📝 License
This project is licensed under the MIT License.
You’re free to use, modify, and distribute it under the same terms.

✨ Thank you for reviewing this project!
A clean, practical, and modern solution for route planning and automated ELD log generation.

yaml
Copier le code
