// Description:
//   TODO を管理することができるボットです
// Commands:
//   ボット名 add      - TODO を作成
//   ボット名 done     - TODO を完了にする
//   ボット名 del      - TODO を消す
//   ボット名 list     - TODO の一覧表示
//   ボット名 donelist - 完了した TODO の一覧表示
'use strict';
const Todo = require('../models/todolist');
Todo.sync();

module.exports = (robot) => {
  robot.respond(/add (.+)/i, (msg) => {
    const userId = msg.message.user.id;
    const task = msg.match[1].trim();
    Todo.findOrCreate({
      where: {
        userId: userId,
        task: task,
      },
      defaults: {
        userId: userId,
        task: task,
        isdone: 0,
      },
    }).then(([todo, created]) => {
      if (created) {
        msg.send(`<@${userId}> 追加しました: ${task}`);
      } else if (todo.isdone === 0) {
        msg.send(`<@${userId}> ${task} は完了していません`);
      } else if (todo.isdone === 1) {
        msg.send(`<@${userId}> ${task} は完了しています`);
      }
    });
  });

  robot.respond(/done (.+)/i, (msg) => {
    const userId = msg.message.user.id;
    const task = msg.match[1].trim();
    Todo.findOne({
      where: {
        userId: userId,
        task: task,
        isdone: 0,
      },
    }).then((result) => {
      if (result) {
        result.isdone = 1;
        result.save();
        msg.send(`<@${userId}> 完了しました: ${task}`);
      } else {
        msg.send(`<@${userId}> ${task} という未完了のタスクはありません`);
      }
    });
  });

  robot.respond(/list/i, (msg) => {
    const userId = msg.message.user.id;
    Todo.findAll({
      where: {
        userId: userId,
        isdone: 0,
      },
    }).then((results) => {
      const todolist = results.map((t) => t.task);
      if (todolist.length === 0) {
        msg.send(`<@${userId}> (TODOはありません)`);
      } else {
        msg.send(`<@${userId}> ` + todolist.join('\n'));
      }
    });
  });

  robot.respond(/donelist/i, (msg) => {
    const userId = msg.message.user.id;
    Todo.findAll({
      where: {
        userId: userId,
        isdone: 1,
      },
    }).then((results) => {
      const donelist = results.map((t) => t.task);
      if (donelist.length === 0) {
        msg.send(`<@${userId}> (完了したTODOはありません)`);
      } else {
        msg.send(`<@${userId}> ` + donelist.join('\n'));
      }
    });
  });

  robot.respond(/del (.+)/i, (msg) => {
    const userId = msg.message.user.id;
    const task = msg.match[1].trim();
    Todo.findOne({
      where: {
        userId: userId,
        task: task,
      },
    }).then((result) => {
      if (result) {
        result.destroy();
        msg.send(`<@${userId}> 削除しました: ${task}`);
      } else {
        msg.send(`<@${userId}> ${task} というタスクはありません`);
      }
    });
  });
};
