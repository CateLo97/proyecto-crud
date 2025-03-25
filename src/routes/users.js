const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const User = require('../models/Users.js');

const passport= require('passport');


// Middleware para procesar datos de formularios
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Rutas
router.get('/users', (req, res) => {
    res.send('users');
});

router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin',passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect:'/users/signin',
    failureFlash:true
}))

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post(
    '/users/signup',
    [
        // Validaciones de los campos
        body('name', 'El nombre es obligatorio').notEmpty(),
        body('email', 'Debes ingresar un correo válido').isEmail(),
        body('password', 'La contraseña debe tener al menos 4 caracteres').isLength({ min: 4 }),
        body('confirm_password', 'Las contraseñas no coinciden').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
    ],
    async (req, res) => {
        const { name, email, password } = req.body;
        const errors = validationResult(req);
        const emailUser = await User.findOne({ email: email });

        // Verificar si hay errores en la validación
        if (!errors.isEmpty()) {
            return res.render('users/signup', {
                errors: errors.array(),
                name,
                email
            });
        }
        if(emailUser){
            req.flash('success_msg', 'This email is not available because it already exists. Please try another one.');
            return res.redirect('/users/signup');
        }

        try {
            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Aquí podrías guardar el usuario en tu base de datos
            const newUser = new User({name, email, password: hashedPassword});
            await newUser.save()
            req.flash('success_msg', 'You are registered.');
            return res.redirect('/users/signin');

        } catch (error) {
            return res.status(500).send('An error occurred while processing the request.');
        }
    }
);
router.get('/users/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err); // Maneja el error si ocurre
        }
        res.redirect('/'); // Redirige al usuario después de cerrar sesión
    });
});
module.exports = router;
