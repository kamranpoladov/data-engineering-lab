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
    INSERT INTO title_x_genre (title_id, genre_id)
    SELECT DISTINCT titleBasics.tconst as title_id, dict_genre.id as genre_id FROM titleBasics
    INNER JOIN dict_genre ON find_in_set(dict_genre.genre, titleBasics.genres);
  `,
    cb
  );
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1
};
