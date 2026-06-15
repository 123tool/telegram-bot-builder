#!/data/data/com.termux/files/usr/bin/bash

# Clear terminal screen
clear

# Define colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}======================================================${NC}"
echo -e "${GREEN}    TELEGRAM BOT BUILDER CONTROLLER FOR TERMUX        ${NC}"
echo -e "${YELLOW}           Powered by: SPY-E & 123Tool                ${NC}"
echo -e "${CYAN}======================================================${NC}"
echo ""
echo -e "Silahkan pilih menu kontrol server di bawah ini:"
echo -e "1) ${GREEN}ON${NC}  - Hidupkan Web Dashboard & Engine Bot"
echo -e "2) ${RED}OFF${NC} - Matikan Seluruh Proses Node.js Server"
echo -e "3) ${YELLOW}EXIT${NC}- Keluar dari wizard kontrol script"
echo ""
read -p "Masukkan pilihan Anda [1-3]: " pilihan

case $pilihan in
    1)
        echo -e "\n${GREEN}[+]${NC} Memeriksa kelayakan module node_modules..."
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}[!] node_modules tidak ditemukan. Menginstal packages secara otomatis...${NC}"
            npm install
        fi
        
        echo -e "\n${GREEN}[+]${NC} Menghidupkan Server Node.js di latar belakang (background process)..."
        # Menjalankan node server menggunakan nohup agar aman dari hangup signal termux
        nohup node src/server.js > server.log 2>&1 &
        
        sleep 2
        PID=$(pgrep -f "node src/server.js")
        if [ ! -z "$PID" ]; then
            echo -e "${GREEN}[✓] Server Berhasil Dinyalakan Aktif Penuh!${NC}"
            # Menampilkan IP lokal Termux untuk kemudahan akses eksternal di PC/HP satu wifi
            IP_ADDR=$(ifconfig wlan0 | grep 'inet ' | awk '{print $2}')
            echo -e "${CYAN}[INFO] Akses Web Localhost : http://localhost:3000${NC}"
            if [ ! -z "$IP_ADDR" ]; then
                echo -e "${CYAN}[INFO] Akses Jaringan Wifi  : http://${IP_ADDR}:3000${NC}"
            fi
        else
            echo -e "${RED}[❌] Gagal menyalakan server. Silahkan periksa file 'server.log'.${NC}"
        fi
        ;;
    2)
        echo -e "\n${RED}[-] Menghentikan seluruh proses server Node.js...${NC}"
        PID=$(pgrep -f "node src/server.js")
        if [ ! -z "$PID" ]; then
            kill -9 $PID > /dev/null 2>&1
            echo -e "${GREEN}[✓] Semua server dan bot dihentikan secara aman.${NC}"
        else
            echo -e "${YELLOW}[!] Tidak ada server Node.js aktif yang ditemukan berjalan.${NC}"
        fi
        ;;
    3)
        echo -e "\nKeluar dari wizard kontrol. Terima kasih."
        exit 0
        ;;
    *)
        echo -e "\n${RED}[❌] Pilihan tidak valid.${NC}"
        ;;
esac
