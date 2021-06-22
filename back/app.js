// Importer le module EXPRESS
const express = require('express');

// module pour protection contre failles dont XSS
const helmet = require("helmet");

// module pour acceder au dossier de notre serveur
const path = require('path');

// Importer les routeurs
const articleRoutes = require('./routes/article');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const logger = require('./logger');

// Importer les paramètres d'environnement
const config = require('./config');

// Créer l'application express
const app = express();

// Connection à la BDD
const db = require('./database/models/');
db.sequelize.authenticate()
.then(() => logger.info('Database connection has been established successfully.'))
.catch((error) => logger.error('Unable to connect to the database:', error));

// const test = require('./testDB');

// Middleware GENERAL de gestion des headers pour le CORS
app.use((req, res, next) => {
    // Permettre des requettes de n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Ajouter les headers listés au requettes renvoyées par notre server
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Définir les types de requettes autorisées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Middleware de protection contre failles dont XSS
app.use(helmet());

// Middleware GENERAL pour parser le body des requettes POST
app.use(express.json());

// Indiquer que le dossier images est un dossier à gérer de manière statique
// et donner l'url a suivre à chaque fois qu'une requette cherche à y acceder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Utiliser le routeur pour toutes les requettes de format /api/auth
app.use('/api/auth', authRoutes);
// Utiliser le routeur pour toutes les requettes de format /api/user
app.use('/api/user', userRoutes);
// Utiliser le routeur pour toutes les requettes de format /api/article
app.use('/api/article', articleRoutes);


// exporter l'application pour y acceder depuis les autres fichiers du projet
module.exports = app;