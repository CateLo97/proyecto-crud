const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash= require('express-flash');
const passport = require ('passport');


const indexRoutes = require('./routes/index'); // Importar las rutas
const notesRoutes = require('./routes/notes');
const usersRoutes = require('./routes/users');

// Inicializations
const app = express();
require('./database');
require('./config/passport');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));


// Configure Handlebars as the template engine
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(500).send('Something went wrong!');
});


// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error= req.flash('error');
   /// res.locals.user = req.user || null;
    next();
});


// Routes
app.use(indexRoutes); // Usar las rutas importadas
app.use(notesRoutes);
app.use(usersRoutes);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listenning
app.listen(app.get('port'), () => {
    console.log(`Server is listening http://localhost:${app.get('port')}`);
});
