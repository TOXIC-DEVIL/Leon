const { RsnChat } = require('rsnchat');
let { gpt, gemini, dalle } = new RsnChat('rsnai_hMCzXCerezIAEr91cdCfT2jt');

function ai(type, prompt) {
  type = type.toLowerCase();
  if (type == 'chatgpt') {
    return gpt(prompt)?.message || false;
  } else if (type == 'gemini') {
    return gemini(prompt)?.message || false;
  } else if (type == 'dalle') {
    return dalle(prompt)?.url || false;
  }
};

module.exports = { 
  ai
};
