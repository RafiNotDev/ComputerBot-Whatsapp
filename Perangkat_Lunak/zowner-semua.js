let handler = async (m, { conn, text, usedPrefix, command, participants, isOwner }) => {
    if (!isOwner) return
conn.sendMessage(m.chat, { text: `@semua ${text}`, mentions: participants.map(a => a.id) }, { quoted: m })
}
handler.command = ['as']
export default handler