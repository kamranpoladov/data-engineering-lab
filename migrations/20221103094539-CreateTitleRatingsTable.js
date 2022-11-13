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
    CREATE TABLE title_ratings (
      title_id INT NOT NULL,
      average_rating DECIMAL(2, 1) NOT NULL,
      votes INT NOT NULL,
      PRIMARY KEY (title_id),
      FOREIGN KEY (title_id) REFERENCES title(id)
    );
  `,
    cb
  );
};

exports.down = function (db, cb) {
  db.dropTable('title_ratings', cb);
};

exports._meta = {
  version: 1
};
