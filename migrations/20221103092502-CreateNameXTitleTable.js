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
    CREATE TABLE name_x_title (
      id INT NOT NULL AUTO_INCREMENT,
      name_id INT NOT NULL,
      title_id INT NOT NULL,
      ordering INT NOT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (title_id) REFERENCES title(id),
      FOREIGN KEY (name_id) REFERENCES name(id)
    );
  `,
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('name_x_title', cb);
};

exports._meta = {
  version: 1
};
