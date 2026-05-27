export async function before(m, { isAdmin, isBotAdmin, conn }) {
    if (m.isBaileys && m.fromMe) return 
    let chat = global.db.data.chats[m.chat]
    let isSticker = m.mtype
    if (chat.antiSticker && isSticker === "stickerMessage" && m.isGroup) {
		if (isAdmin) return m.reply("[ ❗ ] Terdeteksi Admin Kirim Sticker\n\nPeraturan Group Gak Berlaku Sama Admin Ya Guys")
		
        rafitampilan(m.chat, `*Sticker Terdeteksi*\n\nMaaf Ya Kak, stickernya Harus ${global.setting.namabot} Hapus Karna Di Admin/Owner Mengaktifkan Anti sticker Untuk Chat Ini ${isBotAdmin? '.' : 'Tapi Bot Bukan Admin Kak'}`, m)
        if (isBotAdmin) {
            await this.sendMessage(m.chat, { delete: m.key })
        }
    }
    return
}