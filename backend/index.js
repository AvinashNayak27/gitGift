const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();

// Use session to keep track of login state
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
(accessToken, refreshToken, profile, done) => {
   profile.accessToken = accessToken;
    return done(null, profile);
}));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // Redirect to the frontend with the access token as a query parameter
        res.redirect(`http://localhost:5173/success?token=${req.user.accessToken}`);
    }
);


app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
