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
    'title',
    {
      id: { type: 'string', primaryKey: true, unique: true, notNull: true },
      primary_title: 'string',
      original_title: 'string',
      average_rating: 'decimal',
      votes: 'int'
    },
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('title', callback);
};

exports._meta = {
  version: 1
};
