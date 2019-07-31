module.exports = {
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
  githubIssue: (bot, msg, controller, apis) => {
    apis.github.api.issues.create({
      owner: this.botRepo.owner,
      repo: this.botRepo.repo,
      title: msg.match[1],
      body: msg.match[2]
    }).then(result => {
      //console.log(result);
      bot.reply(msg, 'issueありがとう！');
    })
  },
  githubGetReview: (bot, msg, controller, apis) => {
    controller.storage.channels.get(msg.channel, function(err, channel_data) {
      bot.reply(msg, 'now in review ' + JSON.stringify(channel_data.reviews, null, '\t'));
    }, function(err) {
      console.log(err);
    });
  },
  githubReview: (bot, msg, controller, apis) => {
    // controller.storage.channels.get(id, function(err, channel_data) {});
    // controller.storage.channels.all(function(err, all_channel_data) {});
    apis.github.api.pullRequests.createReviewRequest({
      "owner": msg.match[1],  // (messanger)
      "repo": msg.match[2],   // (blitz-frontend)
      "number": msg.match[3], // PR number (889)
      "reviewers": msg.match[4].split(',') // github user (z-kai-suzuki)
    })
      .then(result => {
        let res_html = result.data._links.html.href;
        controller.storage.channels.get(msg.channel, function(err, channel_data) {
          let channel_id  = msg.channel;
          if(!channel_data) {
            channel_data = {
              id: channel_id,
              reviews: {}
            }
          }
          channel_data.reviews[Math.floor( Math.random() * 1000 )] = {
            reviewers: msg.match[4].split(','),
            url: res_html
          }
          controller.storage.channels.save({
            id: channel_id,
            reviews: channel_data.reviews
          }, function(err) {
            console.log(err);
          });
          bot.reply(msg, 'now in review ' + channel_data);
        }, function(err) {
          console.log(err);
        });
        bot.reply(msg, 'レビュー依頼しました\n' + res_html + '\n' + '担当: ' + msg.match[4].split(','));
      }).catch(function (err) {
        console.error(err);
        bot.reply(msg, err);
      });
  }
};