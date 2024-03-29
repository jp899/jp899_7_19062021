const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      autoIncrement: true,
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "userName"
    },
    passwordHash: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    emailEncrypted: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Users',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "userName",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userName" },
        ]
      },
    ]
  });
};
