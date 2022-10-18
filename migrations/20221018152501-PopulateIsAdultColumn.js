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
    UPDATE title, titleBasics
    SET title.is_adult = CASE
      WHEN titleBasics.isAdult = "false" THEN FALSE
      ELSE TRUE
    END 
    WHERE title.id = titleBasics.tconst;
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
