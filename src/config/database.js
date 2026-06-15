const Loki = require('lokijs');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Loki(path.join(dataDir, 'database.json'), {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
});

function databaseInitialize() {
    if (!db.getCollection('settings')) {
        db.addCollection('settings');
    }
    if (!db.getCollection('commands')) {
        db.addCollection('commands');
    }
    if (!db.getCollection('subscribers')) {
        db.addCollection('subscribers');
    }
    console.log('[SYSTEM] Storage Database initialized successfully.');
}

module.exports = db;
