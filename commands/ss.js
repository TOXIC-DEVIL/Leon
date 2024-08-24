module.exports = {
  command: 'ss',
  info: 'Captures the screenshot of the given URL.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter a URL to capture a screenshot!*\n*Example:* https://google.com/' });
    let regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    if (!text.match(regex)) return await msg.reply({ text: '*Invalid URL, Please enter a valid URL to capture a screenshot!*' });
    let url = text.match(regex)[0];
    let devreg = /\{(phone|mobile|tab|tablet|desktop)\}/;
    let device = text.match(devreg) ? text.match(devreg)[1] : 'desktop';
    await msg.reply({
      image: {
        url: `https://api.screenshotmachine.com/?key=09ccde&url=${url}&device=${device}&dimension=${
          (device == 'phone' || device == 'mobile') ? '480x800' : 
          (device == 'tab' || device == 'tablet') ? '800x1280' : '1024x768'
        }`
      }
    }).catch(async () => {
      return await msg.reply({ text: '*Failed to capture screenshot. Please check the URL and try again!*' });
    });
  }
};
