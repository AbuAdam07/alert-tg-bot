const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const schedule = require('node-schedule');
const moment = require('moment');

const bot = new Telegraf('BOT_KEY');

let eventText;
let userDate;

bot.start((ctx) => ctx.replyWithHTML('Я напоминальщик, напомню тебе когда и что.\nТолько пришли мне задачу в формате\n<b>ДД.ММ.ГГГГ ЧЧ:ММ:СС</b>'));

bot.on(message('text'), async (ctx) => {
  if (!eventText) {
    userDate = ctx.update.message.text;
    ctx.reply('Отлично! Теперь напишите, о каком событии вы хотите, чтобы я напомнил.');
    eventText = true;
  } else {
    const event = ctx.update.message.text;
    const date = moment(userDate, 'DD.MM.YYYY HH:mm:ss'); // parse date string into a Date object
    const job = schedule.scheduleJob(date.toDate(), () => {
      bot.telegram.sendMessage(ctx.chat.id, `Напоминание: ${event}`);
      job.cancel();
    });
    ctx.reply(`Напоминание установлено на ${userDate} для события "${event}"`);
    eventText = false;
    userDate = null;
  }
});

bot.launch();