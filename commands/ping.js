module.exports = {
  command: 'ping',
  info: 'Measures the ping.',
  private: false,
  func: async (sock, msg, text) => {
    let then = Date.now();
    let message = await msg.reply({
      text: '```Ping!```'
    });
    await msg.reply({
      delete: message
    });
    let now = Date.now();
    return await msg.reply({
      text: '*Ping!*\n```' + (now - then) + 'ms```'
    });
  }
}
