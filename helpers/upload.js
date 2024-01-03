const axios = require('axios');
const FormData = require('form-data');
const mime = require('mime-to-extensions');

async function telegraph(media) {
  let form = new FormData();
  form.append("file", Buffer.from(media, "base64"), {
    filename: `telegraph_media.${mime.extension(media.mimetype)}`,
  });
  return axios.create({ headers: form.getHeaders() }).post('https://telegra.ph/upload', form)
    .then((response) => {
      return 'https://telegra.ph' + response.data[0].src;
    })
    .catch((error) => {
      return false;
    });
}

module.exports = { telegraph };
