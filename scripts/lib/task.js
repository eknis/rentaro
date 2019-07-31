module.exports = {
  taskAssign: (bot, msg, controller, apis, title, userIds, txt, limit) => {
    controller.storage.users.get(msg.user, function(err, owner) {
      if (!owner) {
        //TODO new User()
        owner = {
          id: msg.user,
          assignMax: 1,
          taskAssigns: [],
          tasks: []
        };
      }
      let hasOwner = false;
      let incrementAssignMax = owner.assignMax + 1;
      let ownerAssignId = owner.id + ':' + incrementAssignMax;

      controller.storage.teams.get(
        msg.team,
        function(err, team_data) {
          let taskId = ownerAssignId;
          userIds.forEach(userId => {
            if (userId != owner.id) {
              controller.storage.users.get(userId, function(err, user) {
                if (!user) {
                  //TODO new User()
                  user = {
                    id: userId,
                    assignMax: 1,
                    tasks: [],
                    taskAssigns: []
                  };
                }
                user.tasks.push(taskId);
                controller.storage.users.save({
                  id: userId,
                  assignMax: user.assignMax,
                  taskAssigns: user.taskAssigns,
                  tasks: user.tasks
                }, function(err) {
                });
              });
            } else {
              hasOwner = true;
            }
          });
          owner.taskAssigns.push(ownerAssignId);
          if(hasOwner) {
            owner.tasks.push(taskId);
          }

          controller.storage.users.save({
            id: msg.user,
            assignMax: incrementAssignMax,
            taskAssigns: owner.taskAssigns,
            tasks: owner.tasks
          }, function(err) {
            if(err)console.log(err);
          });

          // //TODO save for team
          team_data.tasks[taskId] = {
            id: taskId,
            from: msg.user,
            members: userIds,
            title: title,
            txt: txt,
            limit: limit
          }
          controller.storage.teams.save({
            id: msg.team,
            users: team_data.users,
            tasks: team_data.tasks
          });

          let mentions = userIds.map(function(userId) { 
            return '<@' + userId + '>' 
          });

          bot.reply(msg, {
            'text': mentions.join('\n') + '\ntaskが設定されました',
            'attachments': [
              {
                'title': title,
                'text': '*taskID* ' + taskId
                      + '\n*依頼者* ' + '<@' + msg.user + '>'
                      + '\n*期限* ' + (limit ? limit : '無し')
                      + '\n' + txt,
                'color': '#7CD197'
              }
            ]
          });
      }, function(err) {
        if(err)console.log(err);
      });
    })
  }
}
