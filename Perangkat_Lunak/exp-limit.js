let handler = async (m, { conn, text }) => {

let who = await mention(text) 
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base'
    let user = global.db.data.users[who]
    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://files.catbox.moe/itl427.jpg')
    let limit = user.premiumTime >= 1 ? 'Unlimited' : user.limit
    let tekss = `
   *LIMIT KAMU*
> *Username:* \`${user.registered ? user.name : `@${who.split("@")[0]}`}\`
> *Status:* \`${who.split`@`[0] == setting.owner ? 'Developer' : user.premiumTime >= 1 ? 'Premium User' : user.level >= 1000 ? 'Elite User' : 'Free User'}\`
> *Limit:* \`${limit}\`
> *Developer By:* \`@${global.nodev}\``
    await conn.sendMessage(m.chat, {
            text: tekss,
            contextInfo: {
                mentionedJid: conn.parseMention(tekss),
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: global.setting.idch,
                   serverMessageId: null,
                   newsletterName: global.setting.namach,
                   },
                   externalAdReply: {
                   title: `Mau Sewa Bot Wa??,  Chat`,
                   body: `Wa Owner:` + setting.owner,
                   thumbnailUrl: pp || setting.tampilan,
                   sourceUrl: '',
                   mediaType: 1,
                   renderLargerThumbnail: true
                   },
                },
            }, { quoted: m })
}
handler.help = ['limit [@user]']
handler.tags = ['xp']
handler.command = /^(limit)$/i
export default handler 