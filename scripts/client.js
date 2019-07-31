const requireDir = require('require-dir');

const hearFuncs = Object.assign(
  ...Object.values(
    requireDir(
      'hear/funcs',
      {
        noCache: true,
        recurse: true
      }
    )
  )
);
const hearCommands = Object.values(
    requireDir(
      'hear/commands',
      {
        noCache: true,
        recurse: true
      }
    )
  ).reduce(
    (pre, current) => {
      pre.push(...current);
      return pre
    },
    []
  );


class client {

  constructor () {}

  hear (controller, apis) {
    hearCommands.forEach(function(hear, index) {
      controller.hears(hear.command, ['direct_message', 'direct_mention', 'mention'], (bot, msg) => {
        hearFuncs[hearCommands[index].func](bot, msg, controller, apis);
      });
    });
  }
}

module.exports = client;