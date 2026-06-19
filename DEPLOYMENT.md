# Deployment to Render.com

This project supports multiple deployment methods on Render.com:

1. **Docker Deployment** (Recommended) - Provides consistent environment and better reliability
2. **Node.js Native Deployment** - Traditional deployment method

Both methods include a Node.js backend that serves the React frontend and provides API endpoints for performance monitoring.

## Deployment Steps

### 1. Prepare the Repository

Ensure your code is committed and pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Deploy to Render.com

1. **Sign up/Login to Render.com**
   - Go to [render.com](https://render.com)
   - Sign up or login with your Git provider account

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Choose the repository containing this project

3. **Configure the Service**
   - **Name**: `react-a11y-test` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `node server.js`

4. **Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: Will be automatically set by Render (don't override)

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### 3. Docker Deployment (Recommended)

For better consistency and reliability, use Docker deployment:

1. **Create Docker Service**:
   - Click "New +" → "Web Service"
   - Select "Docker" as environment
   - Connect your Git repository
   - Render will automatically detect the Dockerfile

2. **Configure Service**:
   - **Name**: `react-a11y-test-docker`
   - **Environment**: `Docker`
   - **Dockerfile Path**: `./Dockerfile` (auto-detected)
   - **Health Check Path**: `/health`

3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: Set automatically by Render (do not override)

### 4. Alternative: Use render.yaml

If you prefer configuration as code, use the included `render.yaml` file:

1. Ensure `render.yaml` is in your repository root
2. In Render, click **New +** → **Blueprint**
3. Connect your Git repository — Render reads `render.yaml` and creates the Docker web service
4. The service uses `./Dockerfile`, exposes `/health`, and listens on Render's assigned `PORT`

For a native Node.js deployment instead of Docker, create a web service manually with `buildCommand: npm ci && npm run build` and `startCommand: npm start` (see steps above).

## Features Included

### Frontend
- ✅ React SPA with GOV.UK Design System
- ✅ TypeScript support
- ✅ Vite build system
- ✅ Performance optimizations
- ✅ Accessibility features

### Backend API
- ✅ Performance metrics collection (`/api/performance-metrics`)
- ✅ Error tracking (`/api/errors`)
- ✅ Performance alerts (`/api/performance-alerts`)
- ✅ Analytics dashboard (`/api/analytics/*`)
- ✅ Health check endpoint (`/health`)

### Static Assets
- ✅ GOV.UK Frontend assets served locally
- ✅ Optimized font loading
- ✅ Image optimization

## Monitoring & Analytics

Once deployed, your application will include:

- **Performance Dashboard**: Available at `https://your-app.onrender.com/performance`
- **Health Check**: `https://your-app.onrender.com/health`
- **Analytics API**: `https://your-app.onrender.com/api/analytics/`

## Environment-Specific Configuration

The application automatically detects the environment:
- **Development**: Uses Vite dev server
- **Production**: Uses Express server with static file serving

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (requires >=18.0.0)
   - Verify all dependencies are in `package.json`
   - Check build logs in Render dashboard

2. **Asset Loading Issues**
   - Ensure GOV.UK assets are copied during build
   - Check that static file serving is configured correctly

3. **API Endpoints Not Working**
   - Verify Express server is running
   - Check CORS configuration
   - Ensure routes are properly defined

### Logs

- View real-time logs in the Render dashboard
- Performance metrics are logged to console
- Errors are tracked and can be viewed via `/api/analytics/errors`

## Performance Considerations

- Static assets are served with proper caching headers
- Bundle splitting optimizes loading performance
- GOV.UK assets are served locally (no external CDN dependencies)
- Performance monitoring is built-in for production insights

## Security

- CORS is configured for production
- Environment variables are properly managed
- No sensitive data in client-side code
- Health check endpoint for monitoring

## Scaling

- Render automatically handles traffic scaling
- Consider upgrading to paid plans for better performance
- Monitor performance metrics via the built-in dashboard
