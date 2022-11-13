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
    RENAME TABLE nameBasics TO ZZZnameBasicsOld;
    RENAME TABLE titleAkas TO ZZZtitleAkasOld;
    RENAME TABLE titlePrincipals TO ZZZtitlePrincipalsOld;
    RENAME TABLE titleBasics TO ZZZtitleBasicsOld;
    RENAME TABLE titleRatings TO ZZZtitleRatingsOld;
  `,
    cb
  );
};

exports.down = function (db, cb) {
  db.runSql(
    `
  RENAME TABLE ZZZnameBasicsOld TO nameBasics;
  RENAME TABLE ZZZtitleAkasOld TO titleAkas;
  RENAME TABLE ZZZtitlePrincipalsOld TO titlePrincipals;
  RENAME TABLE ZZZtitleBasicsOld TO titleBasics;
  RENAME TABLE ZZZtitleRatingsOld TO titleRatings;
  `,
    cb
  );
};

exports._meta = {
  version: 1
};
