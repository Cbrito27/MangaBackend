import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import usuariosRouter from './routes/usuarios.js'; // Asegúrate de que las rutas también sean archivos .mjs
import mangasRouter from './routes/mangas.js'; // Asegúrate de que las rutas también sean archivos .mjs

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Conecta a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/users', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rutas de usuario
app.use('/api/usuarios', usuariosRouter);
app.use('/api/mangas', mangasRouter);

// Ruta para servir imágenes estáticas
app.use('/img', express.static(path.join(import.meta.url, 'img')));

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
