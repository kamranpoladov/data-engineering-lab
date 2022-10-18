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
  db.createTable(
    'dict_region',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        notNull: true
      },
      code: {
        type: 'string',
        unique: true,
        notNull: true
      }
    },
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('dict_region', cb);
};

exports._meta = {
  version: 1
};
