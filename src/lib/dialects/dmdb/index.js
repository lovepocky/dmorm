'use strict';

const _ = require('lodash');
const AbstractDialect = require('../abstract');
const ConnectionManager = require('./connection-manager');
const Query = require('./query');
const QueryGenerator = require('./query-generator');
const DataTypes = require('../../data-types').dmdb;
const { DmDBQueryInterface } = require('./query-interface');

class DmdbDialect extends AbstractDialect {
  constructor(sequelize) {
    super();
    this.sequelize = sequelize;
    this.connectionManager = new ConnectionManager(this, sequelize);
    this.queryGenerator = new QueryGenerator({
      _dialect: this,
      sequelize
    });
    this.queryInterface = new DmDBQueryInterface(sequelize, this.queryGenerator);
  }
}

DmdbDialect.prototype.supports = _.merge(_.cloneDeep(AbstractDialect.prototype.supports), {
  'VALUES ()': true,
  'LIMIT ON UPDATE': true,
  lock: true,
  forShare: 'LOCK IN SHARE MODE',
  settingIsolationLevelDuringTransaction: false,
  autoIncrement: { identityInsert: false, defaultValue: false, update: true },
  inserts: {
    ignoreDuplicates: ' IGNORE',
    updateOnDuplicate: ' ON DUPLICATE KEY UPDATE'
  },
  index: {
    collate: false,
    length: true,
    parser: true,
    type: true,
    using: 1
  },
  constraints: {
    dropConstraint: false,
    check: false
  },
  indexViaAlter: true,
  indexHints: true,
  NUMERIC: true,
  GEOMETRY: true,
  JSON: true,
  REGEXP: true
});

DmdbDialect.prototype.defaultVersion = '';
DmdbDialect.prototype.Query = Query;
DmdbDialect.prototype.QueryGenerator = QueryGenerator;
DmdbDialect.prototype.DataTypes = DataTypes;
DmdbDialect.prototype.name = 'dmdb';
DmdbDialect.prototype.TICK_CHAR = '';
DmdbDialect.prototype.TICK_CHAR_LEFT = DmdbDialect.prototype.TICK_CHAR;
DmdbDialect.prototype.TICK_CHAR_RIGHT = DmdbDialect.prototype.TICK_CHAR;

module.exports = DmdbDialect;
