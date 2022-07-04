const formatMoney = (num, comma) => {
  let money_number = '0';
  let thousandsSeparator = comma ? ',' : '.';
  try {
    money_number = String(num)
      .split('.')[0]
      .replace(/[^\d-]/g, '')
      .replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  } catch (e) {
    return '0';
  }
  return money_number;
};

module.exports = {formatMoney};
