const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/Users');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user){
        return done(null, false, {message : 'Not user found. '});
    }else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
}));

passport.serializeUser((user,done)=>{
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Usa `await` para esperar la resolución
        done(null, user); // Si todo está bien, pasa el usuario al callback `done`
    } catch (err) {
        done(err, null); // Maneja errores correctamente
    }
});