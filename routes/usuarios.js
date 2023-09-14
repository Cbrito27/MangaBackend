import express from 'express';
import User from '../models/users.js';
import manga from '../models/manga.js';
const router = express.Router();

// Ruta para el registro de usuarios
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica si el correo electrónico ya está en uso
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Crea un nuevo usuario
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Registro exitoso
    res.json({ message: 'Registro exitoso' });
  } catch (error) {
    console.error('Error de registro:', error);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca un usuario con el correo electrónico proporcionado
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verifica la contraseña (debes agregar lógica segura de autenticación aquí)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ message: 'Inicio de sesión exitoso', user: { name: user.name } });
  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    res.status(500).json({ error: 'Error de servidor' });
  }
});

router.post('/registrar-alquiler', async (req, res) => {
  try {
      const { userId, fechaAlquiler, fechaEntrega, manga, estado } = req.body;

      // Encuentra el usuario por su ID
      const usuario = await User.findById(userId);

      if (!usuario) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Crea un objeto de alquiler
      const alquiler = {
          FechaA: fechaAlquiler, 
          FechaE: fechaEntrega,
          Manga: manga,//nombre del manga
          EstadoD: estado,
      };

      // Agrega el objeto de alquiler al array MangaA del usuario
      usuario.MangaA.push(alquiler);

      // Guarda el usuario actualizado en la base de datos
      await usuario.save();

      return res.status(200).json({ message: 'Alquiler agregado con éxito' });
  } catch (error) {
      console.error('Error al agregar alquiler:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
});



export default router;
