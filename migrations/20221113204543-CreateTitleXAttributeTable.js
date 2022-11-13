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
  CREATE TABLE title_x_attribute (
    title_id INT NOT NULL,
    attribute_id INT NOT NULL,
    PRIMARY KEY (title_id, attribute_id),
    FOREIGN KEY (title_id) REFERENCES title(id),
    FOREIGN KEY (attribute_id) REFERENCES dict_attribute(id)
  );
  `,
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('title_x_attribute', cb);
};

exports._meta = {
  version: 1
};
