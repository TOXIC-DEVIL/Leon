const acrcloud = require('acrcloud');
const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'ff489a0160188cf5f0750eaf486eee74',
  access_secret: 'ytu3AdkCu7fkRVuENhXxs9jsOW4YJtDXimAWMpJp'
});

module.exports = {
  command: 'find',
  info: 'Fetches the information of replied song.',
  private: false,
  func: async (sock, msg, text) => {
   if (!msg.replied) return await msg.reply({ text: '*Please reply to any audio!*' });
   if (!msg.replied.audio) return await msg.reply({ text: '*Reply to any audio only!*' });
   let audio = await msg.load(msg.replied.audio);
   await acr.identify(audio)
    .then(async (result) => {
      let data = result.metadata?.music[0]
      return await msg.reply({ text: `_Title_ : *${data.title}*\n_Album_ : *${data.album.name}*\n_Artists_ : *${data.artists[0].name.split('/').join(', ')}*\n_Genre_ : *${data.genres.map(genre => genre.name).join(', ')}*\n_Duration_ : *${data.duration_ms / 1000 + 's'}*\n_Release Date_ : *${data.release_date}*\n_Spotify_ : https://open.spotify.com/track/${data.external_metadata.spotify.track.id}` });
   }).catch(async (err) => {
      return await msg.reply({ text: '*Unable to find the song!*' });
   });
  }
}
