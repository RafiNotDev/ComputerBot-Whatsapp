let handler = async (m, { conn, args, text }) => {
    if (!text) return m.reply("linkchnya")
if (!text.includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await conn.newsletterMetadata("invite", result)
let teks = `
* *ID Channel :* ${res.id}
* *Nama Channel :* ${res.name}
* *Jumlah Pengikut :* ${res.subscribers}
* *Status :* ${res.state}
* *Verifikasi :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}`
conn.sendMessage(m.chat, {
  text: teks,
  footer: setting.namabot,
  interactiveButtons: [
    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'SALIN NAMA CH', copy_code: res.name }) },
    { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'SALIN ID CH', copy_code: res.id }) }
  ], contextInfo: {
                mentionedJid: conn.parseMention(teks),
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: global.setting.idch,
                   serverMessageId: null,
                   newsletterName: global.setting.namach,
                   },
                },
               }, { quoted: m })
}

handler.help = ["cekidch"]
handler.tags = ["info","tools"]
handler.command = ["cinfo", "channelinfo", "ci", "cekidch"]

export default handler