const {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  PHONENUMBER_MCC: MCC_BAILEYS
} = await import('@adiwajshing/baileys')

import pino from "pino"
import qrcode from "qrcode"
import fs from "fs"
import path from "path"
import { makeWASocket, protoType, serialize } from '../Perangkat_Keras/Komponen/simple.js'

let bots = {}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Masukkan nomor!\nContoh: .jadibot 628xxxx")

  let nomor = text.replace(/[^0-9]/g, "")
  if (bots[nomor]) return m.reply("Nomor sudah aktif jadi bot!")

  let sessionPath = path.join("./Cache/Jadibot/", nomor)
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true })
  }

  const { version, isLatest } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
const connectionOptions = {
  version,
  logger: pino({ level: 'silent' }),
  printQRInTerminal: false,
  // Optional If Linked Device Could'nt Connected
  // browser: ['Mac OS', 'chrome', '125.0.6422.53']
  browser: ['Mac OS', 'safari', '5.1.10'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino().child({
      level: 'silent',
      stream: 'store'
    })),
  },
  getMessage: async key => {
    const messageData = await store.loadMessage(key.remoteJid, key.id);
    return messageData?.message || undefined;
  },
  generateHighQualityLinkPreview: true,
  patchMessageBeforeSending: (message) => {
    const requiresPatch = !!(
      message.buttonsMessage
      || message.templateMessage
      || message.listMessage
    );
    if (requiresPatch) {
      message = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 2,
              deviceListMetadata: {},
            },
            ...message,
          },
        },
      };
    }

    return message;
  },
  connectTimeoutMs: 60000, defaultQueryTimeoutMs: 0, generateHighQualityLinkPreview: true, syncFullHistory: true, markOnlineOnConnect: true
}

global.conn = makeWASocket(connectionOptions)
await conn.requestPairingCode(nomor, 'RAFIBAIL')
  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      let qrImage = await qrcode.toBuffer(qr)
      await conn.sendMessage(m.chat, {
        image: qrImage,
        caption: `Scan QR untuk nomor ${nomor}`
      }, { quoted: m })
    }

    if (connection === "open") {
      await conn.sendMessage(m.chat, {
        text: `✅ Berhasil jadi bot: ${nomor}`
      }, { quoted: m })
    }

    if (connection === "close") {
      let reason = lastDisconnect?.error?.output?.statusCode
      if (reason !== DisconnectReason.loggedOut) {
        m.reply(`Bot ${nomor} terputus, mencoba reconnect...`)
      } else {
        delete bots[nomor]
        fs.rmSync(sessionPath, { recursive: true, force: true })
        m.reply(`Session ${nomor} logout & dihapus.`)
      }
    }
  })
}

handler.command = ["jadibot"]
handler.rowner = true

export default handler