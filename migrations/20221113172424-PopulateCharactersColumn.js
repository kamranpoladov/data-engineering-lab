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
  // db.runSql(
  //   `
  // UPDATE name_x_title, titlePrincipals
  // SET name_x_title.characters = REPLACE(
  //   REPLACE(
  //      REPLACE(
  //       titlePrincipals.characters
  //       , '['
  //       , ''
  //     )
  //     , ']'
  //     , ''
  //   )
  //   , '"'
  //   , ''
  // )
  // WHERE name_x_title.name_id = titlePrincipals.nconst AND name_x_title.title_id = titlePrincipals.tconst;
  // `,
  //   cb
  // );
  return null;
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1
};
