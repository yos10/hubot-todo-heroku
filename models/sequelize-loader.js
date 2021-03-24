'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/hubot_todo',
  {
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
    logging: false
  }
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
