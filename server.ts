import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  createAdminSessionToken,
  readAdminSession,
  verifyAdminPassword,
  verifyAdminSessionToken,
} from './lib/adminAuth';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Increase payload limit for media uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure upload & data directories exist
const uploadsDir = path.resolve(__dirname, 'public/uploads');
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Serve public uploaded files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(path.resolve(__dirname, 'public')));

const DB_FILE = path.resolve(dataDir, 'taiba-db.json');

// --- REST API ROUTES ---

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    platform: 'TAIBA | طيبة Tourism System',
    timestamp: new Date().toISOString(),
  });
});

// Admin login authentication
app.post('/api/auth/login', (req: Request, res: Response) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(503).json({ success: false, message: 'Admin password is not configured.' });
  }

  if (!verifyAdminPassword(req.body?.password, adminPassword)) {
    return res.status(401).json({ success: false });
  }

  const secure = req.secure || req.get('x-forwarded-proto') === 'https';
  res.setHeader('Set-Cookie', createAdminSessionCookie(createAdminSessionToken(adminPassword), secure));
  return res.setHeader('Cache-Control', 'no-store').json({ success: true });
});

app.get('/api/auth/session', (req: Request, res: Response) => {
  const authenticated = verifyAdminSessionToken(
    readAdminSession(req.headers.cookie),
    process.env.ADMIN_PASSWORD,
  );
  return res.setHeader('Cache-Control', 'no-store').json({ authenticated });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const secure = req.secure || req.get('x-forwarded-proto') === 'https';
  res.setHeader('Set-Cookie', clearAdminSessionCookie(secure));
  return res.setHeader('Cache-Control', 'no-store').json({ success: true });
});

// Database state retrieval
app.get('/api/state', (_req: Request, res: Response) => {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return res.json(JSON.parse(data));
    } catch {
      return res.json({ hasSavedData: false });
    }
  }
  return res.json({ hasSavedData: false });
});

// Database state persistence
app.post('/api/state', (req: Request, res: Response) => {
  if (!verifyAdminSessionToken(readAdminSession(req.headers.cookie), process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// File upload endpoint
app.post('/api/upload', (req: Request, res: Response) => {
  if (!verifyAdminSessionToken(readAdminSession(req.headers.cookie), process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }

  const { fileName, fileData, mimeType } = req.body;
  if (!fileData) {
    return res.status(400).json({ success: false, error: 'No file data received' });
  }

  try {
    const safeName = `${Date.now()}_${(fileName || 'file.jpg').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.resolve(uploadsDir, safeName);

    // Extract base64 payload if dataURL
    const base64Data = fileData.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const fileUrl = `/uploads/${safeName}`;
    return res.json({
      success: true,
      url: fileUrl,
      fileName: safeName,
      mimeType: mimeType || 'image/jpeg',
      size: base64Data.length * 0.75,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// --- VITE MIDDLEWARE / PRODUCTION SERVING ---
async function startServer() {
  if (!isProd) {
    // Dynamic import to avoid bundling vite in production
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built static files from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[TAIBA] Server running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
