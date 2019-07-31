const commandPrefix = 'github'

module.exports = [
  {command: commandPrefix + ' me', func: 'githubme', summary: '(WIP)githubの自身の情報を表示'},
  {command: commandPrefix + ' issue (.*) (.*)', func: 'githubIssue', summary: 'rentaroにissueを届けます'},
  {command: commandPrefix + ' get review', func: 'githubGetReview', summary: '(WIP)githubのレビュー情報を表示'},
  {command: commandPrefix + ' review (.*) (.*) (.*) (.*)', func: 'githubReview', summary: '(WIP)githubのレビューを依頼します'}
];