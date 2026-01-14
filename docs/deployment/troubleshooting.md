# Troubleshooting Guide

Common issues and their solutions.

---

## Frontend Issues

### Speech Recognition Not Working

**Symptom**: Clicking mic does nothing

**Solutions**:
1. **Use Chrome or Edge** - Firefox doesn't support Web Speech API
2. **Allow microphone** - Check browser permissions
3. **Use HTTPS** - Required in production
4. **Check console** - Look for JavaScript errors

---

### "Microphone access denied"

**Symptom**: Error message about mic permission

**Solutions**:
1. Click the lock/info icon in address bar
2. Set Microphone to "Allow"
3. Refresh the page

---

### Form Not Filling

**Symptom**: AI speaks but form stays empty

**Solutions**:
1. Check browser console for errors
2. Verify `VITE_API_URL` is correct
3. Check backend is running
4. Look for CORS errors

---

### Blank Page

**Symptom**: Page loads but nothing shows

**Solutions**:
1. Open browser console (F12)
2. Look for JavaScript errors
3. Check if API URL is set
4. Try hard refresh (Ctrl+Shift+R)

---

## Backend Issues

### "Cannot connect to API"

**Symptom**: Frontend can't reach backend

**Solutions**:
1. Check backend is running (`node index.js`)
2. Verify port is correct (default: 5000)
3. Check CORS is enabled
4. Test with: `curl http://localhost:5000/`

---

### "GEMINI_API_KEY is undefined"

**Symptom**: Server crashes on start

**Solutions**:
1. Create `.env` file in `server/` folder
2. Add `GEMINI_API_KEY=your_key`
3. Restart the server
4. Check for typos in variable name

---

### "429 Too Many Requests"

**Symptom**: Rate limit errors in console

**Solutions**:
1. Wait a few minutes (rate limits reset)
2. Reduce request frequency
3. System auto-retries with backoff
4. Falls back to regex extraction

---

### "Model not found"

**Symptom**: Gemini returns 404

**Solutions**:
1. Check model name: `gemini-2.0-flash`
2. Verify API key is valid
3. Check Google AI Studio for model availability

---

## Deployment Issues

### Railway: "Railpack could not determine..."

**Symptom**: Build fails on Railway

**Solutions**:
1. Go to service Settings
2. Set **Root Directory**: `server` or `client`
3. Redeploy

---

### Railway: "No start command"

**Symptom**: Deploy fails

**Solutions**:
1. Add `railway.json` to the folder
2. Or set start command in Settings:
   - Backend: `node index.js`
   - Frontend: `npx serve dist -s -l $PORT`

---

### CORS Errors

**Symptom**: "Access-Control-Allow-Origin" errors

**Solutions**:
1. Backend already has `app.use(cors())`
2. Check API URL is correct (no typos)
3. Ensure protocol matches (http vs https)

---

### Environment Variables Not Working

**Symptom**: Variables are undefined

**Solutions**:
1. **Railway**: Add in Variables tab, redeploy
2. **Local**: Check `.env` file location
3. **Frontend**: Must prefix with `VITE_`
4. **Backend**: Ensure `dotenv` is loaded first

---

## Audio Issues

### No Sound from AI

**Symptom**: AI processes but doesn't speak

**Solutions**:
1. Check browser volume
2. Test with: `speechSynthesis.speak(new SpeechSynthesisUtterance("test"))`
3. Check for speech synthesis support
4. Some browsers need user interaction first

---

### Waveform Not Showing

**Symptom**: Mic active but no visualization

**Solutions**:
1. Check if `analyserRef` is set
2. Verify AudioContext is created
3. Check canvas is rendering
4. Look for console errors

---

## Data Extraction Issues

### Wrong Field Values

**Symptom**: AI puts data in wrong fields

**Solutions**:
1. Speak more clearly
2. Use field names explicitly: "my email is..."
3. Check Gemini prompt in console
4. Fallback extraction might be running

---

### Missing Fields Not Detected

**Symptom**: AI says "done" but fields are empty

**Solutions**:
1. Check field IDs match between frontend and backend
2. Verify form field configuration
3. Check `missingFields` in console

---

## Debug Commands

### Check Backend Health
```bash
curl http://localhost:5000/
```

### Test Gemini
```bash
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{"state":"INTRO","context":{"formTitle":"Test"}}'
```

### View Logs
- **Local**: Check terminal running `node index.js`
- **Railway**: Deployments → Select deployment → Logs

---

## Getting Help

1. Check this troubleshooting guide
2. Review console logs (F12 → Console)
3. Check server logs
4. Search error message online
5. Check Gemini API documentation
