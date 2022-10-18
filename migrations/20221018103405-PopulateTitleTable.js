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
  INSERT INTO title (id, primary_title, original_title, type) SELECT tconst, primaryTitle, originalTitle, titleType FROM titleBasics;
  UPDATE title, titleRatings 
  SET title.average_rating = titleRatings.averageRating, title.votes = titleRatings.numVotes
  WHERE title.id = titleRatings.tconst;
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
