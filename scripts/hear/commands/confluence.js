const commandPrefix = 'conflu';

module.exports = [
  {command: commandPrefix + ' getContentById (.*)', func: 'confluGetContentById', summary: '(dev-only)cofluenceのドキュメント情報をidから表示します'},
  {command: commandPrefix + ' postContent (.*) (.*) (.*) (.*)', func: 'confluPostContent', summary: '(dev-only)cofluenceのドキュメントを作成します'}
];