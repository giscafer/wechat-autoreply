const RegType = {
  stock: /^(:|：|#|\/)/,
  stockPrefix: /^#/, // 精简模式
  stockPrefix2: /^\//, // 极简模式
};

module.exports = { RegType };
