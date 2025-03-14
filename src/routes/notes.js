const express = require('express');
const router = express.Router();

// Definir una ruta
/**router.get('/notes', (req, res) => {
    res.render('notes');
});
**/
router.get('/notes/add', (req, res) => {
    res.render('notes/new-notes');
});


// Exportar el router
module.exports = router;
