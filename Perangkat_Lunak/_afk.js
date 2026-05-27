let handler = async m => m

handler.before = async m => {
    let user = global.db.data.users[m.sender]
    
if (!m.isGroup) return false
  if (user.afk > -1) {
    let f = `
➠ Kak ${user.name} Masih hidup ternyata wkwk\nKamu Berhenti AFK${user.afkReason ? ' Setelah ' + user.afkReason : ''}
➠ Selama ${(new Date - user.afk).toTimeString()}
`
    raficostum(m.chat, f, `A F K  S T O P`, `❲ ${user.name} ❳`, fotopp(m.sender), false)
    user.afk = -1
    user.afkReason = ''
  }
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let user = global.db.data.users[jid]
    if (!user) continue
    let afkTime = user.afk
    if (!afkTime || afkTime < 0) continue
    let reason = user.afkReason || ''
    let z = `
➠ Jangan Tag Dia Kak ${conn.getName(m.sender)}!
Dia Sedang AFK ${reason ? 'Dengan Alasan ' + reason : 'Tanpa Alasan'}
➠ Selama ${(new Date - afkTime).toTimeString()}
`
    raficostum(z, `S E D A N G  A F K`, `❲ ${conn.getName(jid)} ❳`, fotopp(jid), false)
  }
  return true
}

export default handler