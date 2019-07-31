const commandPrefix = 'task'

module.exports = [
  {command: commandPrefix + ' (.*) (.*) (.*) (.*)', func: 'task', summary: 'taskをアサインできる(要するにtodo) params: mentions(半角スペースつなぎ) title text 期限'},
  {command: commandPrefix + ' done (.*)', func: 'taskdone', summary: 'taskを完了できる。全員が完了するとassign元に通知する params: taskId'},
  {command: commandPrefix + ' list (.*)', func: 'tasklist', summary: '指定ユーザーのtask一覧を表示する(only visible you)'},
  {command: commandPrefix + ' list', func: 'tasklist', summary: '自分のtask一覧を表示する(only visible you)'},
  {command: commandPrefix + ' assigns', func: 'taskassigns', summary: '自分の手持ちのtask一覧を表示する(only visible you)'},
  {command: commandPrefix + ' withdraw (.*)', func: 'taskwithdraw', summary: '(WIP)自分が依頼しているtaskを取り下げる(only visible you) params: taskId'},
  {command: commandPrefix + ' request', func: 'taskRequest', summary: 'taskをアサインできる(要するにtodo)の対話形式'}
];