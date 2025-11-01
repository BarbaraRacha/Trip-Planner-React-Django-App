# 🚛 ELD Trip Planner


[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://your-app.vercel.app)
[![API](https://img.shields.io/badge/API-Active-blue)](https://your-backend.onrender.com)

---

## 🎯 Overview

Full-stack web application that helps truck drivers plan routes while ensuring compliance with FMCSA Hours of Service regulations. Automatically calculates mandatory rest periods, breaks, and generates daily ELD logs.

**Key Features:**
- Multi-point route planning with interactive maps
- Automatic ELD log generation (70hr/8day cycle)
- FMCSA HOS compliance validation
- Fuel stop scheduling (every 1,000 miles)
- Visual 24-hour timelines

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Leaflet, Axios  
**Backend:** Django 4.2, Django REST Framework, Gunicorn  
**APIs:** OpenRouteService (routing), OpenStreetMap (maps)  
**Deployment:** Vercel (frontend), Render (backend)

---

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000
VITE_ORS_API_KEY=your_key" > .env
npm run dev  # http://localhost:5173
```

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
echo "ORS_API_KEY=your_key
SECRET_KEY=your-secret
DEBUG=True
ALLOWED_HOSTS=localhost
CORS_ORIGINS=http://localhost:5173" > .env
python manage.py migrate
python manage.py runserver  # http://localhost:8000
```

---

## 📡 API Usage

**Endpoint:** `POST /api/trips/calculate/`

**Request:**
```json
{
  "current_location": "Los Angeles, CA",
  "pickup_location": "Phoenix, AZ",
  "dropoff_location": "Dallas, TX",
  "current_cycle_used": 10.0
}
```

**Response:**
```json
{
  "route": {
    "distance_miles": 1445.23,
    "duration_hours": 21.5
  },
  "eld_logs": [...],
  "summary": {
    "total_days": 2,
    "total_driving_hours": 21.5
  }
}
```

---

## ⚖️ FMCSA Compliance

| Regulation | Implementation |
|------------|----------------|
| 11-hour driving limit | ✅ Enforced |
| 14-hour on-duty limit | ✅ Enforced |
| 30-min break after 8hrs | ✅ Auto-scheduled |
| 10-hour off-duty rest | ✅ Mandatory |
| 70hrs/8days cycle | ✅ Tracked |

---

## 🌐 Deployment

### Vercel (Frontend)
1. Push to GitHub
2. Import project on Vercel
3. Set env vars: `VITE_API_URL`, `VITE_ORS_API_KEY`
4. Deploy

### Render (Backend)
1. Push to GitHub
2. Create Web Service on Render
3. Build: `pip install -r requirements.txt`
4. Start: `gunicorn eld_backend.wsgi:application`
5. Set env vars: `ORS_API_KEY`, `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ORIGINS`

---

## 📸 Screenshots

| Trip Form | Route Map | ELD Logs |
|-----------|-----------|----------|
| ![Form](docs/form.png) | ![Map](docs/map.png) | ![Logs](docs/logs.png) |

---

## 🤝 Contributing

1. Fork the repo
2. Create branch: `git checkout -b feature/NewFeature`
3. Commit: `git commit -m 'Add NewFeature'`
4. Push: `git push origin feature/NewFeature`
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 👤 Author

**Barbara Racha**  
📧 rachabarbara@gmail.com  

---

<div align="center">

**Made with ❤️ by Barbara Racha**

⭐ Star this repo if you find it helpful!

</div>
