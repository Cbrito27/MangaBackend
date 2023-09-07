import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 5000;

// Configura el middleware para parsear JSON
app.use(express.json());

// Conecta a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rutas de usuario
import usuariosRouter from './routes/usuarios.js';
app.use('/api/usuarios', usuariosRouter);

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
