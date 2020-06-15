const getMonthYear = (date) => {
  months = [
    'January',
    'Feburary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let str = months[date.getMonth()] + ' ' + date.getFullYear();
  return str;
};

module.exports = {
  getMonthYear,
};
