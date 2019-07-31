module.exports = {
  jira: (bot, msg, controller, apis) => {
    apis.jira.api.getProject('PFBASIS')
    .then(function(res) {
      bot.reply(msg, res.url);
    })
    .catch(function(err) {
      console.error(err);
      bot.reply(msg, res.err);
    });
  }
};