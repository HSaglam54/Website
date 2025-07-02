const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

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