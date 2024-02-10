let { exec } = require('child_process');
let fs = require('fs');
let installer = require('@ffmpeg-installer/ffmpeg');
let ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(installer.path);

module.exports = {
  command: 'trim',
  info: 'Trims replied video or audio from given timeline.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.replied) return await msg.reply({ text: '*Please reply to any audio or video!*' });
    if (!text) return await msg.reply({ text: '*Please give a timeline to trim!*\n\n*Example:*\n*' + (process.env.PREFIX || '/') + 'cut 0:05 0:09*\n*' + (process.env.PREFIX || '/') + 'cut 1:05 1:30*' });
    if (!msg.replied.audio && !msg.replied.video) return await msg.reply({ text: '*Reply to any video or audio only!*' });

    let start = '00:00', end = '00:00';
    if (text.includes(' ')) {
     [start, end] = text.split(' ');
    } else {
     end = text;
    }
    let trimming = await msg.reply({ text: '*Trimming... [ 0% / 0KB ]*' });
    let media = await msg.load(msg.replied.audio ? msg.replied.audio : msg.replied.video);
    let ext = msg.replied.audio ? '.mp3' : '.mp4';
    fs.writeFileSync('media'+ext, media);
    
    ffmpeg(`media${ext}`)
     .inputOptions([`-ss ${start}`, `-to ${end}`])
     .output(`output${ext}`)
     .on('end', async () => {
       if (msg.replied.audio) {
         return msg.reply({ audio: fs.readFileSync('output'+ext) });
       }
       else {
         return await msg.reply({ video: fs.readFileSync('output'+ext) });
       }
     })
     .on('progress', async (progress) => {
       await msg.reply({ edit: {
         key: trimming.key,
         text: '*Trimming... [ ' + (progress.percent ? progress.percent.toFixed(2) : 0) + '% / ' + (progress.targetSize ? progress.targetSize : 0) + 'KB ]*'
        }
      })
     })
     .on('error', async (err) => {
       return await msg.reply({ edit: { key: trimming.key, text: '*Start time is greater than end time!*' } });
     }).run();
  }
};
                                       
