module.exports = {
  who: (bot, msg) => {
    bot.reply(msg, 'れんたろうだよ！ https://ja.wikipedia.org/wiki/%E7%80%A7%E5%BB%89%E5%A4%AA%E9%83%8E');
  },
  おい: (bot, msg) => {
    bot.reply(msg, 'おい');
  },
  すごい: (bot, msg) => {
    bot.reply(msg, 'せやろ');
  },
  testhearing: (bot, msg, controller, apis) => {
    apis.github.api.users.get({})
      .then(result => {
        apis.backlog.api.getSpace().then(data => {
          let res = JSON.stringify(result.data);
          bot.reply(msg, `\`\`\`githubme: ${res}\n backlogSpace: ${data.name}\`\`\``);
        }).catch(err => {
          console.log('error:', err.message);
        });
      }).catch(function (err) {
        console.error(err);
        bot.reply(msg, err);
      });
  }
};