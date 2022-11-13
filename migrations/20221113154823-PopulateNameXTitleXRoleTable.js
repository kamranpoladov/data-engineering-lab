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
    INSERT INTO name_x_title_x_role (name_x_title_id, role_id)
    SELECT name_x_title.id as name_x_title_id, dict_role.id as role_id FROM titlePrincipals
    INNER JOIN dict_role ON dict_role.name = titlePrincipals.category
    INNER JOIN name_x_title ON name_x_title.name_id = titlePrincipals.nconst AND name_x_title.title_id = titlePrincipals.tconst;
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
