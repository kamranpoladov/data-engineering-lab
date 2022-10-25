'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, cb) {
  db.runSql(
    `
    CREATE TABLE dict_profession (
      id int PRIMARY KEY AUTO_INCREMENT NOT NULL,
      profession varchar(255) NOT NULL
    );
  `,
    cb
  );
};

exports.down = function(db, cb) {
  db.dropTable('dict_profession', cb);
};

exports._meta = {
  "version": 1
};
