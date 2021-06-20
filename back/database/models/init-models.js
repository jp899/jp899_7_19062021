var DataTypes = require("sequelize").DataTypes;
var _Articles = require("./Articles");
var _Comments = require("./Comments");
var _Likes = require("./Likes");
var _Users = require("./Users");

function initModels(sequelize) {
  var Articles = _Articles(sequelize, DataTypes);
  var Comments = _Comments(sequelize, DataTypes);
  var Likes = _Likes(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Comments.belongsTo(Articles, { as: "article", foreignKey: "articleId"});
  Articles.hasMany(Comments, { as: "Comments", foreignKey: "articleId"});
  Likes.belongsTo(Articles, { as: "article", foreignKey: "articleId"});
  Articles.hasMany(Likes, { as: "Likes", foreignKey: "articleId"});
  Articles.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Articles, { as: "Articles", foreignKey: "userId"});
  Comments.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Comments, { as: "Comments", foreignKey: "userId"});
  Likes.belongsTo(Users, { as: "user", foreignKey: "userId"});
  Users.hasMany(Likes, { as: "Likes", foreignKey: "userId"});

  return {
    Articles,
    Comments,
    Likes,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
