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

exports.up = function (db, callback) {
  db.createTable(
    'name',
    {
      id: {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        notNull: true
      },
      name: 'string',
      birth_year: 'int',
      death_year: 'int'
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('name', callback);
};

exports._meta = {
  version: 1
};
