let handler = async(m, { conn, command }) => {
  try {
  let who = await mention(text)
  let name = await conn.getName(who)
  m.reply(name)
  } catch {
    try {
    let who = m.quoted ? m.quoted.sender : m.sender
    let name = await conn.getName(who)
    m.reply(name)
  } catch {
    throw `sorry gk bisa coba yang lain⍨`
    }
  }
}
handler.help = ['getname <@tag/reply>']
handler.tags = ['owner']
handler.command = /^(get)?name?a?$/i
handler.owner = true
export default handler