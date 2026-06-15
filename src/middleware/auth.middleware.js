/**
 * Project: Telegram Bot Builder Platform
 * Authors: SPY-E & 123Tool
 * * Middleware ini disiapkan untuk penanganan security extension di masa mendatang
 * seperti proteksi API via Session Token, IP Whitelisting, atau API-Key Dashboard.
 */
exports.apiGuard = (req, res, next) => {
    // Untuk saat ini dilewatkan secara publik karena diakses via localhost Termux secara privat.
    // Anda dapat menambahkan validasi token di sini jika di-deploy ke VPS publik.
    next();
};
