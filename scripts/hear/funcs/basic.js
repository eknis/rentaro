const cmd = require('../../lib/cmd');
const config = require('../../../config');
const requireDir = require('require-dir');
// const hearCommands = Object.values(requireDir('../commands', {noCache: true})).reduce((pre,current) => {pre.push(...current);return pre},[]);
const hearCommands = requireDir('../commands', {noCache: true})

module.exports = {
  help: (bot, msg) => {
    let commands;
    let searchName = msg.match[1];
    if (searchName == 'all') {
      commands = Object.values(hearCommands).reduce((pre,current) => {pre.push(...current);return pre},[]);
    } else {
      commands = hearCommands[msg.match[1]];
    }
    bot.reply(
      msg,
      '<@' + msg.user + '> Hello! ' + `\`\`\`${JSON.stringify(commands, null, '\t')}\`\`\``
    )
  },
  helpall: (bot, msg) => {
    let commands = Object.values(hearCommands).reduce((pre,current) => {pre.push(...current);return pre},[]);
    bot.reply(
      msg,
      '<@' + msg.user + '> Hello! ' + `\`\`\`${JSON.stringify(commands, null, '\t')}\`\`\``
    )
  },
  hello: (bot, msg) => {
    bot.api.users.info({ user: msg.user }, (error, response) => {
      let { name, real_name } = response.user;
      bot.reply(msg, '<@' + msg.user + '> Hello! ' + real_name);
    })
  },
  whereis: (bot, msg) => {
    bot.reply(msg, cmd.run('hostname'));
  },
  savemembers: (bot, msg) => {
    bot.api.conversations.members({ channel: msg.channel }, (error, response) => {

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
        response.members.forEach(function(userId) {
          bot.api.users.info({ user: userId }, (error, respo) => {
            team_data.users[respo.user.name] = {
              name: respo.user.name,
              id: respo.user.id
            }
            controller.storage.teams.save({
              id: msg.team,
              users: team_data.users,
              tasks: {}
            }, function(err) {
              if(err)console.log(err);
            })
          })
        })
      }, function(err) {
        if(err)console.log(err);
      });

      let mentions = response.members.map(function(user) { 
        return '<@' + user + '>' 
      });

      bot.reply(msg, {
        'text': mentions.join(' '),
        'attachments': [
          {
            'title': '',
            'text': 'user情報が設定されました',
            'color': '#7CD197'
          }
        ]
      });
    })
  },
  cmd: (bot, msg) => {
    bot.api.users.info({ user: msg.user }, (error, response) => {
      let { name, real_name } = response.user;
      if (name == config.admin) {
        if (/^rm/.test(msg.match[1])) {
          bot.reply(msg, '削除は怖いからやらん！');
        } else {
          bot.reply(msg, cmd.execute(msg.match[1]));
        }
      } else {
        bot.reply(msg, '<@' + name + '> お前誰や ' + real_name);
      }
    })
  }
};
