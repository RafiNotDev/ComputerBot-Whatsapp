import axios from "axios";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const fontArabPath = "./Storage/Fonts/teks1.ttf";
const fontLatinPath = "./Storage/Fonts/teks2.ttf";

const createPDF = (title, contentLines) => {
    return new Promise(resolve => {
        const doc = new PDFDocument({ margin: 40 });
        let buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => resolve(Buffer.concat(buffers)));

        const hasArabFont = fs.existsSync(fontArabPath);
        const hasLatinFont = fs.existsSync(fontLatinPath);

        if (hasLatinFont) doc.font(fontLatinPath);
        doc.fontSize(20).text(title, { align: "center" });
        doc.moveDown();

        contentLines.forEach(line => {
            if (line.type === "arab") {
                if (hasArabFont) doc.font(fontArabPath);
                doc.fontSize(14).text(line.text, {
                    align: "right",
                    features: ["rtla"]
                });
            } else {
                if (hasLatinFont) doc.font(fontLatinPath);
                doc.fontSize(12).text(line.text, { align: "left" });
            }
            doc.moveDown(0.5);
        });

        doc.end();
    });
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let action = args[0] ? args[0].toLowerCase() : "menu";

    let selectedId =
        m.message?.interactiveResponseMessage?.nativeFlowResponseMessage
            ?.paramsJson;
    if (selectedId) {
        try {
            let parsed = JSON.parse(selectedId);
            if (parsed.id) {
                let extractedArgs = parsed.id.split(" ").slice(1);
                if (extractedArgs.length > 0) {
                    action = extractedArgs[0];
                    args = extractedArgs;
                }
            }
        } catch (e) {}
    }

    if (action === "menu") {
        let waitMsg = await conn.sendMessage(
            m.chat,
            {
                text: "*Sistem Memproses*\nMengambil daftar Surah Al-Qur'an dari server. Mohon tunggu."
            },
            { quoted: m }
        );

        try {
            const { data } = await axios.get(`https://equran.id/api/v2/surat`);
            const listSurat = data.data;

            let buildSections = (chunk, startIdx) => {
                let secs = [];
                for (let i = 0; i < chunk.length; i += 20) {
                    let c = chunk.slice(i, i + 20);
                    secs.push({
                        title: `SURAH ${startIdx + i} - ${startIdx + i + c.length - 1}`,
                        rows: c.map(s => ({
                            header: `Surah ${s.nomor} | ${s.tempatTurun}`,
                            title: s.namaLatin,
                            description: `Arti: ${s.arti} | Total: ${s.jumlahAyat} Ayat`,
                            id: `${usedPrefix}${command} listayat ${s.nomor}`
                        }))
                    });
                }
                return secs;
            };

            let sectionsArray = [
                {
                    title: "Daftar Surah 1 - 60",
                    rows: buildSections(listSurat.slice(0, 60), 1).flatMap(
                        s => s.rows
                    )
                },
                {
                    title: "Daftar Surah 61 - 114",
                    rows: buildSections(listSurat.slice(60, 114), 61).flatMap(
                        s => s.rows
                    )
                },
                {
                    title: "Fitur Tambahan",
                    rows: [
                        {
                            header: "Tafsir Kemenag RI",
                            title: "Buka Tafsir Surah",
                            description: "Membaca penjelasan detail surah",
                            id: `${usedPrefix}${command} tafsir`
                        }
                    ]
                }
            ];

            let caption = `*A L - Q U R ' A N   D I G I T A L*\n\n> Akses daftar surah dan tafsir melalui menu interaktif di bawah.`;

            await conn.sendMessage(
                m.chat,
                {
                    text: caption,
                    footer: "Islamic Engine API",
                    nativeFlow: [
                        { text: "Katalog Surah", sections: sectionsArray }
                    ],
                    interactiveAsTemplate: false
                },
                { quoted: m }
            );

            return conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (e) {
            console.error(e);
            return conn.sendMessage(m.chat, {
                text: "*Sistem Error*\nGagal mengambil daftar surah dari server eQuran.",
                edit: waitMsg.key
            });
        }
    }

    if (action === "tafsir" && !args[1]) {
        let waitMsg = await conn.sendMessage(
            m.chat,
            {
                text: "*Sistem Memproses*\nMengambil daftar tafsir surah. Mohon tunggu."
            },
            { quoted: m }
        );

        try {
            const { data } = await axios.get(`https://equran.id/api/v2/surat`);
            const listSurat = data.data;

            let buildSections = (chunk, startIdx) => {
                let secs = [];
                for (let i = 0; i < chunk.length; i += 20) {
                    let c = chunk.slice(i, i + 20);
                    secs.push({
                        title: `TAFSIR ${startIdx + i} - ${startIdx + i + c.length - 1}`,
                        rows: c.map(s => ({
                            header: `Surah ${s.nomor}`,
                            title: `Tafsir ${s.namaLatin}`,
                            description: `Detail tafsir untuk ${s.jumlahAyat} Ayat`,
                            id: `${usedPrefix}${command} listtafsir ${s.nomor}`
                        }))
                    });
                }
                return secs;
            };

            let sectionsArray = [
                {
                    title: "Katalog Tafsir 1 - 60",
                    rows: buildSections(listSurat.slice(0, 60), 1).flatMap(
                        s => s.rows
                    )
                },
                {
                    title: "Katalog Tafsir 61 - 114",
                    rows: buildSections(listSurat.slice(60, 114), 61).flatMap(
                        s => s.rows
                    )
                }
            ];

            await conn.sendMessage(
                m.chat,
                {
                    text: `*T A F S I R   A L - Q U R ' A N*\n\n> Pilih surah untuk membaca tafsir melalui menu interaktif di bawah.`,
                    footer: "Kemenag RI API",
                    nativeFlow: [
                        { text: "Katalog Tafsir", sections: sectionsArray }
                    ],
                    interactiveAsTemplate: false
                },
                { quoted: m }
            );

            return conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (e) {
            return conn.sendMessage(m.chat, {
                text: "*Sistem Error*\nGagal mengambil daftar tafsir.",
                edit: waitMsg.key
            });
        }
    }

    if (action === "listayat" && args[1]) {
        let nomorSurah = parseInt(args[1]);
        let waitMsg = await conn.sendMessage(
            m.chat,
            {
                text: "*Sistem Memproses*\nMembuka direktori ayat. Mohon tunggu."
            },
            { quoted: m }
        );

        try {
            const { data } = await axios.get(
                `https://equran.id/api/v2/surat/${nomorSurah}`
            );
            const res = data.data;

            let sectionsArray = [];
            let chunkSize = 90;

            for (let i = 0; i < res.ayat.length; i += chunkSize) {
                let chunk = res.ayat.slice(i, i + chunkSize);
                let start = i + 1;
                let end = i + chunk.length;

                let rows = chunk.map(a => ({
                    header: `Ayat ${a.nomorAyat}`,
                    title: `Baca Ayat ${a.nomorAyat}`,
                    description: a.teksIndonesia.slice(0, 50) + "...",
                    id: `${usedPrefix}${command} getayat ${nomorSurah} ${a.nomorAyat}`
                }));

                if (i + chunkSize >= res.ayat.length) {
                    rows.push({
                        header: "Dokumen Lengkap",
                        title: "Baca Full Surah",
                        description:
                            "Tampilkan seluruh ayat dalam satu halaman",
                        id: `${usedPrefix}${command} getfull ${nomorSurah}`
                    });
                }

                sectionsArray.push({
                    title: `Ayat ${start} - ${end}`,
                    rows: rows
                });
            }

            let caption =
                `*S U R A H   ${res.namaLatin.toUpperCase()}*\n\n` +
                `*Detail Surah*\n` +
                `> *Nama* : ${res.nama}\n` +
                `> *Arti* : ${res.arti}\n` +
                `> *Turun* : ${res.tempatTurun}\n` +
                `> *Total* : ${res.jumlahAyat} Ayat\n\n` +
                `_Pilih ayat atau baca secara utuh melalui menu di bawah._`;

            await conn.sendMessage(
                m.chat,
                {
                    text: caption,
                    footer: "Islamic Engine API",
                    nativeFlow: [
                        { text: "Daftar Ayat", sections: sectionsArray }
                    ],
                    interactiveAsTemplate: false
                },
                { quoted: m }
            );

            return conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (e) {
            return conn.sendMessage(m.chat, {
                text: "*Sistem Error*\nGagal memuat daftar ayat.",
                edit: waitMsg.key
            });
        }
    }

    if (action === "listtafsir" && args[1]) {
        let nomorSurah = parseInt(args[1]);
        let waitMsg = await conn.sendMessage(
            m.chat,
            {
                text: "*Sistem Memproses*\nMembuka direktori tafsir. Mohon tunggu."
            },
            { quoted: m }
        );

        try {
            const { data } = await axios.get(
                `https://equran.id/api/v2/tafsir/${nomorSurah}`
            );
            const res = data.data;

            let sectionsArray = [];
            let chunkSize = 90;

            for (let i = 0; i < res.tafsir.length; i += chunkSize) {
                let chunk = res.tafsir.slice(i, i + chunkSize);
                let start = i + 1;
                let end = i + chunk.length;

                let rows = chunk.map(t => ({
                    header: `Tafsir Ayat ${t.ayat}`,
                    title: `Tafsir Ayat ${t.ayat}`,
                    description: "Penjelasan rinci Kemenag RI",
                    id: `${usedPrefix}${command} gettafsirayat ${nomorSurah} ${t.ayat}`
                }));

                if (i + chunkSize >= res.tafsir.length) {
                    rows.push({
                        header: "Dokumen Lengkap",
                        title: "Baca Full Tafsir",
                        description:
                            "Tampilkan seluruh tafsir dalam satu halaman",
                        id: `${usedPrefix}${command} gettafsirfull ${nomorSurah}`
                    });
                }

                sectionsArray.push({
                    title: `Tafsir Ayat ${start} - ${end}`,
                    rows: rows
                });
            }

            let caption =
                `*T A F S I R   ${res.namaLatin.toUpperCase()}*\n\n` +
                `> Menampilkan tafsir surah berdasarkan Kemenag RI.\n\n` +
                `_Pilih tafsir per ayat melalui menu di bawah._`;

            await conn.sendMessage(
                m.chat,
                {
                    text: caption,
                    footer: "Kemenag RI API",
                    nativeFlow: [
                        { text: "Daftar Tafsir", sections: sectionsArray }
                    ],
                    interactiveAsTemplate: false
                },
                { quoted: m }
            );

            return conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (e) {
            return conn.sendMessage(m.chat, {
                text: "*Sistem Error*\nGagal memuat direktori tafsir.",
                edit: waitMsg.key
            });
        }
    }

    if (action === "getayat" && args[1] && args[2]) {
        let nomorSurah = parseInt(args[1]);
        let nomorAyat = parseInt(args[2]);

        let waitMsg = await conn.sendMessage(
            m.chat,
            {
                text: "*Sistem Memproses*\nMengekstrak teks dan audio ayat. Mohon tunggu."
            },
            { quoted: m }
        );

        try {
            const { data } = await axios.get(
                `https://equran.id/api/v2/surat/${nomorSurah}`
            );
            const res = data.data;
            let ayatData = res.ayat.find(a => a.nomorAyat === nomorAyat);

            let txt =
                `*A L - Q U R ' A N*\n\n` +
                `*Surah ${res.namaLatin} - Ayat ${nomorAyat}*\n\n` +
                `${ayatData.teksArab}\n\n` +
                `> *Latin* : ${ayatData.teksLatin}\n` +
                `> *Arti* : ${ayatData.teksIndonesia}\n\n` +
                `_Berkas audio sedang dikirim..._`;

            await conn.sendMessage(m.chat, { text: txt }, { quoted: m });

            if (ayatData.audio["05"]) {
                await conn.sendMessage(
                    m.chat,
                    {
                        audio: { url: ayatData.audio["05"] },
                        mimetype: "audio/mp4",
                        ptt: false
                    },
                    { quoted: m }
                );
            }

            return conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (e) {
            return conn.sendMessage(m.chat, {
                text: "*Sistem Error*\nGagal mengambil detail ayat.",
                edit: waitMsg.key
            });
        }
    }

    if (action === "gettafsirayat" && args[1] && args[2]) {
        let nomorSurah = parseInt(args[1]);
        let nomorAyat = parseInt(args[2]);

        let waitMsg = await conn.sendMessage(
            m.chat,
            {
                text: "*Sistem Memproses*\nMengekstrak teks tafsir. Mohon tunggu."
            },
            { quoted: m }
        );

        try {
            const { data } = await axios.get(
                `https://equran.id/api/v2/tafsir/${nomorSurah}`
            );
            const res = data.data;
            let tafsirData = res.tafsir.find(t => t.ayat === nomorAyat);

            let txt =
                `*T A F S I R   K E M E N A G*\n\n` +
                `*Surah ${res.namaLatin} - Ayat ${nomorAyat}*\n\n` +
                `${tafsirData.teks}`;

            await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
            return conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (e) {
            return conn.sendMessage(m.chat, {
                text: "*Sistem Error*\nGagal memuat detail tafsir.",
                edit: waitMsg.key
            });
        }
    }

    if (action === "getfull" && args[1]) {
        let nomorSurah = parseInt(args[1]);
        let waitMsg = await conn.sendMessage(
            m.chat,
            {
                text: "*Sistem Memproses*\nMengekstrak seluruh teks dan merakit dokumen. Mohon tunggu."
            },
            { quoted: m }
        );

        try {
            const { data } = await axios.get(
                `https://equran.id/api/v2/surat/${nomorSurah}`
            );
            const res = data.data;

            let txt =
                `*A L - Q U R ' A N*\n\n` +
                `*Identitas Surah*\n` +
                `> *Surah* : ${res.namaLatin} (${res.nama})\n` +
                `> *Arti* : ${res.arti}\n` +
                `> *Total* : ${res.jumlahAyat} Ayat\n\n` +
                `---\n\n`;

            let pdfLines = [
                {
                    type: "latin",
                    text: `Surah: ${res.namaLatin} (${res.nama})`
                },
                { type: "latin", text: `Arti: ${res.arti}` },
                { type: "latin", text: `Turun di: ${res.tempatTurun}` },
                {
                    type: "latin",
                    text: "------------------------------------------------"
                }
            ];

            res.ayat.forEach(a => {
                txt += `*Ayat ${a.nomorAyat}:*\n${a.teksArab}\n\n> *Latin* : ${a.teksLatin}\n> *Arti* : ${a.teksIndonesia}\n\n---\n\n`;

                pdfLines.push({ type: "latin", text: `Ayat ${a.nomorAyat}:` });
                pdfLines.push({ type: "arab", text: a.teksArab });
                pdfLines.push({ type: "latin", text: `Baca: ${a.teksLatin}` });
                pdfLines.push({
                    type: "latin",
                    text: `Arti: ${a.teksIndonesia}`
                });
                pdfLines.push({
                    type: "latin",
                    text: "------------------------------------------------"
                });
            });

            if (txt.length > 15000) {
                let pdfBuffer = await createPDF(
                    `Surah ${res.namaLatin}`,
                    pdfLines
                );
                await conn.sendMessage(
                    m.chat,
                    {
                        document: pdfBuffer,
                        mimetype: "application/pdf",
                        fileName: `Surah_${res.namaLatin}.pdf`,
                        caption: `*D O K U M E N   S U R A H*\n\n> Teks surah terlalu panjang. Berkas telah dirakit ke dalam PDF agar mudah dibaca.`
                    },
                    { quoted: m }
                );
            } else {
                await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
            }

            if (res.audioFull && res.audioFull["05"]) {
                await conn.sendMessage(
                    m.chat,
                    {
                        audio: { url: res.audioFull["05"] },
                        mimetype: "audio/mp4",
                        ptt: false
                    },
                    { quoted: m }
                );
            }

            return conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (e) {
            console.error(e);
            return conn.sendMessage(m.chat, {
                text: "*Sistem Error*\nGagal mengambil data full surah.",
                edit: waitMsg.key
            });
        }
    }

    if (action === "gettafsirfull" && args[1]) {
        let nomorSurah = parseInt(args[1]);
        let waitMsg = await conn.sendMessage(
            m.chat,
            {
                text: "*Sistem Memproses*\nMengekstrak seluruh teks tafsir dan merakit dokumen. Mohon tunggu."
            },
            { quoted: m }
        );

        try {
            const { data } = await axios.get(
                `https://equran.id/api/v2/tafsir/${nomorSurah}`
            );
            const res = data.data;

            let txt =
                `*T A F S I R   A L - Q U R ' A N*\n\n` +
                `> *Surah* : ${res.namaLatin}\n` +
                `> *Turun di* : ${res.tempatTurun}\n\n` +
                `---\n\n`;

            let pdfLines = [
                { type: "latin", text: `T A F S I R   A L - Q U R ' A N` },
                { type: "latin", text: `Surah: ${res.namaLatin}` },
                { type: "latin", text: `Turun di: ${res.tempatTurun}` },
                {
                    type: "latin",
                    text: "------------------------------------------------"
                }
            ];

            res.tafsir.forEach(t => {
                txt += `*Tafsir Ayat ${t.ayat}:*\n${t.teks}\n\n---\n\n`;

                pdfLines.push({
                    type: "latin",
                    text: `Tafsir Ayat ${t.ayat}:`
                });

                let paragraphs = t.teks.split("\n");
                paragraphs.forEach(p => {
                    if (!p.trim()) return;
                    if (/[\u0600-\u06FF]/.test(p)) {
                        pdfLines.push({ type: "arab", text: p });
                    } else {
                        pdfLines.push({ type: "latin", text: p });
                    }
                });

                pdfLines.push({
                    type: "latin",
                    text: "------------------------------------------------"
                });
            });

            if (txt.length > 15000) {
                let pdfBuffer = await createPDF(
                    `Tafsir Surah ${res.namaLatin}`,
                    pdfLines
                );
                await conn.sendMessage(
                    m.chat,
                    {
                        document: pdfBuffer,
                        mimetype: "application/pdf",
                        fileName: `Tafsir_Surah_${res.namaLatin}.pdf`,
                        caption: `*D O K U M E N   T A F S I R*\n\n> Teks tafsir terlalu panjang. Berkas telah dirakit ke dalam PDF agar mudah dibaca.`
                    },
                    { quoted: m }
                );
            } else {
                await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
            }

            return conn.sendMessage(m.chat, { delete: waitMsg.key });
        } catch (e) {
            return conn.sendMessage(m.chat, {
                text: "*Sistem Error*\nGagal mengambil data full tafsir.",
                edit: waitMsg.key
            });
        }
    }
};

handler.command = ["quran", "alquran"];
handler.tags = ["tools"];
handler.help = ["quran", "quran tafsir"];
handler.limit = false;

export default handler;