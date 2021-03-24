'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Todolist = loader.database.define(
  'todolist',
  {
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    task: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    isdone: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Todolist;
