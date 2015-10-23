var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:andela@localhost:5432/mydb');

module.exports =  {
  User: sequelize.define('User', {
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }),
  Role: sequelize.define('Role', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    }
  }),
  Document: sequelize.define('Document', {
    topic: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    accessibleTo: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdOn: {
      type: Sequelize.STRING,
      allowNull: false
    }
  })
};
