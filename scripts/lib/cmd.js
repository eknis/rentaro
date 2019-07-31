const execSync = require('child_process').execSync;
const commands = {
  "hostname" : "hostname"
}

module.exports = {
  run: (command) => {
    return module.exports.execute(commands[command]);
  },
  execute: (command) => {
    try {
      let res = execSync(command,{
        timeout: 5000,
        encoding: 'utf-8'
      });
      return `\`\`\`${res}\`\`\``;
    } catch (err) {
      return `\`\`\`${err}\`\`\``;
    }
  }
}
