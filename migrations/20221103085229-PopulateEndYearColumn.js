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
    UPDATE title, title_x_end_year 
    SET title.end_year = title_x_end_year.end_year
    WHERE title.id = title_x_end_year.title_id;
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
