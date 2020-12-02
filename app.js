const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Requiring user route
const userRoutes = require('./routes/users');

//Requiring user model
const User = require('./models/usermodel');

//dotenv.config({path : './config.env'});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9lvpb.mongodb.net/authentication?retryWrites=true&w=majority`, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then(() => {
    console.log('Database Connected');
}).catch(err => console.log(err));

//middleware for session
app.use(session({
    secret : 'Just a simple login/sign up application.',
    resave : true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({usernameField : 'email'}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware flash messages
app.use(flash());

//setting middlware globally
app.use((req, res, next)=> {
    res.locals.success_msg = req.flash(('success_msg'));
    res.locals.error_msg = req.flash(('error_msg'));
    res.locals.error = req.flash(('error'));
    res.locals.currentUser = req.user;
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(userRoutes);


const port = process.env.PORT;
app.listen(port, ()=> {
    console.log(`Server is started at port ${port}`);
});