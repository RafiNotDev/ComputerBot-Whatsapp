import JavaScriptObfuscator from 'javascript-obfuscator'

let handler = async (m, { conn, text }) => {
if (!(text || m.quoted)) throw `[!] Masukan Code atau Reply Pesan Code Yang Bakal Di Encrypt`
let code = null
if (m.quoted) {
code = m.quoted.text
} else {
code = text
}
let res = JavaScriptObfuscator.obfuscate(code)
conn.reply(m.chat, res.getObfuscatedCode(), m)
}
handler.help = ['encrypt']
handler.tags = ['tools']
handler.command = /^enc|encrypt$/i
handler.limit = 15
export default handler