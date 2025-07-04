const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Session Middleware
app.use(session({
    secret: 'tvg-secret-key-2025',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Body Parser für POST Requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'TVG Klimatechnik - Perfektes Klima für Ihr Zuhause',
        currentYear: new Date().getFullYear()
    });
});

// Kontakt-Route
app.get('/kontakt', (req, res) => {
    res.render('kontakt');
});

// Admin Routes - HIER VOR DEM 404 HANDLER!
app.get('/admin/login', (req, res) => {
    res.render('admin/login');
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'tvg2025') {
        req.session.user = { username: 'admin', role: 'admin' };
        res.redirect('/admin');
    } else {
        res.render('admin/login', { error: 'Ungültige Anmeldedaten' });
    }
});

app.get('/admin', (req, res) => {
    // Prüfen ob eingeloggt
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin/login');
    }
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard',
        user: req.session.user 
    });
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// 404 Handler - MUSS AM ENDE SEIN!
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Seite nicht gefunden - TVG Klimatechnik' 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`TVG Klimatechnik Server läuft auf Port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

module.exports = app;