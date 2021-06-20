
const config = require('../config');

{
  "development": {
    "username": config.dbUser,
    "password": config.dbPassword,
    "database": config.dbCluster,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": config.dbUser,
    "password": config.dbPassword,
    "database": config.dbCluster,
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": config.dbUser,
    "password": config.dbPassword,
    "database": config.dbCluster,
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
