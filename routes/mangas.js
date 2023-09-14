import express from 'express';
import path from 'path';
import manga from '../models/manga.js';


const router = express.Router();

// Ruta para obtener una imagen por su nombre de archivo
router.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, '../img', imageName); // Ruta completa al archivo de imagen

    // Verificar si el archivo de imagen existe antes de enviarlo
    fs.access(imagePath, fs.constants.R_OK, (err) => {
        if (err) {
            // Si el archivo no existe, envía una respuesta de error 404 (No encontrado)
            res.status(404).json({ message: 'Imagen no encontrada' });
        } else {
            // Si el archivo existe, envía la imagen como respuesta
            res.sendFile(imagePath);
        }
    });
});

// Obtener todos los mangas
router.get('/', async (req, res) => {
    try {
        const mangas = await manga.find();
        const mangasWithImageFileName = mangas.map((mangaItem) => ({
            ...mangaItem.toObject(),
            imageFileName: mangaItem.imageFileName,
        }));
        res.status(200).json(mangasWithImageFileName);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los mangas', error });
    }
});

// Crear un manga
router.post('/', async (req, res) => {
    const mangaData = req.body;

    try {
        const newManga = new manga(mangaData);
        await newManga.save();
        res.status(201).json(newManga);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el manga', error });
    }
});


// Ruta para alquilar un manga (POST /rent)
router.post('/rent', async (req, res) => {
    // Verifica si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({ error: 'Debes iniciar sesión para alquilar un manga' });
    }
  
    // Recopila la información del alquiler desde el cuerpo de la solicitud
    const { fechaAlquiler, fechaEntrega, mangaNombre, estado } = req.body;
  
    try {
      // Crea un objeto de alquiler
      const alquiler = {
        FechaA: fechaAlquiler,
        FechaE: fechaEntrega,
        Manga: mangaNombre,
        EstadoD: estado,
      };
  
      // Agrega el objeto de alquiler al arreglo MangaA del usuario
      req.user.MangaA.push(alquiler);
  
      // Guarda el usuario actualizado en la base de datos
      await req.user.save();
  
      res.json({ message: 'Alquiler registrado con éxito' });
    } catch (error) {
      console.error('Error al registrar el alquiler:', error);
      res.status(500).json({ error: 'Error de servidor' });
    }
  });
  


  router.get('/mangas-disponibles', async (req, res) => {
    try {
      const mangasDisponibles = await Manga.find({ state: true });
      res.json(mangasDisponibles);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mangas disponibles' });
    }
  });
  
  // Ruta para alquilar un manga
  router.post('/alquilar-manga', async (req, res) => {
    try {
      const { userId, mangaId, fechaAlquiler, fechaEntrega } = req.body;
  
      // Verifica si el manga está disponible
      const manga = await manga.findById(mangaId);
      if (!manga || !manga.state) {
        return res.status(400).json({ error: 'El manga no está disponible para alquilar' });
      }
  
      // Crea un registro de alquiler en el usuario
      const alquiler = {
        FechaA: fechaAlquiler,
        FechaE: fechaEntrega,
        Manga: manga.title,
        EstadoD: true, // Puedes definir el estado deseado aquí
      };
  
      await User.findByIdAndUpdate(userId, { $push: { MangaA: alquiler } });
  
      // Actualiza la disponibilidad del manga
      await Manga.findByIdAndUpdate(mangaId, { state: false });
  
      res.json({ message: 'Manga alquilado con éxito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al alquilar el manga' });
    }
  });
  
  // Ruta para ver los mangas alquilados por un usuario
  router.get('/mangas-alquilados/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json(user.MangaA);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener mangas alquilados' });
    }
  });

export default router;
