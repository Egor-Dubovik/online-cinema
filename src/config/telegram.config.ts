import { Telegram } from '../telegram/telegram.interface';

export const getTelegramConfig = (): Telegram => ({
	chatId: process.env.MY_CHAT_ID,
	token: process.env.TG_BOT_API,
});
