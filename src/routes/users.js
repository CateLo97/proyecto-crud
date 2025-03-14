const express = require('express');
const router = express.Router();

// Definir una ruta
router.get('/users', (req, res) => {
    res.send('users');
});

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

// Exportar el router
module.exports = router;
