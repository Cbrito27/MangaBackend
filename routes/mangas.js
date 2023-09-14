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



