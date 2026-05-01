import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS para permitir peticiones desde el frontend (que corre en un puerto diferente o en el contenedor)
app.use(cors());

// Middleware para procesar JSON en el body de las peticiones
app.use(express.json());

// Conexión a MongoDB (la URL usa el nombre del servicio en docker-compose: 'mongodb')
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/nexaflow';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Conectado exitosamente a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Rutas
app.use('/api', apiRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
