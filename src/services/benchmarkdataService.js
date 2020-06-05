const api = require('../helpers/apiHelpers');

const getBenchmarkData = async (outcomeid) => {
  const r = await api.get('taxonomy', 'benchmarkdata', {
    outcomeid: outcomeid,
  });
  if (r.messge) {
    return {
      minCPO: 'N/A',
      maxCPO: 'N/A',
      avgCPO: 'N/A',
      minER: 'N/A',
      maxER: 'N/A',
      avgER: 'N/A',
    };
  } else {
    return {
      minCPO: parseInt(r[0].minCPO),
      maxCPO: parseInt(r[0].maxCPO),
      avgCPO: r[0].avgCPO,
      minER: parseInt(r[0].minER),
      maxER: parseInt(r[0].maxER),
      avgER: r[0].avgER,
    };
  }
};

module.exports = {
  getBenchmarkData,
};
