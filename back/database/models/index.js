'use strict';

const config = require('../../config');
const Sequelize = require('sequelize');
const initModels = require("./init-models");

// Connection
let sequelize = new Sequelize(config.dbCluster, config.dbUser, config.dbPassword, {
  host: 'localhost',
  dialect: 'mysql'
});

// Chargement des modèles des tables
const db = initModels(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
