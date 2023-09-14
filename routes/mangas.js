import express from 'express';
import path from 'path';
import manga from '../models/manga.js';
import User from '../models/users.js';


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

router.put('/descontar/:id', async (req, res) => {
    const mangaId = req.params.id;
    const { cantidadADescontar, cantidadASumar } = req.body;

    try {
        // Encuentra el manga por ID
        const mangaItem = await manga.findById(mangaId);

        if (!mangaItem) {
            return res.status(404).json({ message: 'Manga no encontrado' });
        }

        // Verifica que haya suficiente cantidad disponible para descontar
        if (mangaItem.CantDis < cantidadADescontar) {
            return res.status(400).json({ message: 'No hay suficiente cantidad disponible para descontar' });
        }

        // Descontar de CantDis y sumar a CantAl
        mangaItem.CantDis -= cantidadADescontar;
        mangaItem.CanttAl += cantidadASumar;

        // Guarda los cambios en la base de datos
        await mangaItem.save();

        res.status(200).json(mangaItem);
    } catch (error) {
        console.error('Error al descontar y sumar cantidades:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});



export default router;
