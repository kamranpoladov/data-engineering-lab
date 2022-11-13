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
  INSERT INTO title_x_attribute (title_id, attribute_id)
  SELECT DISTINCT titleAkas.titleId as title_id, dict_attribute.id as attribute_id FROM titleAkas
  INNER JOIN dict_attribute ON titleAkas.attributes = dict_attribute.attribute;
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
