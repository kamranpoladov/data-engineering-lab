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
  CREATE TABLE name_x_profession (
    name_id INT NOT NULL,
    profession_id INT NOT NULL,
    PRIMARY KEY (name_id, profession_id),
    FOREIGN KEY (name_id) REFERENCES name(id),
    FOREIGN KEY (profession_id) REFERENCES dict_profession(id)
  );
  `,
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('name_x_profession', cb);
};

exports._meta = {
  version: 1
};
