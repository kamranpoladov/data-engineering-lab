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
    CREATE TABLE name_x_title_x_role (
      name_x_title_id INT NOT NULL,
      role_id INT NOT NULL,
      PRIMARY KEY (name_x_title_id, role_id),
      FOREIGN KEY (name_x_title_id) REFERENCES name_x_title(id),
      FOREIGN KEY (role_id) REFERENCES dict_role(id)
    );
    `,
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('name_x_title_x_role', cb);
};

exports._meta = {
  version: 1
};
