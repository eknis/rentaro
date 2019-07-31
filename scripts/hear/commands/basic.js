module.exports = [
  {command: 'hello', func: 'hello', summary: 'あいさつしましょう'},
  {command: 'whereis', func: 'whereis', summary: '起動している箇所を返答します'},
  {command: 'save members', func: 'savemembers', summary: 'channelにいるメンバーを認識します'},
  {command: 'cmd (.*)', func: 'cmd', summary: 'command実行します(adminユーザーのみ)'},
  {command: 'help (.*)', func: 'help', summary: 'コマンド一覧を表示します params: モジュール名 ※allとするとすべて表示します'},
  {command: 'help', func: 'helpall', summary: 'すべてのコマンド一覧を表示します'}
];