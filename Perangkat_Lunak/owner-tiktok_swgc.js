import { generateWAMessageContent, generateWAMessageFromContent } from "@adiwajshing/baileys";
import crypto from "crypto";
import fetch from "node-fetch"
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


let handler = async ( m, { conn, text, isOwner, isAdmin, args }) => {
if (!text) return m.reply('Mana Link Tiktok Nya')

    if (!text.match(/tiktok\.com/)) return m.reply('Link Mya Yang Valid Lah')

    try {
        await conn.sendMessage(m.chat, {
            react: {
                text: '🕐',
                key: m.key
            }
        })
        let url = `https://kaizenapi.my.id/api/downloader/tiktok?url=${text}`
        let json = await (await fetch(url)).json()
        let result = json.data
        let { caption, videoHD } = result
        let duration = result.music.duration
        let video = Buffer.from(videoHD)
        let payload = {
                video: { url: video },
                caption: caption || ""
            }
        await groupStatus(conn, m.chat, payload)
    } catch (e) {
        await conn.sendMessage(m.chat, {
            react: {
                text: '❌',
                key: m.key
            }
        })
        m.reply(`${e.message}`);
    } finally {
        await conn.sendMessage(m.chat, {
            react: {
                text: '✅',
                key: m.key
            }
        })
    }
}

handler.help = handler.command = ["ttswgc"]
handler.tags = ["owner"]
handler.owner = true
export default handler