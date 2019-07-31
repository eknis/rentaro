const taskLib = require('../../lib/task');
const utilLib = require('../../lib/util');

module.exports = {
  task: (bot, msg, controller, apis) => {
    let mentions = Array.from(new Set(msg.match[1].split(' ')));
    let title   = msg.match[2];
    let txt     = msg.match[3];
    let limit     = msg.match[4];
    var userIds = [];
    mentions.forEach((mention) => {
      userIds.push(utilLib.getUserIdFromMention(mention))
    })

    taskLib.taskAssign(bot, msg, controller, apis, title, userIds, txt, limit);
  },

  taskdone: (bot, msg, controller) => {
    let taskId = msg.match[1];
    controller.storage.users.get(msg.user, function(err, user_data) {
      controller.storage.teams.get(msg.team, function(err, teamData) {
        if (!teamData.tasks[taskId]) {
          bot.replyInThread(msg, 'taskIdが存在しません');
          return;
        }
        let fromId = teamData.tasks[taskId].from;
        let isSelf = msg.user == fromId;
        let isExistTask = false;
        controller.storage.users.get(fromId, function(err, fromData) {
          //update msgUser
          if (isSelf) {
            fromData.tasks.some(function(v, i){
              if (v == taskId) {
                fromData.tasks.splice(i,1);
                isExistTask = true;
              }
            });
          } else {
            user_data.tasks.some(function(v, i){
              if (v == taskId) {
                user_data.tasks.splice(i,1);
                isExistTask = true;
              }
            });
            controller.storage.users.save({
              id: msg.user,
              assignMax: user_data.assignMax,
              taskAssigns: user_data.taskAssigns,
              tasks: user_data.tasks
            }, function(err) {
              console.log(err)
            });
          }
          if(!isExistTask) {
            bot.replyInThread(msg, '完了するtaskが見つかりませんでした。');
            return;
          }
          teamData.tasks[taskId].members.some(function(v, i){
            if (v == msg.user) {
              teamData.tasks[taskId].members.splice(i,1);
            }
          });
          if(teamData.tasks[taskId].members.length == 0) {
            let completedTask = teamData.tasks[taskId];
            //update fromUser isComplete
            fromData.taskAssigns.some(function(v, i){
              if (v == taskId) {
                fromData.taskAssigns.splice(i,1);
              }
            });
            delete teamData.tasks[taskId];
            controller.storage.teams.save({
              id: msg.team,
              users: teamData.users,
              tasks: teamData.tasks
            }, function(err) {
              console.log('delete teamtasks');
              console.log(err)
            });
            bot.reply(msg,
              {
                text: '<@' + fromId + '>' + '依頼taskが完了しました',
                'attachments': [
                  {
                    'title': completedTask.title,
                    'text': '*taskID* ' + taskId + '\n' + completedTask.txt,
                    'color': '#7CD197'
                  }
                ]
              }
            );
          } else {
            controller.storage.teams.save({
              id: msg.team,
              users: teamData.users,
              tasks: teamData.tasks
            }, function(err) {
              console.log(err)
            });
          }
          controller.storage.users.save({
            id: fromId,
            assignMax: fromData.assignMax,
            taskAssigns: fromData.taskAssigns,
            tasks: fromData.tasks
          }, function(err) {
            console.log('update user storage');
            console.log(err)
          });
          bot.replyInThread(msg, 'taskを完了しました');
        });
      })
    });
  },

  tasklist: (bot, msg, controller) => {
    let user = msg.match.length > 1 ? utilLib.getUserIdFromMention(msg.match[1]) : msg.user;
    controller.storage.users.get(user, function(err, user_data) {
      if (!user_data || !user_data.tasks.length) {
        bot.whisper(msg, 'タスクはありません。Have a good day!')
      } else {
        controller.storage.teams.get(
          msg.team,
          function(err, team_data) {
          if(!team_data) {
            //TODO new team()
            team_data = {
              id: msg.team,
              users: {},
              tasks: {}
            }
          }

          let taskList = user_data.tasks.map(taskId => {
            return {
              'title': team_data.tasks[taskId].title,
              'text': '*taskID* ' + taskId
                      + '\n*アサイン者* ' + '<@' + team_data.tasks[taskId].from + '>'
                      + '\n*期限* ' + (team_data.tasks[taskId].limit ? team_data.tasks[taskId].limit : '無し')
                      + '\n' + team_data.tasks[taskId].txt,
              'color': '#7CD197'
            }
          });
          bot.whisper(
            msg,
            {
              'text': `<@${user}>のタスクは${user_data.tasks.length}件です` ,
              'attachments': taskList
            }
          )
        }, function(err) {
          if(err)console.log(err);
        });
      }
    }, function(err) {
      if(err)console.log(err);
    })
  },

  taskwithdraw: (bot, msg, controller) => {
    //TODO
  },

  taskassigns: (bot, msg, controller) => {
    controller.storage.users.get(msg.user, function(err, user_data) {
      if (!user_data || !user_data.taskAssigns.length) {
        bot.whisper(msg, 'アサインしているタスクはありません。Have a good day!')
      } else {
        controller.storage.teams.get(
          msg.team,
          function(err, team_data) {
          if(!team_data) {
            //TODO new team()
            team_data = {
              id: msg.team,
              users: {},
              tasks: {}
            }
          }

          let taskList = user_data.taskAssigns.map(taskId => {
            let mentions = team_data.tasks[taskId].members.map(function(user) { 
              return '<@' + user + '>'
            });
            return {
              'title': team_data.tasks[taskId].title,
              'text': '*taskID* ' + taskId
                      + '\n*アサイン先* ' + mentions
                      + '\n*期限* ' + (team_data.tasks[taskId].limit ? team_data.tasks[taskId].limit : '無し')
                      + '\n' + team_data.tasks[taskId].txt,
              'color': '#7CD197'
            }
          })
          bot.whisper(
            msg,
            {
              'text': `アサイン中タスクは${user_data.taskAssigns.length}件です` ,
              'attachments': taskList
            }
          )
        }, function(err) {
          if(err)console.log(err);
        });
      }
    }, function(err) {
      if(err)console.log(err);
    })
  },

  taskRequest: (bot, msg, controller, apis) => {
    var sayTitle = '';
    var sayAssigns = '';
    var saySummary = '';
    var sayLimit = '';

    var askTitle = function(err, convo) {
      convo.ask('タイトルは？', function(response, convo) {
        sayTitle = response.text;
        askSummary(response, convo);
        convo.next();
      });
    };
    var askSummary = function(response, convo) {
      convo.ask('内容は？', function(response, convo) {
        saySummary = response.text;
        askLimit(response, convo);
        convo.next();
      });
    };
    var askLimit = function(response, convo) {
      convo.ask('期限は？', function(response, convo) {
        sayLimit = response.text;
        askAssigns(response, convo);
        convo.next();
      });
    };
    var askAssigns = function(response, convo) {
      convo.ask('誰にアサインする？', function(response, convo) {
        sayAssigns = response.text;
        askOK(response, convo);
        convo.next();
      });
    };
    var askOK = function(response, convo) {
      convo.ask(
        {
          "text": "確認してや。問題なかったらy、やめとく場合はn",
          "attachments": [
            {
              "fields": [
                {
                  "title": "タイトル",
                  "value": sayTitle,
                  "short": false
                },
                {
                  "title": "アサイン",
                  "value": sayAssigns,
                  "short": false
                },
                {
                  "title": "説明",
                  "value": saySummary,
                  "short": false
                },
                {
                  "title": "期限",
                  "value": sayLimit,
                  "short": true
                }
              ],
              "color": "#3AA3E3",
              "attachment_type": "default"
            }
          ]
        },
        [
          {
            pattern: "y",
            callback: function(reply, convo) {
              delete msg.thread_ts;
              let mentions = Array.from(new Set(sayAssigns.split(' ')));
              var userIds = [];
              mentions.forEach((mention) => {
                userIds.push(utilLib.getUserIdFromMention(mention))
              })
              taskLib.taskAssign(bot, msg, controller, apis, sayTitle, userIds, saySummary, sayLimit)
              convo.next();
            }
          },
          {
            pattern: "n",
            callback: function(reply, convo) {
              convo.say('キャンセルしました。間違えたらもう一回やり直すんやで');
              convo.next();
            }
          },
          {
            default: true,
            callback: function(reply, convo) {
              convo.say('何言うてんねん');
            }
          }
        ]
      );
    };
    bot.startConversationInThread(msg, askTitle);
  }
};
