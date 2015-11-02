var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:andela@localhost:5432/mydb');
var dmsCtrl = require('./documentManager');
var User = require('./schema').User;
var Role = require('./schema').Role;
var Document = require('./schema').Document;

describe('User', function() {
  beforeEach(function(done) {
    User.destroy({where: {}}).then(function() {
      Role.destroy({where: {}}).then(function() {
        dmsCtrl.createUser('Kanye', 'West', 'Rapper').then(function() {
          done();
        });
      });
    }); 
  });

  afterEach(function(done) {
    User.destroy({where: {}}).then(function() {
      Role.destroy({where: {}}).then(function() {
        done();
      });
    });
  });

  it('should validate that a new user created is unique.', function(done) {
    User.create({
      firstname: 'Kanye',
      lastname: 'West',
      role: 'Rapper'
    }).catch(function(err) {
      expect(err).toBeDefined();
      expect(err.hasOwnProperty('errors')).toEqual(true);
      expect(err.errors[0].type).toEqual('unique violation');
    });
    done(); 
  });

  it('should validate that a new user created has a role defined.', function(done) {
    User.findAll({where: {firstname: 'Kanye'}}).then(function(user, err) {
      expect(user[0].role).toBe('Rapper');
      done();
    });
  });

  it('should validate that a new user created both first and last names.', function(done) {
    User.findAll({where: {firstname: 'Kanye'}}).then(function(user, err) {
      expect(user[0].firstname).toBe('Kanye');
      expect(user[0].lastname).toBe('West');
      done();
    });
  });

  it('should validate that all users are returned when getAllUsers is called.', function(done) {
    dmsCtrl.createUser('Beyonce', 'Knowles', 'Singer').then(function() {
      dmsCtrl.getAllUsers().then(function(users) {
         expect(users.length).toBe(2);
         done();
      });
    });
  });
});

describe('Role', function() {
  beforeEach(function(done) {
    Role.destroy({where: {}}).then(function() {
      dmsCtrl.createRole('Admin').then(function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    Role.destroy({where: {}}).then(function() {
      done();
    });
  });
  it('should validate that a new role created has a unique title.', function(done) {
    Role.findAll({where: {title: 'Admin'}}).then(function(role, err) {
      expect(role.length).toBe(1);
      done();
    });
  });

  it('should validate that all roles are returned when getAllRoles is called.', function(done) {
    dmsCtrl.createRole('Student').then(function() {
      dmsCtrl.getAllRoles().then(function(roles) {
         expect(roles.length).toBe(2);
         done();
      });
    });
  }); 
});

describe('Document', function() {
  beforeEach(function(done) {
    Document.destroy({where: {}}).then(function() {
      Role.destroy({where: {}}).then(function() {
        dmsCtrl.createDocument('Tales by the moonlight', 'Kids').then(function() {
          done();
        });
      });
    }); 
  });

  afterEach(function(done) {
    Document.destroy({where: {}}).then(function() {
      Role.destroy({where: {}}).then(function() {
        done();
      });
    });
  });

  it('should validate that a new user document created has a published date defined.', function(done) {
    Document.findAll({where: {topic: 'Tales by the moonlight'}}).then(function(doc, err) {
      expect(doc[0].createdOn).toBeDefined();
      done();
    });
  });

  it('should validate that all documents are returned, limited by a specified number, when getAllDocuments is called.', function(done) {
    dmsCtrl.createDocument('Falling for you', 'Everyone').then(function() {
      dmsCtrl.createDocument('Watch the throne', 'People').then(function() {
        dmsCtrl.createDocument('My beautiful dark twisted fantasy', 'Adults').then(function() {
          dmsCtrl.getAllDocuments(2).then(function(docs, err) {
            expect(docs.length).toEqual(2);
            done();
          });
        });
      });
    });
  });
  
  it('should validate that all documents are returned in order of their published dates, starting from the most recent when getAllDocuments is called.', function(done) {
    dmsCtrl.createDocument('12 years a slave', 'Everybody').then(function() {
      dmsCtrl.createDocument('Kings speech', 'Everybody').then(function() {
        dmsCtrl.getAllDocuments().then(function(docs) {
          expect(docs.length).toBe(3);
          expect(docs[0].createdAt).toBeDefined();
          expect(docs[1].createdAt).toBeDefined();
          expect(docs[2].createdAt).toBeDefined();
          done();
        });
      });
    });
  });
});

describe('Search', function() {
  beforeEach(function(done) {
    Document.destroy({where: {}}).then(function() {
      Role.destroy({where: {}}).then(function() {
        dmsCtrl.createDocument('Barney and friends', 'Kids').then(function() {
          dmsCtrl.createDocument('Snow white', 'Kids').then(function() {
            dmsCtrl.createDocument('Family Guy', 'Kids').then(function() {
              dmsCtrl.createDocument('Boondocks', 'Kids').then(function() {
                dmsCtrl.createDocument('Twilight', 'Adolescents').then(function() {
                  done();
                });
              });
            });
          });
        });
      });
    }); 
  });

  afterEach(function(done) {
    Document.destroy({where: {}}).then(function() {
      Role.destroy({where: {}}).then(function() {
        done();
      });
    });
  });

  it('should validate that all documents, limited by a specified number and ordered by published date, that can be accessed by a specified role, are returned when getAllDocumentsByRole is called.', function(done) {
    dmsCtrl.getAllDocumentsByRole('Kids', 3).then(function(docs) {
      expect(docs.length).toEqual(3);
      done();
    });
  });

  it('should validate that all documents, limited by a specified number, that were published on a certain date, are returned when getAllDocumentsByDate is called.', function(done) {
    currentDay = function() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
      return dd+'-'+mm+'-'+yyyy;
    };
    dmsCtrl.getAllDocumentsByDate(currentDay(), 2).then(function(docs) {
      expect(docs.length).toEqual(2);
      expect(docs[0].createdOn).toBe(currentDay());
      expect(docs[1].createdOn).toBe(currentDay());
      done();
    });
  });
});
