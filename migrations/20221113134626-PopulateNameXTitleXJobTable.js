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
    INSERT INTO name_x_title_x_job (name_x_title_id, job)
    SELECT name_x_title.id, titlePrincipals.job FROM a23dasc507.titlePrincipals
    INNER JOIN name_x_title ON titlePrincipals.tconst = name_x_title.title_id AND titlePrincipals.nconst = name_x_title.name_id 
    WHERE job IS NOT NULL;
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
