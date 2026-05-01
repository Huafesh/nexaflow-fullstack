import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Ruta POST para procesar el registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, correo, empresa, dni } = req.body;

    // Validación básica en el backend
    if (!nombre || !correo || !empresa) {
      return res.status(400).json({ error: 'Nombre, correo y empresa son obligatorios.' });
    }

    // Crear un nuevo usuario en la base de datos
    const newUser = new User({
      nombre,
      correo,
      empresa,
      dni
    });

    await newUser.save();

    res.status(201).json({ 
      success: true, 
      message: '¡Registro exitoso!', 
      data: newUser 
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor al procesar el registro.' 
    });
  }
});

// Ruta GET de prueba para verificar que la API responde
router.get('/ping', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

export default router;
