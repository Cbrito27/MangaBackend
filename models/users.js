import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Debes almacenar las contraseñas de forma segura (por ejemplo, utilizando bcrypt)
});

const User = mongoose.model('User', userSchema);

export default User;
