# Dashboard Deployment Guide for Render and Vercel

This guide maps exactly to the fields you will see in the Render and Vercel dashboards when deploying Two Threads Studio.

---

## 1. Deploying the Backend on Render

When you click **New +** -> **Web Service** in Render and connect your GitHub repository (`sysDrawnest/Two-Threads-Studio`), fill out the form exactly as follows:

### Basic Settings
- **Name**: `twothreads-backend` *(or any unique name you prefer)*
- **Language**: ⚠️ **Important:** Change this from `Docker` to **`Node`**.
- **Branch**: `main` *(or whichever branch you are currently working on)*
- **Region**: `Singapore (Southeast Asia)` or `Ohio (US East)` *(Choose whichever is closest to where you deployed your Supabase database)*
- **Root Directory**: `backend` *(⚠️ Do not leave this empty)*

### Build & Start Commands (Appears after selecting 'Node')
- **Build Command**: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
- **Start Command**: `npm start`

### Instance Type
- **Instance Type**: Select **Free ($0/month)** for staging/testing.

### Environment Variables
Scroll down to **Environment Variables** and click **Advanced** or **Add Environment Variable**. You need to add these exactly:

| Key | Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DATABASE_URL` | *(Copy your Supabase Transaction Pooler URL here, ensure it ends with `?sslmode=require`)* |
| `SUPABASE_URL` | *(Copy from Supabase)* |
| `SUPABASE_ANON_KEY` | *(Copy from Supabase)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Copy from Supabase)* |
| `JWT_SECRET` | *(Paste a long random string of text, at least 32 characters)* |
| `JWT_REFRESH_SECRET` | *(Paste a different long random string of text)* |
| `FRONTEND_URL` | `https://your-vercel-project-name.vercel.app` *(Leave blank temporarily until you deploy Vercel in Step 2, then come back and add it here)* |
| `BACKEND_URL` | `https://twothreads-backend.onrender.com` *(The URL Render gives you after you click Deploy)* |
| `SHIPPING_PROVIDER` | `mock` |

> Click **Deploy Web Service** at the bottom.

---

## 2. Deploying the Frontend on Vercel

After your Render backend is deployed and you have its live URL (e.g., `https://twothreads-backend.onrender.com`), go to your Vercel Dashboard.

Click **Add New...** -> **Project** and import `sysDrawnest/Two-Threads-Studio`. Fill out the configuration:

### Project Configuration
- **Project Name**: `two-threads-studio`
- **Framework Preset**: `Vite` *(Vercel usually detects this automatically)*
- **Root Directory**: Click **Edit** and select `frontend`.

### Build and Output Settings
*(Leave as default, Vercel will automatically use `npm run build` and the `dist` or `build` folder)*

### Environment Variables
Expand the **Environment Variables** section and add the following:

| Name | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://twothreads-backend.onrender.com/api/v1` *(Replace with your actual Render URL, making sure to include `/api/v1` at the end)* |

> Click **Deploy**.

---

## 3. Final Connection Step
Once Vercel finishes deploying, it will give you a live frontend URL (e.g., `https://two-threads-studio.vercel.app`). 

1. Copy that Vercel URL.
2. Go back to your **Render Dashboard** -> **Environment**.
3. Find the `FRONTEND_URL` variable.
4. Paste your Vercel URL there and Save. Render will quickly restart to apply the new CORS policy.

**You are now fully deployed!**
