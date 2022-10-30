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
  INSERT INTO dict_profession (profession) 
  SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(nameBasics.primaryProfession, ',', 1), ',', -1) primaryProfession FROM nameBasics;
  DELETE FROM dict_profession WHERE profession = '';
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
