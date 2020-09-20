const Telegraf = require('telegraf');
const axios = require('axios');
const cc = require('currency-codes');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '1338063507:AAFm5cFJW5zfyKRaTZ--slqpZibeF1wlyDo';
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
const moment =  require('moment');

bot.start((ctx) => {
	return ctx.reply('Welcome to Mono Currency Bot')
})

let timer = 30000;

const interval = setInterval(() => {
	timer--
},1)

bot.hears(/^[A-Z]+$/i, (ctx) => {
	const currentCurrCode = ctx.message.text;
	const currentCurr = cc.code(currentCurrCode);
	axios.get('https://api.monobank.ua/bank/currency')
	.then(res => {
		return res.data;

	}).then(currencyObj => {
		if (!currentCurr) {
			return ctx.reply('Wrong input, Currency did not found!')
		}
		const foundCurrency = currencyObj.find(el => el['currencyCodeA'].toString() === currentCurr.number)
		if (!foundCurrency
			|| !foundCurrency['rateBuy']
			|| !foundCurrency['rateSell']
		) {
			return ctx.reply('Wrong input, Currency did not found in Monobank API!')
		}
	return ctx.replyWithMarkdown(`
CURRENCY:             * ${currentCurr.code} *
-------------------------------
DATE:          * ${moment().format('DD_MM_YYYY')} *
-------------------------------
RATE BUY:   * ${foundCurrency['rateBuy'].toFixed(2)} UAH*
-------------------------------
RATE SELL:  * ${foundCurrency['rateSell'].toFixed(2)} UAH*
-------------------------------
`);
	}).catch(err => {
		console.log(err.message)
		return ctx.reply(`Try again after ${Math.round(timer/1000/60)} minutes`);
	})
})
clearInterval(interval);
bot.startPolling();

