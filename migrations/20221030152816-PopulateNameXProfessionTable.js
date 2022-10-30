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
    INSERT INTO name_x_profession (name_id, profession_id)
    SELECT DISTINCT nameBasics.nconst as name_id, dict_profession.id as profession_id FROM nameBasics
    INNER JOIN dict_profession ON find_in_set(dict_profession.profession, nameBasics.primaryProfession);
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
