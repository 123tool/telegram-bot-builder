const { Telegraf, Markup } = require('telegraf');
const db = require('../config/database');
const AIService = require('./ai.service');

class BotManager {
    constructor() {
        this.botInstance = null;
        this.status = 'STOPPED'; // STOPPED, RUNNING, ERROR
        this.errorLog = null;
    }

    async start() {
        try {
            const settingsColl = db.getCollection('settings');
            const config = settingsColl?.findOne({}) || {};

            if (!config.botToken) {
                this.status = 'STOPPED';
                return { success: false, message: 'Token Telegram Bot belum diatur.' };
            }

            if (this.botInstance) {
                await this.stop();
            }

            this.botInstance = new Telegraf(config.botToken);
            this.setupHandlers(config);

            this.botInstance.launch().catch((err) => {
                this.status = 'ERROR';
                this.errorLog = err.message;
                console.error('[BOT LAUNCH ERROR]', err);
            });

            this.status = 'RUNNING';
            this.errorLog = null;
            console.log(`[BOT] Telegram Bot @${config.botToken.split(':')[0]} is now active.`);
            return { success: true, message: 'Bot berhasil dinyalakan.' };
        } catch (error) {
            this.status = 'ERROR';
            this.errorLog = error.message;
            return { success: false, message: error.message };
        }
    }

    async stop() {
        if (this.botInstance) {
            try {
                await this.botInstance.stop();
            } catch (e) {
                console.log('[BOT STOP WARNING]', e.message);
            }
            this.botInstance = null;
        }
        this.status = 'STOPPED';
        console.log('[BOT] Telegram Bot has been stopped.');
        return { success: true, message: 'Bot berhasil dimatikan.' };
    }

    setupHandlers(config) {
        const bot = this.botInstance;

        // Middleware untuk mencatat / subscribe user baru secara otomatis
        bot.use(async (ctx, next) => {
            if (ctx.from) {
                const subColl = db.getCollection('subscribers');
                const exists = subColl.findOne({ userId: ctx.from.id });
                if (!exists) {
                    subColl.insert({
                        userId: ctx.from.id,
                        username: ctx.from.username || '',
                        firstName: ctx.from.first_name || '',
                        lastName: ctx.from.last_name || '',
                        joinedAt: new Date().toISOString()
                    });
                }
            }
            return next();
        });

        // Handler Event /start
        bot.start(async (ctx) => {
            const currentConfig = db.getCollection('settings').findOne({}) || {};
            const welcomeMsg = currentConfig.welcomeMessage || "Halo! Selamat datang di Bot kami.";
            
            if (currentConfig.welcomeButtons && currentConfig.welcomeButtons.length > 0) {
                const keyboard = this.buildKeyboard(currentConfig.welcomeButtons);
                return ctx.reply(welcomeMsg, keyboard);
            }
            return ctx.reply(welcomeMsg);
        });

        // Handler untuk Command Manual dan Auto-Response Builder
        bot.on('text', async (ctx) => {
            const text = ctx.message.text.trim();
            const cmdColl = db.getCollection('commands');
            const currentConfig = db.getCollection('settings').findOne({}) || {};

            // 1. Cek Command Manual / Keyword Auto-response terlebih dahulu
            const matchCommand = cmdColl.findOne({ trigger: text });
            if (matchCommand) {
                if (matchCommand.buttons && matchCommand.buttons.length > 0) {
                    return ctx.reply(matchCommand.response, this.buildKeyboard(matchCommand.buttons));
                }
                return ctx.reply(matchCommand.response);
            }

            // 2. Jika tidak ada command yang cocok, teruskan ke Engine AI apabila diaktifkan
            if (currentConfig.aiEnabled) {
                await ctx.sendChatAction('typing');
                const aiReply = await AIService.generateResponse(
                    currentConfig.aiProvider,
                    currentConfig.aiApiKey,
                    text,
                    currentConfig.aiCustomUrl
                );
                return ctx.reply(aiReply);
            }

            // 3. Fallback jika tidak ada command & AI mati
            if (text.startsWith('/')) {
                return ctx.reply('❌ Perintah tidak dikenali.');
            }
        });
    }

    buildKeyboard(buttonsArray) {
        const inlineRows = [];
        buttonsArray.forEach(btn => {
            if (btn.type === 'url') {
                inlineRows.push([Markup.button.url(btn.text, btn.value)]);
            } else {
                inlineRows.push([Markup.button.callback(btn.text, btn.value)]);
            }
        });
        return Markup.inlineKeyboard(inlineRows);
    }

    async broadcast(message) {
        if (!this.botInstance) return { success: false, count: 0, message: 'Bot sedang tidak aktif.' };
        const subColl = db.getCollection('subscribers');
        const users = subColl.find({});
        let successCount = 0;

        for (const user of users) {
            try {
                await this.botInstance.telegram.sendMessage(user.userId, message);
                successCount++;
                // Beri jeda 50ms per chat untuk menghindari rate limit Telegram api
                await new Promise(resolve => setTimeout(resolve, 50));
            } catch (err) {
                console.error(`Broadcast failed to ${user.userId}:`, err.message);
            }
        }
        return { success: true, count: successCount };
    }

    getStatus() {
        return {
            status: this.status,
            error: this.errorLog,
            subscribersCount: db.getCollection('subscribers')?.count() || 0
        };
    }
}

// Singleton Pattern Instance
module.exports = new BotManager();
