const botManager = require('../services/bot.manager');
const db = require('../config/database');

exports.getDashboardStats = (req, res) => {
    const settings = db.getCollection('settings').findOne({}) || {};
    const commands = db.getCollection('commands').find({});
    const subscribers = db.getCollection('subscribers').find({});
    const engineStatus = botManager.getStatus();

    res.json({
        success: true,
        config: {
            botToken: settings.botToken || '',
            adminId: settings.adminId || '',
            welcomeMessage: settings.welcomeMessage || '',
            welcomeButtons: settings.welcomeButtons || [],
            aiEnabled: settings.aiEnabled || false,
            aiProvider: settings.aiProvider || 'openai',
            aiApiKey: settings.aiApiKey || '',
            aiCustomUrl: settings.aiCustomUrl || ''
        },
        engine: engineStatus,
        commands: commands,
        subscribersCount: subscribers.length,
        subscribers: subscribers.slice(-20) // Ambil 20 user terbaru
    });
};

exports.updateSettings = async (req, res) => {
    try {
        const settingsColl = db.getCollection('settings');
        let currentSettings = settingsColl.findOne({});

        const updateData = {
            botToken: req.body.botToken,
            adminId: req.body.adminId,
            welcomeMessage: req.body.welcomeMessage,
            welcomeButtons: req.body.welcomeButtons || [],
            aiEnabled: req.body.aiEnabled === true || req.body.aiEnabled === 'true',
            aiProvider: req.body.aiProvider || 'openai',
            aiApiKey: req.body.aiApiKey,
            aiCustomUrl: req.body.aiCustomUrl || ''
        };

        if (!currentSettings) {
            settingsColl.insert(updateData);
        } else {
            Object.assign(currentSettings, updateData);
            settingsColl.update(currentSettings);
        }

        // Hot reload: Restart engine bot jika sedang berjalan agar konfigurasi baru diterapkan
        const currentStatus = botManager.getStatus().status;
        if (currentStatus === 'RUNNING') {
            await botManager.start();
        }

        res.json({ success: true, message: 'Konfigurasi berhasil disimpan dan diterapkan.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.toggleBotEngine = async (req, res) => {
    const { action } = req.body; // 'START' atau 'STOP'
    let result;
    if (action === 'START') {
        result = await botManager.start();
    } else {
        result = await botManager.stop();
    }

    if (result.success) {
        res.json({ success: true, message: result.message, status: botManager.getStatus() });
    } else {
        res.status(400).json({ success: false, message: result.message });
    }
};

exports.addCommand = (req, res) => {
    const { trigger, response, buttons } = req.body;
    if (!trigger || !response) return res.status(400).json({ success: false, message: 'Trigger & Response wajib diisi.' });

    const cmdColl = db.getCollection('commands');
    const existing = cmdColl.findOne({ trigger });
    if (existing) return res.status(400).json({ success: false, message: 'Trigger command sudah terdaftar.' });

    cmdColl.insert({ trigger, response, buttons: buttons || [] });
    res.json({ success: true, message: 'Command manual berhasil ditambahkan.' });
};

exports.deleteCommand = (req, res) => {
    const { id } = req.params;
    const cmdColl = db.getCollection('commands');
    const doc = cmdColl.get(parseInt(id));
    if (!doc) return res.status(404).json({ success: false, message: 'Command tidak ditemukan.' });

    cmdColl.remove(doc);
    res.json({ success: true, message: 'Command berhasil dihapus.' });
};

exports.broadcastMessage = async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Pesan broadcast tidak boleh kosong.' });

    const result = await botManager.broadcast(message);
    if (result.success) {
        res.json({ success: true, message: `Broadcast selesai. Terkirim ke ${result.count} pengguna.` });
    } else {
        res.status(400).json({ success: false, message: result.message });
    }
};
