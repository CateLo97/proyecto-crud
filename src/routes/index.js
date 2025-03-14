const express = require('express');
const router = express.Router();

// Definir una ruta
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about');
});


// Exportar el router
module.exports = router;
