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

exports.up = function (db, callback) {
  db.runSql(
    'INSERT INTO name (id, name, birth_year, death_year) SELECT nconst, primaryName, birthyear, deathyear FROM nameBasics;',
    callback
  );
};

exports.down = function (db, callback) {
  return null;
};

exports._meta = {
  version: 1
};
