module.exports = {
  backlogGetProjects: (bot, msg, controller, apis) => {
    apis.backlog.api.getProjects().then(data => {
      let res = JSON.stringify(data)
      bot.reply(msg, `\`\`\`${res}\`\`\``);
    }).catch(err => {
      console.log('error:', err.message);
    });
  },
  backlog: (bot, msg, controller, apis) => {
    this.api.getSpace().then(data => {
      bot.reply(msg, `space nameは ${data.name}`);
    }).catch(err => {
      console.log('error:', err.message);
    });
  }
};