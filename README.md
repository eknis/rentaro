# rentaro
multi-bot

# who
[滝廉太郎](https://ja.wikipedia.org/wiki/%E7%80%A7%E5%BB%89%E5%A4%AA%E9%83%8E)


![a](https://upload.wikimedia.org/wikipedia/commons/d/d2/Taki_Rentaro.jpg) 

# Usage

## Installation
```
$ npm install
```

## Getting Start

custom config.js
```
module.exports = {
  bottoken: [slack_bot_token],
  admin: [admin_slack_name],
  github: {
    octo: {
      debug: true,
      baseUrl: 'https://github.com/api/v3',
      headers: {
        accept: '*/*',
        'user-agent': 'octokit/rest.js v1.2.3' // v1.2.3 will be current version
      }
    },
    auth: {
      type: 'basic',
      username: [github_user_name],
      password: [github_user_pass]
    },
    botRepo: {
      owner: [github_owner],
      repo: [github_repo]
    }
  },
  jira: {
    protocol: 'https',
    host: 'jira.office.net',
    username: [jira_user_name],
    password: [jira_user_pass],
    apiVersion: '2',
    strictSSL: true
  },
  confluence: {
    username: [conflu_user_name],
    password: [conflu_user_pass],
    baseUrl:  [conflu_base_url] //ext. https://confluence,
    // version: 4 // Confluence major version, optional
  },
  backlog: {
    host: [backlog],
    apiKey: '[backlog_api_key]'
  }
};
```

### what's going on
```
npm start
```

### forever
```
npm install -g forever
npm run forever
```

### How do I say?
```
help
```

# how to develop
まず
`hear/commands`
配下にコマンドを追加します。

その際分けるべきであれば新規ファイルを作ってください。名称は何でも良い。

```
// testCommand.js
module.exports = [
  {command: 'hoge', func: 'ほげ', summary: 'hogehogeする'}
];
```

| param | what? |
----|----
| command | hearする言葉を作成します。汎用的にしすぎると何でも反応してしまうのでかぶらないような名称にすると良いです。 |
| func | 後述するfuncのfunction名です。わかりやすい名称にしておけば問題ありません。 |
| summary | `help`を行った際の説明文です。 |


次に対応するfuncsを作成します。この際必須ではないですが名称を合わせておくと良いです。

```
// testCommandFunc.js
module.exports = {
  ほげ: (bot, msg) => {
    bot.reply(msg, 'hogehogeしたよ');
  }
};
```

シンプルな実装は上記のようになります。

この際の設定可能なparamは以下です

| call | func |
----|----
| bot | slackbotの機能です(必須) |
| msg | どのような情報でhearしたかが入っています。(必須) |
| controller | bot機能を単体で利用する際に使います。具体的にはstorageアクセスの際に必要です。 |
| apis | 外部apiを利用したい場合、こちらに登録されています。 |

この状態で起動(再起動)を行い話しかけてみてください。

```
@rentaro hoge
```

簡単ですよね！


## how to use apis
```
githubme: (bot, msg, controller, apis) => {
    apis.github.api.users.get({})
    .then(result => {
      let res = JSON.stringify(result.data);
      bot.reply(msg, `\`\`\`${res}\`\`\``);
    }).catch(function(err) {
      console.error(err);
      bot.reply(msg, err);
    });
  },
```
hears funcの第4引数で利用できます


それぞれの使い方は以下moduleのapi利用方法を確認してください。

# modules

## github client
### import module
https://github.com/octokit/rest.js

## jira client ※internal only
### import module
https://github.com/jira-node/node-jira-client

## confluence client ※internal only
### import module
https://github.com/johnpduane/confluence-api

## backlog client
### import module
https://github.com/nulab/backlog-js
