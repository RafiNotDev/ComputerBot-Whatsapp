let handler = async (m, { text }) => {
    let user = global.db.data.users[m.sender]
    user.afk = +new Date()
    user.afkReason = text
    let k = `➠ ${conn.getName(m.sender)} AFK Dengan Alasan ${text ? ': ' + text : 'Tanpa Alasan'}`
    conn.sendMessage(m.chat, {
            text: k,
            contextInfo: {
                mentionedJid: [null],
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: setting.idch,
                   serverMessageId: null,
                   newsletterName: setting.namach,
                   },
                   externalAdReply: {
                   title: `M U L A I  A F K`,
                   body: `❲ ${conn.getName(m.sender)} ❳`,
                   thumbnailUrl: global.fotopp(m.sender),
                   sourceUrl: '',
                   mediaType: 1,
                   renderLargerThumbnail: false
                   },
                },
            }
            )
}
handler.help = ['afk']
handler.tags = ['main']
handler.command = /^afk$/i
handler.group = true

export default handler