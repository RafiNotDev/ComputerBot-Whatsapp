import uploadImage from '../Perangkat_Keras/Komponen/uploadImage.js'
import uploadFile from '../Perangkat_Keras/Komponen/uploadFile.js'

import axios from 'axios'
import FormData from 'form-data'

const handler = async (m, { conn, isAdmin, isOwner, isBotAdmin }) => {
  if (!m.isGroup) return
  const chat = global.db.data.chats[m.chat]
  const {
        mtype,
        text,
        sender
    } = m
  if (!chat.antiPorn) return

  if (mtype === 'imageMessage' || mtype === 'videoMessage' || mtype === 'stickerMessage') {
            //code
            const media = await m.download()
            let url
            if (mtype === 'imageMessage' || mtype === 'videoMessage') {
                url = await uploadImage(media)
            } else if (mtype === 'stickerMessage') {
                url = await uploadFile(media)
            }
try {
    const { data } = await axios.get('https://api.deline.web.id/ai/nsfwcheck', {
      params: { url }
    })

    if (!data?.status) return

    const label = data.result?.labelName
    const confidence = data.result?.confidence || 0

    if (label === 'Porn' && confidence > 0.7) {
      await conn.sendMessage(m.chat, {
        text: `🚫 terdeteksi NSFW ygy harap waspada sama \n@${m.sender.split('@')[0]} gausah cabul di grup kocak`,
        mentions: [m.sender]
      }, { quoted: m })

      if (isBotAdmin) {
        await conn.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.sender
          }
        })
      }
    }

  } catch (e) {
    console.error('ANTINSFW ERROR:', e.message)
  }
}
}
handler.before = handler
export default handler