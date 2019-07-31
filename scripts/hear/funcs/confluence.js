module.exports = {
  confluGetContentById: (bot, msg, controller, apis) => {
    apis.conflu.api.getContentById(msg.match[1], function(err, data) {
      if (err) {
        console.log(err);
        bot.reply(msg, 'err');
      } else {
        console.log(data);
        bot.reply(msg, `${data.title}\n
最終更新者: ${data.version.by.username}\n
${data._links.base}${data._links.tinyui}`
        );
      }
    });
  },
  confluGetContentById: (bot, msg, controller, apis) => {
    apis.conflu.api.postContent(
      msg.match[1],
      msg.match[2],
      msg.match[3],
      msg.match[4],
      function(err, data) {
        if (err) {
          console.log(err);
          bot.reply(msg, 'err');
        } else {
          bot.reply(msg, 'ok!');
        }
      }
    );
  }
};