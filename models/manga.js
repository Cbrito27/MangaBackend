import mongoose from 'mongoose';

const mangaSchema = new mongoose.Schema(
    {
        title: String,
        descripcion :String,
        image :String,
        precio :String,
        CantDis:Number,
        CanttAl: Number,
        state: Boolean
    }
)
const manga = mongoose.model('manga', mangaSchema);



export default manga;