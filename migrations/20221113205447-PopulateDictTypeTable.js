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
    `
    INSERT INTO dict_type (type) SELECT DISTINCT types FROM titleAkas WHERE types IS NOT NULL;
  `,
    cb
  );
};

exports.down = function (db) {
  return null;
};
exports._meta = {
  version: 1
};
