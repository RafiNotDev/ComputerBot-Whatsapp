import axios from "axios";
import yts from "yt-search";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

function sanitizeFileName(name = "audio") {
  return name.replace(/[\\/:*?"<>|]/g, "").trim();
}

function runFfmpeg(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const ff = spawn("ffmpeg", [
      "-y",
      "-i", inputPath,
      "-vn",
      "-ar", "44100",
      "-ac", "2",
      "-b:a", "192k",
      outputPath
    ]);

    ff.stderr.on("data", (data) => {
      console.log("[FFMPEG]", data.toString());
    });

    ff.on("error", reject);
    ff.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("Masukkan kata kunci pencarian");

  const tmpDir = path.join(process.cwd(), "Cache/Sampah");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  let inputPath = "";
  let outputPath = "";

  try {
    await conn.sendMessage(m.chat, {
      react: { text: "🎧", key: m.key }
    });

    const results = (await yts(text)).videos || [];
    if (!results.length) return m.reply("Hasil tidak ditemukan.");

    const video = results[0];
    const { url, title, thumbnail } = video;

    const apiUrl = `https://ndikz-api.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl, {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    console.log("API RESPONSE:", data);

    const downloadUrl = data?.result?.download || data?.download;
    if (!downloadUrl) {
      return m.reply("Gagal mengambil link audio dari API.");
    }

    inputPath = path.join(tmpDir, `yt-${Date.now()}.bin`);
    outputPath = path.join(tmpDir, `yt-${Date.now()}.mp3`);

    const audioRes = await axios.get(downloadUrl, {
      responseType: "stream",
      timeout: 60000,
      maxRedirects: 5,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.youtube.com/"
      }
    });

    console.log("CONTENT-TYPE:", audioRes.headers["content-type"]);
    console.log("DOWNLOAD URL:", downloadUrl);

    await new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(inputPath);
      audioRes.data.pipe(writer);
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    await runFfmpeg(inputPath, outputPath);

    const audioBuffer = fs.readFileSync(outputPath);

    await conn.sendMessage(
      m.chat,
      {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        fileName: `${sanitizeFileName(title)}.mp3`,
        contextInfo: {
          externalAdReply: {
            title,
            body: global.setting?.namabot || "MyBot",
            mediaType: 2,
            mediaUrl: url,
            sourceUrl: url,
            thumbnailUrl: thumbnail
          }
        }
      },
      { quoted: m }
    );

    await conn.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (err) {
    console.error("PLAY ERROR:", err?.response?.data || err.message || err);

    await conn.sendMessage(m.chat, {
      react: { text: "❌", key: m.key }
    });

    m.reply("Terjadi kesalahan saat mencari atau mengunduh audio.");
  } finally {
    try {
      if (inputPath && fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (outputPath && fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch {}
  }
};

handler.help = ["play"];
handler.tags = ["downloader"];
handler.command = ["play"];
handler.limit = 5;

export default handler;