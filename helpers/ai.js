const { RsnChat } = require('rsnchat');
let { gpt, gemini, dalle } = new RsnChat('rsnai_hMCzXCerezIAEr91cdCfT2jt');

async function ai(type, prompt) {
  try {
    type = type.toLowerCase();
    let result;
    if (type == 'chatgpt') {
      result = await gpt(prompt).message;
    } else if (type == 'gemini') {
      result = await gemini(prompt).message;
    } else if (type == 'dalle') {
      result = await dalle(prompt).url;
    }
    return result || false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

module.exports = { 
  ai
};
