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
  INSERT INTO dict_genre (genre) 
  SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(titleBasics.genres, ',', 1), ',', -1) genres FROM titleBasics WHERE genres IS NOT NULL;
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
