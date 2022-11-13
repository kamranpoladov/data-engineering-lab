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
    DELETE FROM titlePrincipals WHERE nconst NOT IN (SELECT id FROM name);
    DELETE FROM titlePrincipals WHERE tconst NOT IN (SELECT id FROM title);
    INSERT INTO name_x_title (name_id, title_id, ordering)
    SELECT nconst, tconst, ordering FROM titlePrincipals;
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
