const { evaluate } = require('mathjs');

module.exports = {
  command: 'math',
  info: 'Evaluates basic mathematical expressions.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter any mathematical expression to solve!*' });
    text = text
      .replace(/¹/g, '^1')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .replace(/⁴/g, '^4')
      .replace(/⁵/g, '^5')
      .replace(/⁶/g, '^6')
      .replace(/⁷/g, '^7')
      .replace(/⁸/g, '^8')
      .replace(/⁹/g, '^9')
      .replace(/⁰/g, '^0')
      .replace(/×/g, '*').replace(/·./g, '*')
      .replace(/−/g, '-')
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'pi')
      .replace(/(\d)(\()/g, '$1*(')
      .replace(/(\))(\d)/g, '$1*$2')
      .replace(/(\d)([a-zA-Z])/g, '$1*$2')
      .replace(/(\d+)%/g, '($1/100)')
      .replace(/C\((\d+),\s*(\d+)\)/g, 'combinations($1, $2)')
      .replace(/P\((\d+),\s*(\d+)\)/g, 'permutations($1, $2)')
      .replace(/\blog\(/g, 'log10(')
      .replace(/\bln\(/g, 'log(')
      .replace(/∞/g, 'Infinity');
    try {
      var solution = evaluate(text);
    } catch {
      return await msg.reply({ text: '*❌ Invalid expression, please enter a valid mathematical expression to solve!*' });
    }
    return await msg.reply({ text: '*Expression:*\n```' + text + '```\n*Solution:*\n```' + solution + '```' });
  }
};
