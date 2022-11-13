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
  db.addIndex(
    'title',
    'idx_title_primary_title_original_title_release_year',
    ['primary_title', 'original_title', 'release_year'],
    cb
  );
};

exports.down = function (db, cb) {
  db.removeIndex(
    'name',
    'idx_title_primary_title_original_title_release_year',
    cb
  );
};

exports._meta = {
  version: 1
};
