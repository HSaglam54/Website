const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const contentFile = path.join(__dirname, 'data', 'content.json');

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

// FUNKTIONEN für Content Management
function loadContent() {
    try {
        if (fs.existsSync(contentFile)) {
            return JSON.parse(fs.readFileSync(contentFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading content:', error);
    }
    return getDefaultContent();
}

function getDefaultContent() {
    return {
        hero: {
            title: "PERFEKTES KLIMA FÜR IHR ZUHAUSE",
            subtitle: "Moderne Klimatechnik vom Experten - für optimalen Komfort in jedem Raum.",
            buttonText: "Jetzt beraten lassen"
        },
        services: {
            title: "Unsere Leistungen",
            items: [
                {
                    icon: "🌡️",
                    title: "Beratung",
                    description: "Individuelle Beratung für die optimale Klimatechnik in Ihren Räumen"
                },
                {
                    icon: "📐",
                    title: "Planung",
                    description: "Professionelle Planung Ihrer Klimaanlage mit modernster Technik"
                },
                {
                    icon: "🔧",
                    title: "Montage",
                    description: "Fachgerechte Installation durch zertifizierte Techniker"
                },
                {
                    icon: "🛠️",
                    title: "Service & Wartung",
                    description: "Regelmäßige Wartung für dauerhaft optimale Leistung"
                }
            ]
        },
        contact: {
            phone: "+43 1 234 567-8",
            email: "info@tvg.at",
            address: "Musterstraße 1, 1010 Wien"
        }
    };
}

// Homepage Route
app.get('/', (req, res) => {
    const content = loadContent();
    res.render('index', { 
        title: 'TVG Klimatechnik - Perfektes Klima seit über 50 Jahren',
        currentYear: new Date().getFullYear(),
        content: content
    });
});

// Kontakt-Route
app.get('/kontakt', (req, res) => {
    const content = loadContent();
    res.render('kontakt', {
        title: 'Kontakt - TVG Klimatechnik',
        currentYear: new Date().getFullYear(),
        content: content
    });
});

// Admin Login GET
app.get('/admin/login', (req, res) => {
    res.render('admin/login', {
        title: 'Admin Login - TVG Klimatechnik'
    });
});

// Admin Login POST
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'tvg2025') {
        req.session.user = { username: 'admin', role: 'admin' };
        res.redirect('/admin');
    } else {
        res.render('admin/login', { 
            error: 'Ungültige Anmeldedaten',
            title: 'Admin Login - TVG Klimatechnik'
        });
    }
});

// Admin Dashboard
app.get('/admin', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin/login');
    }
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard - TVG Klimatechnik',
        user: req.session.user 
    });
});

// Admin Editor
app.get('/admin/editor', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/admin/login');
    }
    const content = loadContent();
    res.render('admin/editor', { 
        title: 'Website bearbeiten - TVG Admin',
        user: req.session.user,
        content: content
    });
});

// Save Content
app.post('/admin/save-content', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.json({ success: false, error: 'Nicht autorisiert' });
    }
    
    try {
        // Erstelle data Ordner falls nicht vorhanden
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }
        
        // Speichere Inhalte
        fs.writeFileSync(contentFile, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// Admin Logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Impressum Route
app.get('/impressum', (req, res) => {
    res.render('impressum', {
        title: 'Impressum - TVG Klimatechnik',
        currentYear: new Date().getFullYear()
    });
});

// Datenschutz Route
app.get('/datenschutz', (req, res) => {
    res.render('datenschutz', {
        title: 'Datenschutz - TVG Klimatechnik',
        currentYear: new Date().getFullYear()
    });
});

// 404 Handler - MUSS AM ENDE SEIN!
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Seite nicht gefunden - TVG Klimatechnik',
        currentYear: new Date().getFullYear()
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════╗
    ║   TVG Klimatechnik Server gestartet   ║
    ║                                       ║
    ║   🌐 http://localhost:${PORT}            ║
    ║   🔐 Admin: /admin/login              ║
    ║                                       ║
    ║   Klimatechnik der KOR Gruppe         ║
    ╚═══════════════════════════════════════╝
    `);
});

module.exports = app;