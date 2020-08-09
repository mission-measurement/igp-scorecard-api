const api = require('../helpers/apiHelpers');

const getBenchmarkData = async (outcomeid) => {
  const r = await api.get('taxonomy', 'benchmarkdata', {
    outcomeid: outcomeid,
  });
  if (r.messge) {
    return {
      minCPO: undefined,
      maxCPO: undefined,
      avgCPO: undefined,
      minER: undefined,
      maxER: undefined,
      avgER: undefined,
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
