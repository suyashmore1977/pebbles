# Environment Variables

Complete reference for all environment variables used in Pebbles.

---

## Backend Environment Variables

**File**: `server/.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Google AI API key | `AIzaSyB...` |
| `PORT` | ❌ No | Server port (auto-set by Railway) | `5000` |

### GEMINI_API_KEY

**Where to get it**:
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google account
3. Click **"Get API Key"**
4. Create new key or use existing

**Example `.env` file**:
```env
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
```

---

## Frontend Environment Variables

**File**: `client/.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API URL | `http://localhost:5000` |

### VITE_API_URL

**Local development**:
```env
VITE_API_URL=http://localhost:5000
```

**Production (Railway)**:
```env
VITE_API_URL=https://pebbles-backend-xxx.up.railway.app
```

**Important Notes**:
- Must start with `VITE_` for Vite to expose it
- No trailing slash
- Must be HTTPS in production

---

## How Environment Variables Work

### Backend (Node.js)

```javascript
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
const port = process.env.PORT || 5000;
```

- `dotenv` loads from `.env` file
- `process.env` accesses variables

### Frontend (Vite)

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

- Only `VITE_` prefixed vars are exposed
- `import.meta.env` replaces at build time
- Falls back to localhost in development

---

## Environment Files

### Development Setup

```
pebbles/
├── client/
│   └── .env              # VITE_API_URL=http://localhost:5000
└── server/
    └── .env              # GEMINI_API_KEY=xxx
```

### Example Files

**`client/.env.example`**:
```env
# Copy this to .env and fill in your values

# API URL - your backend server URL
# Local: http://localhost:5000
# Production: https://your-backend.onrender.com
VITE_API_URL=http://localhost:5000
```

**`server/.env.example`**:
```env
# Copy this to .env and fill in your values

# Get from https://aistudio.google.com
GEMINI_API_KEY=your_api_key_here

# Port (optional, defaults to 5000)
PORT=5000
```

---

## Security

### Never Commit `.env` Files!

The `.gitignore` should include:
```gitignore
.env
server/.env
```

### Setting Variables in Production

**Railway**:
1. Go to service → Variables tab
2. Add key-value pairs
3. Redeploy

**Vercel**:
1. Go to project → Settings → Environment Variables
2. Add variables
3. Redeploy

**Render**:
1. Go to service → Environment
2. Add variables
3. Deploy

---

## Troubleshooting

### "GEMINI_API_KEY is undefined"
- Check `.env` file exists in `server/` folder
- Check `require('dotenv').config()` is at top of index.js
- Restart the server after adding `.env`

### "VITE_API_URL is undefined"
- Make sure variable starts with `VITE_`
- Restart Vite dev server after changing `.env`
- Check `.env` is in `client/` folder

### API key not working
- Verify key at [aistudio.google.com](https://aistudio.google.com)
- Check for extra spaces or quotes
- Ensure key has Gemini API access
