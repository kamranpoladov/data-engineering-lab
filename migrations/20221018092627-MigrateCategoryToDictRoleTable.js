'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, cb) {
  db.runSql(
    'INSERT INTO dict_role (name) SELECT DISTINCT category FROM titlePrincipals;',
    cb
  );
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1
};
