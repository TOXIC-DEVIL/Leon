const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const PAGE_SIZE = [595.28, 841.89];

module.exports = {
  command: 'pdf',
  info: 'Converts given images to pdf.',
  private: false,
  func: async (sock, msg, text) => {
    let doc = new PDFDocument({ autoFirstPage: false });
    let out = path.join(__dirname, 'output.pdf');
    let stream = fs.createWriteStream(out);
    doc.pipe(stream);

    await msg.reply({ text: '*Please send all the images together to convert to a pdf.*\n_Make sure the image is not set to view once. Best fit dimension: 595.28 × 841.89_' });
    await msg.reply({ text: '*Waiting for images...*' });

    while (true) {
      let image = await sock.awaitMessage({
        sender: msg.sender,
        chatJid: msg.chat,
        timeout: 60000,
        filter: (message) => message?.message?.imageMessage || message?.message?.extendedTextMessage?.text || message?.message?.conversation
      }, sock);

      if ((image.message.hasOwnProperty('extendedTextMessage') || image.message.hasOwnProperty('conversation')) && (image?.message?.extendedTextMessage?.text || image?.message?.conversation) === 'finish') {
        break;
      } else if (image.message?.imageMessage) {
        let img = await msg.load(image.message.imageMessage);

        doc.addPage();
        doc.image(img, 0, 0, { fit: PAGE_SIZE, align: 'center', valign: 'center' });

        await msg.reply({ text: '*Image saved!*\n_Send another image if you want to add to pdf or send \'finish\' to convert saved image(s) to pdf._' });
      }
    }

    doc.end();
    stream.on('finish', async () => 
      await msg.reply({ document: fs.readFileSync(out), fileName: 'Leon-' + ((Math.random() + 1).toString(36).substring(7)).toUpperCase(), mimetype: 'application/pdf' })
    );

    stream.on('error', async (error) => {
      console.log(error);
      await msg.reply({ text: '*There was an error creating the PDF. Please try again.*' });
    });
  }
};
