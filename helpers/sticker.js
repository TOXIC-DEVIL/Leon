const webp = require('node-webpmux');
const util = require('util');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { tmpdir } = require('os');
const crypto = require('crypto');
const path = require('path');
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);

async function toSticker(type, media, exif) {
 let ext = type == 'image' ? 'jpg' : 'mp4';
 let tmpFileOut = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
 let tmpFileIn = path.join(tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${ext}`);
 fs.writeFileSync(tmpFileIn, media);
 await new Promise((resolve, reject) => {
  ffmpeg(tmpFileIn).on('error', reject).on('end', () => resolve(true)).addOutputOptions(
   ext == 'jpg' ?
    [
     "-vcodec",
     "libwebp",
     "-vf",
     "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
    ] :
    [
     "-vcodec",
     "libwebp",
     "-vf",
     "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
     "-loop",
     "0",
     "-ss",
     "00:00:00",
     "-t",
     "00:00:05",
     "-preset",
     "default",
     "-an",
     "-vsync",
     "0",
    ]
   ).toFormat('webp').save(tmpFileOut);
 });
 let buff = fs.readFileSync(tmpFileOut);
 fs.unlinkSync(tmpFileOut);
 fs.unlinkSync(tmpFileIn);
 if (!exif) {
  return buff;
 }
 else {
  return await addExif(
    buff,
    {
     packname: exif.packname,
     author: exif.author
    }
  );
 }
}

async function addExif(webpSticker, info) {
  const img = new webp.Image();
  const { packname, author, categories } = info;
  const stickerPackId = [...Array(32)].map(()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join('');
  const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': (info.packname || ''), 'sticker-pack-publisher': (info.author || ''), 'emojis': (info.categories || ['💖']), 'android-app-store-link': 'https://github.com/TOXIC-DEVIL/Leon-md', 'ios-app-store-link': 'https://github.com/TOXIC-DEVIL/Leon-md' };
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  await img.load(webpSticker)
  img.exif = exif
  return await img.save(null)
}

async function getExif(sticker) {
 let img = new webp.Image();
 await img.load(sticker);
 let json = JSON.parse(img.exif.slice(22).toString().replace('sticker-pack-name', 'sticker_pack_name').replace('sticker-pack-publisher', 'sticker_pack_publisher'));
 return { packname: json.sticker_pack_name, author: json.sticker_pack_publisher };
}

module.exports = {
 toSticker, 
 addExif, 
 getExif 
};
