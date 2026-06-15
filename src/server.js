const express = require('express');
const apiRoutes = require('./routes/api.routes');
const webRoutes = require('./routes/web.routes');
const botManager = require('./services/bot.manager');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing UI Dashboard & REST API Control Panel Builder
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// Menangani Error Global (Anti-Crash System)
app.use((err, req, res, next) => {
    console.error('[SERVER CORE ERROR]', err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error.' });
});

// Jalankan Web Server
app.listen(PORT, '0.0.0.0', async () => {
    console.log('==================================================');
    console.log('       ⚙️ TELEGRAM BOT BUILDER PLATFORM ⚙️');
    console.log('               By SPY-E & 123Tool                 ');
    console.log('==================================================');
    console.log(`[SERVER] Panel Web running on http://localhost:${PORT}`);
    console.log(`[SERVER] Accessible on network via IP Termux.`);
    
    // Auto-start bot secara mandiri saat server dinyalakan (jika database token ada)
    console.log('[SERVER] Booting up and auto-restoring Bot state...');
    await botManager.start();
});
