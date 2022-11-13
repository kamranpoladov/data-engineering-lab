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
  INSERT INTO title_x_type (title_id, type_id)
  SELECT DISTINCT titleAkas.titleId as title_id, dict_type.id as type_id FROM titleAkas
  INNER JOIN dict_type ON titleAkas.types = dict_type.type;
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
