// backend/src/server.js - Versión estable y funcional
require('dotenv').config();
const dns = require('dns');
const http = require('http');
const connectDB = require('./db');

// Importar modelos de Mongoose
const Profesor = require('./models/Profesor');
const Alumno = require('./models/Alumno');
const Clase = require('./models/Clase');
const Horario = require('./models/Horario');

// Configurar Google DNS para resolver MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Deshabilitar reinicios automáticos
process.removeAllListeners('uncaughtException');
process.removeAllListeners('unhandledRejection');

// Conectar a MongoDB Atlas
connectDB();

// ... arriba igual (imports, connectDB, etc.)

const server = http.createServer(async (req, res) => {
  console.log('Petición:', req.method, req.url);

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Endpoint raíz
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'API running', mongodb: 'Conexión lista' }));
    return;
  }

  // ---------------- GOOGLE AUTH ----------------
  if (req.url === '/auth/google') {
    const clientId = 'TU_CLIENT_ID';
    const redirectUri = 'http://localhost:3000/auth/google/callback';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=profile email&` +
      `access_type=offline`;

    res.writeHead(302, { 'Location': authUrl });
    res.end();
    return;
  }

  if (req.url.startsWith('/auth/google/callback')) {
    const urlParts = req.url.split('?');
    const query = urlParts.length > 1 ? urlParts[1] : '';
    const params = new URLSearchParams(query);

    const code = params.get('code');
    const error = params.get('error');

    if (error) {
      const errorData = { error: 'Error de autenticación: ' + error };
      const redirectUrl = `http://localhost:5173?auth=${encodeURIComponent(JSON.stringify(errorData))}`;
      res.writeHead(302, { 'Location': redirectUrl });
      res.end();
      return;
    }

    if (!code) {
      const errorData = { error: 'No se recibió código de autorización' };
      const redirectUrl = `http://localhost:5173?auth=${encodeURIComponent(JSON.stringify(errorData))}`;
      res.writeHead(302, { 'Location': redirectUrl });
      res.end();
      return;
    }

    // Simulación: en producción aquí intercambiarías el code por token
    const userData = {
      user: {
        id: 'google_' + Date.now(),
        displayName: 'Usuario Google',
        email: 'usuario@gmail.com',
        photo: 'https://picsum.photos/seed/google/50/50.jpg',
        provider: 'google'
      },
      message: "Autenticación exitosa con Google"
    };

    const redirectUrl = `http://localhost:5173?auth=${encodeURIComponent(JSON.stringify(userData))}`;
    res.writeHead(302, { 'Location': redirectUrl });
    res.end();
    return;
  }

  // ---------------- GET ----------------
  if (req.url === '/profesores' && req.method === 'GET') {
    try {
      const profesores = await Profesor.find({});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(profesores));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error consultando profesores' }));
    }
    return;
  }

  if (req.url === '/alumnos' && req.method === 'GET') {
    try {
      const alumnos = await Alumno.find({});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(alumnos));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error consultando alumnos' }));
    }
    return;
  }

  if (req.url === '/clases' && req.method === 'GET') {
    try {
      const clases = await Clase.find({});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(clases));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error consultando clases' }));
    }
    return;
  }

  if (req.url === '/horarios' && req.method === 'GET') {
    try {
      const horarios = await Horario.find({})
        .populate('profesor_id', 'nombre especialidad')
        .populate('alumno_id', 'nombre edad')
        .populate('clase_id', 'nombre descripcion');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(horarios));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error consultando horarios' }));
    }
    return;
  }

  // ---------------- POST ----------------
  if (req.url === '/profesores' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const nuevo = await Profesor.create(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(nuevo));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al guardar profesor' }));
      }
    });
    return;
  }

  if (req.url === '/alumnos' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const nuevo = await Alumno.create(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(nuevo));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al guardar alumno' }));
      }
    });
    return;
  }

  if (req.url === '/clases' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const nuevo = await Clase.create(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(nuevo));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al guardar clase' }));
      }
    });
    return;
  }

  if (req.url === '/horarios' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const nuevo = await Horario.create(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(nuevo));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error al guardar horario' }));
      }
    });
    return;
  }

  // ---------------- DELETE ----------------
  if (req.url.startsWith('/horarios/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    try {
      await Horario.findByIdAndDelete(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Horario eliminado exitosamente', id }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error al eliminar horario' }));
    }
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
  console.log('MongoDB Atlas connection ready');
});
