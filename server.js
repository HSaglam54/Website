const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');

app.use(session({
    secret: 'tvg-secret-key-2025',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
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

// 404 Handler
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
// Admin Routes
app.get('/admin', (req, res) => {
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard',
        user: req.session.user || null 
    });
});

app.get('/admin/login', (req, res) => {
    res.render('admin/login');
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Einfache Admin-Authentifizierung
    if (username === 'admin' && password === 'tvg2025') {
        req.session.user = { username: 'admin', role: 'admin' };
        res.redirect('/admin');
    } else {
        res.render('admin/login', { error: 'Ungültige Anmeldedaten' });
    }
});

app.get('/admin/forms', (req, res) => {
    // Formular-Konfiguration aus JSON laden
    const formConfig = require('./config/forms.json');
    res.render('admin/forms', { 
        title: 'Formulare verwalten',
        forms: formConfig,
        user: req.session.user 
    });
});

app.post('/admin/forms/update', (req, res) => {
    // Formular-Konfiguration speichern
    const fs = require('fs');
    fs.writeFileSync('./config/forms.json', JSON.stringify(req.body, null, 2));
    res.json({ success: true });
});