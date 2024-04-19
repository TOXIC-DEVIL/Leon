const { RsnChat } = require('rsnchat');
let { gpt, gemini, dalle } = new RsnChat('rsnai_hMCzXCerezIAEr91cdCfT2jt');

async function ai(type, prompt) {
  try {
    type = type.toLowerCase();
    let result;
    if (type == 'chatgpt') {
      result = await gpt(prompt);
    } else if (type == 'gemini') {
      result = await gemini(prompt);
    } else if (type == 'dalle') {
      result = await dalle(prompt);
    }
    return result?.message || result?.url || false;
  } catch {
    return false;
  }
};

module.exports = { 
  ai
};
