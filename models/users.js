import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  MangaA: [
    { // Objeto anidado para Alquiler de manga
      FechaA: Date,
      FechaE: Date,
      Manga: String,
      EstadoD: Boolean,
    }
  ]
});

const User = mongoose.model('User', userSchema);

export default User;
