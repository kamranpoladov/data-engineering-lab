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
    INSERT INTO title_x_language (title_id, language_id)
    SELECT DISTINCT titleAkas.titleId as title_id, dict_language.id as language_id FROM titleAkas
    INNER JOIN dict_language ON titleAkas.language = dict_language.code;
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
