var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:andela@localhost:5432/mydb');
var User = require('./schema').User;
var Role = require('./schema').Role;
var Document = require('./schema').Document;

// syncs models with the database
User.sequelize.sync().then();
Role.sequelize.sync().then();
Document.sequelize.sync().then();

// this method creates a new user
// NB: the 'position' parameter is the user role
exports.createUser = function(first, last, position) {
  return Role.findOrCreate({where: {title: position}})
  .then(function(role) {
    return role;
  }).then (function(res, err) {
    return User.create({
      firstname: first,
      lastname: last,
      role: position
    })
    .then(function(user, err) {
      if (user) {
        return user;
      }
      else {
        throw err;
      }      
    });
  });
};

// this method returns all users
exports.getAllUsers = function() {
  return User.findAll().then(function(users) {
    return users;
  });
};

// this method creates a new role
exports.createRole = function(title) {
  return Role.create({title: title}).then(function(role) {
    return role;
  });
};

// this method return all roles
exports.getAllRoles = function() {
  return Role.findAll().then(function(roles) {
    return roles;
  });
};

// this function return the date, used by createDocument()
currentDay = function() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  return dd+'-'+mm+'-'+yyyy;
};

// this method creates a new document
// NB: the 'position' parameter is the user role
exports.createDocument = function(title, position) {
  return Role.findOrCreate({where: {title: position}}).then(function(role) {
    return role;
  }).then(function(res, err) {
    return Document.create({
      topic: title,
      accessibleTo: position,
      createdOn: currentDay()
    })
    .then(function(doc) {
      return doc;
    });
  });
};

// this method returns all docuemnts
exports.getAllDocuments = function(limit) {
  return Document.findAll({
    order: '"createdAt" DESC',
    limit: limit
  })
  .then(function(docs) {
    return docs;
  });
};

// this method returns all document accessible to a role according to the date of creation
exports.getAllDocumentsByRole = function(role, limit) {
  return Document.findAll({
    where: {accessibleTo: role},
    order: '"createdAt" DESC',
    limit: limit
  })
  .then(function(docs) {
    return docs;
  });
};

// this method returns documents created on a particular day
exports.getAllDocumentsByDate = function(date, limit) {
  return Document.findAll({
    where: {createdOn: date},
    limit: limit
  })
  .then(function(docs) {
    return docs;
  });
};
