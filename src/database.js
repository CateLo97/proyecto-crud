const mongoose = require('mongoose');
require('dotenv').config();


// Verificar si la variable de entorno está definida
if (!process.env.MONGODB_URI) {
    console.error('Falta la variable MONGODB_URI en el archivo .env');
    process.exit(1); // Salir del proceso si no está definida
}

// Conectar a la base de datos
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB is connected'))
    .catch(err => console.error(err));
