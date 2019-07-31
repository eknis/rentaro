const idRegex = /<@(.*?)>/;

module.exports = {
  getUserInfo: (msg, controller, userName) => {
    controller.storage.teams.get(
      msg.team,
      function(err, team_data) {
        return team_data[userName];
    })
  },
  getUserNameFromId: (bot, userId) => {
    bot.api.users.info({ user: userId }, function(err, response) {
      let {name} = response.user;
      console.log(name);
    });
  },
  getUserIdFromName: (msg, controller, userName) => {
    controller.storage.teams.get(
      msg.team,
      function(err, team_data) {
        return team_data.users[userName].id
      }
    )
  },
  getUserIdFromMention: (mention) => {
    return mention.match(idRegex)[1];
  }
}