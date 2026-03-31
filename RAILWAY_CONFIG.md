# Railway Deployment Configuration

## Backend URL
Your Railway backend is deployed at:
```
https://web-production-169b9.up.railway.app
```

## Frontend Configuration
The `.env` file is already configured with your Railway backend URL.

## API Endpoints
Your frontend will call these endpoints:
- **Upload**: `POST https://web-production-169b9.up.railway.app/api/upload`
- **Action**: `POST https://web-production-169b9.up.railway.app/api/action`
- **Download**: `GET https://web-production-169b9.up.railway.app/api/download`

## Railway Environment Variables
If deploying frontend to Railway, set this environment variable:
```
REACT_APP_BACKEND_URL=https://web-production-169b9.up.railway.app
```

**⚠️ Important Notes:**
1. Always use `https://` protocol for Railway URLs
2. DO NOT include `/api` suffix in the environment variable
3. The `/api` prefix is added in the code for each route

## Testing
Open browser console to see detailed API call logs:
- Request start messages
- Success responses
- Detailed error information

## Troubleshooting
If you still get 405 errors:
1. Verify your backend is running at: https://web-production-169b9.up.railway.app
2. Test backend directly: `curl https://web-production-169b9.up.railway.app/api/upload`
3. Check Railway logs for backend errors
4. Ensure backend routes match: `/api/upload`, `/api/action`, `/api/download`
