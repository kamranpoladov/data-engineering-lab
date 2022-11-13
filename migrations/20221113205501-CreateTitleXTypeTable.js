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
  CREATE TABLE title_x_type (
    title_id INT NOT NULL,
    type_id INT NOT NULL,
    PRIMARY KEY (title_id, type_id),
    FOREIGN KEY (title_id) REFERENCES title(id),
    FOREIGN KEY (type_id) REFERENCES dict_type(id)
  );
  `,
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('title_x_type', cb);
};

exports._meta = {
  version: 1
};
