const commandPrefix = 'backlog'

module.exports = [
  {command: commandPrefix + ' getProjects', func: 'backlogGetProjects', summary: '(WIP)自身が参加しているbacklogのprojectを表示します'},
  {command: commandPrefix, func: 'backlog', summary: '(WIP)自身が参加しているbacklogのspaceを表示します'}
];