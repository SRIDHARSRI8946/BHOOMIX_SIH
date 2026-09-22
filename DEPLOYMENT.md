# BhoomiX Deployment Guide

BhoomiX is configured as a **Unified Fullstack Service**: the FastAPI backend serves both the REST API (`/api/...`) and the compiled React (Vite) Single Page Application (`/`) from a single port.

---

## 🚀 Option 1: Free Cloud Deployment on Render (Recommended)

Render offers a free tier that can deploy your Docker container straight from your GitHub repository.

### Step-by-Step Instructions:
1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure unified BhoomiX deployment"
   git push origin main
   ```
2. **Go to [Render.com](https://render.com/)** and sign in with your GitHub account.
3. Click **New +** -> **Web Service**.
4. Select your repository: `SRIDHARSRI8946/BHOOMIX_SIH`.
5. Render will automatically detect the **Dockerfile** (or you can choose "Docker" as the runtime).
6. Configure the settings:
   - **Name**: `bhoomix` (or your preferred name)
   - **Region**: Choose the closest region (e.g., Oregon or Singapore)
   - **Branch**: `main`
   - **Instance Type**: **Free**
7. *(Optional)* Add Environment Variables under **Advanced**:
   - `JWT_SECRET_KEY`: (auto-generated or enter a random secure string)
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `1440`
8. Click **Deploy Web Service**.
9. Once the build completes (~2–3 minutes), Render provides a live HTTPS URL:
   ```
   https://bhoomix-xxxx.onrender.com
   ```
   Both the React frontend and the FastAPI backend are live on this single URL!

---

## 🚆 Option 2: Deploy on Railway

1. Go to [Railway.app](https://railway.app/) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select `BHOOMIX_SIH`.
4. Railway automatically detects the root `Dockerfile` and builds the image.
5. In **Settings** -> **Networking**, click **Generate Domain**.
6. Your app is live with automatic SSL!

---

## 🐳 Option 3: Run Locally or on Any Server with Docker

You can run the entire unified stack on your local machine or any Linux VPS (AWS EC2, DigitalOcean, Hetzner, Azure, GCP) with Docker:

### Using Docker Compose (Single Command)
```bash
docker compose up --build
```
The application will start at:
- **Web App & Dashboard**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`
- **Swagger Documentation**: `http://localhost:5000/docs`

To run in the background (detached mode):
```bash
docker compose up -d
```

To stop:
```bash
docker compose down
```

### Using Plain Docker
```bash
# 1. Build the image
docker build -t bhoomix-app .

# 2. Run the container
docker run -d -p 5000:5000 --name bhoomix bhoomix-app
```

---

## 🛠️ Option 4: Local Development (Hot Reloading)

If you are actively developing code:
- Run `run_project.bat` from the project root.
- Backend will run on `http://127.0.0.1:5000` with uvicorn auto-reload.
- Frontend will run on `http://localhost:3000` with Vite HMR and dev proxy to `/api`.

---

## 📋 Default Demo Credentials

When the database initializes, the following demo accounts are seeded automatically:

| Role | Username / Email | Password |
|---|---|---|
| **Revenue Officer** | `officer@bhoomix.gov.in` | `officer123` |
| **Citizen** | `citizen@bhoomix.gov.in` | `citizen123` |
