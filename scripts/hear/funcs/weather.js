const https  = require('https');
const moment = require('moment-timezone'); // npm install moment-timezone
const city   = '1850147'; // Tokyo
const apikey = 'c9265cc2e2fbe7883cbee464f558ffd3';

module.exports = {
  ほげファンクション: (bot, msg) => {
    bot.reply(msg, 'hogehogeしたよ');
  },

  天気: (bot, msg) => {
    https.get(`https://api.openweathermap.org/data/2.5/weather?id=${city}&units=metric&appid=${apikey}`, (response) => {
    let body = '';
    response.setEncoding('utf8').on('data', (chunk) => {  body += chunk;  });
    response.on('end', () => {
        let current = JSON.parse(body);
        let text =
        `${moment.unix(current.dt).format('H:mm')} 現在 ${current.name} の 天気` +
        `<http://openweathermap.org/img/w/${current.weather[0].icon.replace('n', 'd')}.png?${moment().unix()}| > ` +
        `${current.weather[0].main}(${current.weather[0].description}) / ` +
        `気温 ${Math.round(current.main.temp)} ℃ ` +
        `${current.rain && current.rain['3h'] ? '/ 降雨量 ' + Math.ceil(current.rain['3h'] * 10) / 10 + ' mm ' : '' }` +
        `${current.snow && current.snow['3h'] ? '/ 降雪量 ' + Math.ceil(current.snow['3h'] * 10) / 10 + ' mm ' : '' }`;
        bot.reply(msg, text);
      });
    });
  }


};