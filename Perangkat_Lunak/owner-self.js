let handler = async(m, { conn, command }) => {
  let isPublic = command === "public";
  let self = global.db.data.settings[conn.user.jid].self

  if(self === !isPublic) return m.reply(`Sudah ${!isPublic ? "Self" : "Publik"} dari tadi Bang :v`)

  global.db.data.settings[conn.user.jid].self = !isPublic

  m.reply(`${!isPublic ? "[❗] *Perintah DiTerima*\nBot Sekarang Dalam Mode Self\nCuman Owner Dan Developer Yang Bisa Pake Bot" : "[❗] *Perintah DiTerima*\nBot Sekarang Dalam Mode Public\nSemua Orang Bisa Pake Bot"}`)
}

handler.help = ["self", "public"]
handler.tags = ["owner"]
handler.rowner = true
handler.command = /^(self|public)/i
export default handler 