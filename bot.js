const config = require(__dirname + '/config');
const Botkit = require('botkit');
const slackKits = require(__dirname + '/scripts/kits');

if (!config.bottoken) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const controller = Botkit.slackbot({
  debug: false,
  stats_optout: true,
  json_file_store: 'storages'
});

controller.spawn({
  token: config.bottoken
}).startRTM((err) => {
  if (err) {
    throw new Error(err);
  }
});

slackKits.hear(controller);
