const g_i_s = require('g-i-s');

module.exports = {
  command: 'image',
  info: 'Searches image in google for given query.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter your query to search for image in google!*' });
    let cl;
    if (cl = text.match('\\{([0-9]{1})\\}')) {
     cl = cl[1]
    } else {
     cl = 5
    }
    await msg.reply({ text: '*Downloading ' + cl + ' images...*' });
    await g_i_s({
      searchTerm: text,
      queryStringAddition: '&safe=on'
    }, async (error, result) => {
     if (error) return await msg.reply({ text: '*Unable to find images for your query!*' });
     let count = []
     count.length = cl
     for (let c of count) {
      try {
       let url = result[Math.floor(Math.random() * result.length)]?.url
       await msg.reply({ image: { url: url } });
      } catch {}
     }
    });
   }
};
