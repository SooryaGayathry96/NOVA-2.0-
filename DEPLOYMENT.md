# NOVA 2.O — Deployment Guide

This full-stack application packages the Express.js API and the React frontend into a unified production build served from a single port (`5000`).

---

## Option 1: Render.com (Free 1-Click Hosting)

1. Push this repository to **GitHub**.
2. Go to **[Render.com](https://render.com)** and click **New > Web Service**.
3. Connect your repository.
4. Render will auto-detect the configuration from `render.yaml`, or configure manually:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Port:** `5000`
5. Environment Variables:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(any secure random string)*
   - `NASA_API_KEY`: `DEMO_KEY` *(or your NASA API key)*
   - `MONGODB_URI`: *(Optional: connect your MongoDB Atlas URI, or leave empty to use the automatic in-memory Mongo engine)*
6. Click **Deploy Web Service**. You will receive an active HTTPS URL (`https://your-app.onrender.com`).

---

## Option 2: Railway.app

1. Install the Railway CLI or use the Railway web dashboard.
2. Link your repository. Railway auto-detects `Dockerfile` or `package.json`.
3. (Optional) Add a MongoDB plugin with one click in the Railway canvas.
4. Deploy! Railway assigns a public domain like `https://nova2.up.railway.app`.

---

## Option 3: Docker Container (Any Cloud / VPS / Google Cloud Run)

Build and run using the included multi-stage `Dockerfile`:

```bash
# 1. Build Docker image
docker build -t nova2-junior-astronaut .

# 2. Run container
docker run -d -p 5000:5000 -e NODE_ENV=production nova2-junior-astronaut
```

The app will be accessible at `http://localhost:5000`.
