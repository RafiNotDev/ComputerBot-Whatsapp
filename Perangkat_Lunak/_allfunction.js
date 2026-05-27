import axios from "axios"
import fetch from "node-fetch"
import moment from "moment-timezone";
import { generateWAMessageContent, generateWAMessageFromContent } from "@adiwajshing/baileys";
import crypto from "crypto";
import { sticker } from '../Perangkat_Keras/Komponen/sticker.js'

let handler = (m) => m;
handler.before = async (m, { conn, text, args }) => {

let imagepp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => setting.tampilan)   

           // Bagian Function Bot //
        
    function RafiTampilan(jid = `${global.groub}`, teks, quotedd = m, thumb = imagepp, render = 'true') {
    const userTampilan = global.db.data.settings[conn.user.jid].tampilan
   
  if (userTampilan === "button") {
    return conn.sendMessage(jid, {
  text: teks,
  footer: setting.namabot,
  interactiveButtons: [
  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: `SEMUA FITUR BOT`, id: `.allmenu` }) },
    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'CHAT OWNER', url: `https://wa.me/${setting.owner}` }) },
    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'CHAT DEVELOPER', url: `https://wa.me/${global.nodev}` }) }
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
               }, { quoted: quotedd })
}

if (userTampilan === "teks") {
return m.reply(teks)
}
if (userTampilan === "gambar") {
return conn.sendMessage(jid, {
            image: { url: thumb },
            caption: teks
            }, { quoted: quotedd })
}
return conn.sendMessage(jid, {
            text: teks,
            contextInfo: {
                mentionedJid: conn.parseMention(teks),
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: global.setting.idch,
                   serverMessageId: null,
                   newsletterName: global.setting.namach,
                   },
                   externalAdReply: {
                   title: `${ucapan()} Kak ${conn.getName(m.sender)}`,
                   body: setting.namabot,
                   thumbnailUrl: thumb,
                   sourceUrl: setting.website,
                   mediaType: 1,
                   renderLargerThumbnail: render
                   },
                },
            }, { quoted: quotedd })
}

    function RafiMenu(jid = `${global.groub}`, teks, quotedd = m, thumb = imagepp, render = 'true') {
const userMenu = global.db.data.settings[conn.user.jid].menu
  
  if (userMenu === "button") {
    return conn.sendMessage(jid, {
  text: teks,
  footer: setting.namabot,
  interactiveButtons: [
    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'CHAT OWNER', url: `https://wa.me/${setting.owner}` }) },
    { name: 'cta_url', buttonParamsJson: JSON.stringify({ display_text: 'CHAT DEVELOPER', url: `https://wa.me/${global.nodev}` }) }
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
               }, { quoted: quotedd })
}
if (userMenu === "teks") {
return m.reply(teks)
}
if (userMenu === "gambar") {
return conn.sendMessage(jid, {
            image: { url: thumb },
            caption: teks,
            contextInfo: {
                mentionedJid: conn.parseMention(teks),
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: global.setting.idch,
                   serverMessageId: null,
                   newsletterName: global.setting.namach,
                   },
              },
            }, { quoted: quotedd })
}
if (userMenu === "animasi") {
return conn.sendMessage(jid, {
            video: { url: setting.video },
            caption: teks,
            gifPlayback: true,
            contextInfo: {
                mentionedJid: conn.parseMention(teks),
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: global.setting.idch,
                   serverMessageId: null,
                   newsletterName: global.setting.namach,
                   },
                   externalAdReply: {
                   title: `${ucapan()} Kak ${conn.getName(m.sender)}`,
                   body: setting.namabot,
                   thumbnailUrl: thumb,
                   sourceUrl: setting.website,
                   mediaType: 1,
                   renderLargerThumbnail: false
                   },
                },
            }, { quoted: quotedd })
}
return conn.sendMessage(jid, {
            text: teks,
            contextInfo: {
                mentionedJid: conn.parseMention(teks),
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: global.setting.idch,
                   serverMessageId: null,
                   newsletterName: global.setting.namach,
                   },
                   externalAdReply: {
                   title: `${ucapan()} Kak ${conn.getName(m.sender)}`,
                   body: setting.namabot,
                   thumbnailUrl: thumb,
                   sourceUrl: setting.website,
                   mediaType: 1,
                   renderLargerThumbnail: render
                   },
                },
            }, { quoted: quotedd })
}
    function musik(jid = `${global.groub}`, link, quotedd = m, berkas = false) {
    const userMenu = global.db.data.settings[conn.user.jid].menu
    if (userMenu === "button") {
    return conn.sendMessage(jid, { 
                audio: {url: link}, 
                mimetype: "audio/mpeg",
                ptt: berkas
                },{ quoted: quotedd })
    }
        return conn.sendMessage(jid, { 
                audio: {url: link}, 
                mimetype: "audio/mpeg",
                ptt: berkas,
                contextInfo: {
mentionedJid: [m.sender], 
    forwardingScore: 9999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: global.setting.idch,
      serverMessageId: 103,
      newsletterName: global.setting.namach
    },
    externalAdReply: {
title: setting.namabot, 
body: setting.namaowner, 
sourceUrl: setting.website,
thumbnailUrl: setting.tampilan, 
renderLargerThumbnail: false
}, 
}}, { quoted: quotedd })
}

function RafiCostum(jid = `${global.groub}`, teks, title = `${ucapan()} Kak ${conn.getName(m.sender)}`, body = setting.namabot, thumb = imagepp, render = true, quotedd = m ) {
conn.sendMessage(jid, {
            text: teks,
            contextInfo: {
                mentionedJid: conn.parseMention(teks),
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: setting.idch,
                   serverMessageId: null,
                   newsletterName: setting.namach,
                   },
                   externalAdReply: {
                   title: title,
                   body: body,
                   thumbnailUrl: thumb,
                   sourceUrl: setting.website,
                   mediaType: 1,
                   renderLargerThumbnail: render
                   },
                },
            }, { quoted: quotedd })
}

async function Jadisticker(url, quotedd = m) {
let response = await axios.get(url, { responseType: 'arraybuffer' })
      let Stiker = await sticker(response.data, false, stickpack, stickauth)
      await conn.sendMessage(m.chat, { 
      sticker: Stiker,
      contextInfo: {
                mentionedJid: [],
                forwardingScore: 1,
                isForwarded: true,
                   forwardedNewsletterMessageInfo: {
                   newsletterJid: setting.idch,
                   serverMessageId: null,
                   newsletterName: setting.namach,
                   },
                },
       }, { quoted: quotedd });
}
function Potopp(jid) {
conn.profilePictureUrl(jid, 'image').catch(_ => "https://files.catbox.moe/itl427.jpg")
}

async function Mentions(text) {
const participantss = (await conn.groupMetadata(m.chat)).participants
    let orang = null;
    if (m.quoted) return orang = m.quoted.sender
    if (!text) {
    orang = m.sender
    } else {
    const mentionedUser = text.match(/@([0-9]{7,16})/);  // Regex untuk menangkap mention ID
      const mentionedUserId = mentionedUser[1]
      orang = participantss.find(user => user.id.includes(mentionedUserId))?.jid
}
return orang
}

async function groupStatus(sock, jid, content) {
    const inside = await generateWAMessageContent(content, {
        upload: sock.waUploadToServer
    })
    const messageSecret = crypto.randomBytes(32)
    const m = generateWAMessageFromContent(jid, {
        messageContextInfo: {
            messageSecret
        },
        groupStatusMessageV2: {
            message: {
                ...inside,
                messageContextInfo: {
                    messageSecret
                }
            }
        }
    }, {})
    await sock.relayMessage(jid, m.message, {
        messageId: m.key.id
    })
    return m
}
async function Func_fetch(url) {
let json = await (await fetch(url)).json()
m.reply(json)
}
function ucpn() {
  const time = moment.tz("Asia/Jakarta").format("HH");
  let res = "Selamat Menjelang Pagi";
  if (time >= 4) {
    res = "Selamat Pagi";
  }
  if (time >= 10) {
    res = "Selamat Siang";
  }
  if (time >= 15) {
    res = "Selamat Sore";
  }
  if (time >= 18) {
    res = "Selamat Malam";
  }
  return res;
}
function Delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

     // Pengubah Function Jadi Global //
global.rafitampilan = RafiTampilan
global.rafimenu = RafiMenu
global.musik = musik
global.raficostum = RafiCostum
global.jadisticker = await Jadisticker
global.fotopp = Potopp
global.mention = Mentions
global.swgc = groupStatus
global.ucapan = ucpn
global.funcget = Func_fetch
global.groub = m.chat
global.delay = Delay
global.user = db.data.users[m.sender]
global.group = db.data.chats[m.chat]
}
export default handler