var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:andela@localhost:5432/mydb');
var User = require('./schema').User;
var Role = require('./schema').Role;
var Document = require('./schema').Document;

sequelize.sync().then(function() {
  return [User, Document, Role];
});

User.sequelize.sync().then();
Role.sequelize.sync().then();
Document.sequelize.sync().then();

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
    .then(function(user) {
      return user;
    });
  });
};

exports.getAllUsers = function() {
  return User.findAll().then(function(users) {
    return users;
  });
};

exports.createRole = function(title) {
  return Role.create({title: title}).then(function(role) {
    return role;
  });
};

exports.getAllRoles = function() {
  return Role.findAll().then(function(roles) {
    return roles;
  });
};

currentDay = function() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  return dd+'-'+mm+'-'+yyyy;
};

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

exports.getAllDocuments = function(limit) {
  return Document.findAll({
    order: '"createdAt" DESC',
    limit: limit
  })
  .then(function(docs) {
    return docs;
  });
};

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

exports.getAllDocumentsByDate = function(date, limit) {
  return Document.findAll({
    where: {createdOn: date},
    limit: limit
  })
  .then(function(docs) {
    return docs;
  });
};
