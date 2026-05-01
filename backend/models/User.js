import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  empresa: {
    type: String,
    required: true,
    trim: true
  },
  dni: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export default mongoose.model('User', UserSchema);
