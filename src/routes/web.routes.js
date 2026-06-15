const express = require('express');
const router = express.Router();
const path = require('path');

// Mengarahkan routing utama web ke file index.html (Dashboard SPA Premium)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
