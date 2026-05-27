<div align="center">
  <h1>ComputerBot-Whatsapp</h1>
  <p>
<a href="https://files.catbox.moe/xpm6r9.jpg">
<img src="https://files.catbox.moe/xpm6r9.jpg" alt="ComputerBot-Whatsapp"/>
</a>
  </p>
  <p>Bot Whatsapp Yang Terintegrasi Sama Rangkaian metasploit framework, server kencang Dan Stabil.</p>
  <p>
    <a href="https://github.com/RafiNotDev/ComputerBot-Whatsapp"><img alt="Stars" src="https://img.shields.io/github/stars/RafiNotDev/ComputerBot-Whatsapp?style=flat&logo=github"></a>
    <a href="https://github.com/RafiNotDev/ComputerBot-Whatsapp/network/members"><img alt="Forks" src="https://img.shields.io/github/forks/RafiNotDev/ComputerBot-Whatsapp"></a>
    <a href="https://github.com/RafiNotDev/ComputerBot-Whatsapp/issues"><img alt="Issues" src="https://img.shields.io/github/issues/RafiNotDev/ComputerBot-Whatsapp"></a>
    <a href="https://github.com/RafiNotDev/ComputerBot-Whatsapp"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/RafiNotDev/ComputerBot-Whatsapp"></a>
    <a href="https://github.com/RafiNotDev/ComputerBot-Whatsapp"><img alt="Repo Size" src="https://img.shields.io/github/repo-size/RafiNotDev/ComputerBot-Whatsapp"></a>
  </p>
  <p>
    <a href="https://github.com/RafiNotDev/ComputerBot-Whatsapp/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-informational"></a>
    <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen">
  </p>
</div>

---

## Ikhtisar

ComputerBot-Whatsapp adalah kerangka kerja bot WhatsApp ramping yang dibangun di atas Baileys. Letakkan berkas plugin di `./Perangkat_Lunak` dan itu akan menjadi Perintah Buat Fitur Fitur Yang Ada Di Script

## Mengapa ComputerBot-Whatsapp? 
- Menggunakan Baileys Resmi Dari Developer
- Desain yang mengutamakan plugin esm
- Plugin Esm Format (.js)

## Mulai Cepat

```bash
git clone https://github.com/RafiNotDev/ComputerBot-Whatsapp.git
cd ComputerBot-Whatsapp
npm install
npm start
```

Edit Di Bagian File Pengaturan.js Sebelum Menjalankan Bot


## Membuat Plugin
    Plugin Di ComputerBot-Whatsapp Ada 2 Type:
- Buat Plugin Esm `./Perangkat_Lunak/Testing.js`:

```js
import os from "os";
import { performance } from "perf_hooks";

let RafiNotDev = async (m, { msg,match,usedPrefix,noPrefix,_args,args,command,text,conn: this,ctx,sock,client,participants,isDeveloper,groupMetadata,user,RafiTampilan,RafiMenu,bot,isROwner,isOwner,isRAdmin,isAdmin,isBotAdmin,isPrems,isBans,chatUpdate }) => {
m.reply('Hai Sayang Ini RafiNotDev')
}
RafiNotDev.tags = ['RafiNotDev']
RafiNotDev.help = ['test']
RafiNotDev.command = /^(test)$/i;

export default RafiNotDev
```

## Lisensi

MIT. See [LICENSE](./LICENSE).
