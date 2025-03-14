const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const indexRoutes = require('./routes/index'); // Importar las rutas
const notesRoutes = require('./routes/notes');
const usersRoutes = require('./routes/users');

// Inicializations
const app = express();
require('./database');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Configurar Handlebars como motor de plantillas
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true,
}));

// Global Variables

// Routes
app.use(indexRoutes); // Usar las rutas importadas
app.use(notesRoutes);
app.use(usersRoutes);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listenning
app.listen(app.get('port'), () => {
    console.log(`Server is listenning http://localhost:${app.get('port')}`);
});
