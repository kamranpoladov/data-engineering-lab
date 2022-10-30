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
    DELETE FROM titleAkas WHERE titleAkas.titleId NOT IN (SELECT tconst FROM titleBasics);
    INSERT INTO title_x_region (title_id, region_id)
    SELECT DISTINCT titleAkas.titleId as title_id, dict_region.id as region_id FROM titleAkas
    INNER JOIN dict_region ON titleAkas.region = dict_region.code;
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
