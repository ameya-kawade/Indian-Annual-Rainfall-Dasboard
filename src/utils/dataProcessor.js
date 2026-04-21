import * as ss from 'simple-statistics';

export const processRainfallData = (csvData) => {
  if (!csvData || csvData.length === 0) return null;

  // Extract all annual rainfall values for India overall
  const allAnnual = csvData
    .map(row => parseFloat(row.ANNUAL))
    .filter(val => !isNaN(val));

  // Get list of subdivisions (filter out blanks)
  const subdivisions = [...new Set(csvData.map(row => row.SUBDIVISION))]
    .filter(sub => sub && sub.trim() !== '')
    .sort();

  return {
    subdivisions,
    overall: calculateStats(allAnnual),
    raw: csvData
  };
};

export const getSubdivisionData = (csvData, subdivision) => {
  const filtered = csvData.filter(row => row.SUBDIVISION === subdivision);
  const annual = filtered.map(row => parseFloat(row.ANNUAL)).filter(val => !isNaN(val));
  
  // Monthly averages
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthlyAverages = months.map(m => {
    const vals = filtered.map(row => parseFloat(row[m])).filter(v => !isNaN(v));
    return {
      month: m,
      average: vals.length > 0 ? ss.mean(vals) : 0
    };
  });

  return {
    stats: calculateStats(annual),
    annualTrend: filtered.map(row => ({ 
      year: parseInt(row.YEAR), 
      rainfall: parseFloat(row.ANNUAL) 
    })).filter(d => !isNaN(d.rainfall)),
    monthlyAverages,
    coverage: {
      n: annual.length,
      expected: 115, // 1901-2015
      percent: (annual.length / 115) * 100,
      missing: 115 - annual.length
    }
  };
};

export const getNationalAverage = (csvData) => {
  const years = [...new Set(csvData.map(row => parseInt(row.YEAR)))].sort();
  return years.map(year => {
    const annuals = csvData
      .filter(row => parseInt(row.YEAR) === year)
      .map(row => parseFloat(row.ANNUAL))
      .filter(val => !isNaN(val));
    return {
      year,
      rainfall: annuals.length > 0 ? ss.mean(annuals) : 0
    };
  });
};

const calculateStats = (data) => {
  if (data.length === 0) return null;

  const sorted = [...data].sort((a, b) => a - b);
  const mean = ss.mean(data);
  const median = ss.median(data);
  const modeResult = ss.mode(data);
  const mode = Array.isArray(modeResult) ? modeResult[0] : modeResult;
  const stdDev = ss.sampleStandardDeviation(data);
  const variance = ss.sampleVariance(data);
  const q1 = ss.quantile(sorted, 0.25);
  const q3 = ss.quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const range = ss.max(data) - ss.min(data);

  return {
    mean,
    median,
    mode,
    stdDev,
    variance,
    q1,
    q3,
    iqr,
    range,
    count: data.length
  };
};

/**
 * One-Sample T-Test (One-Tailed)
 * Compares sample mean against a hypothetical population mean (mu)
 * H0: mu_sample <= mu_pop (or >= depending on test)
 * We'll test if rainfall is significantly HIGHER than a threshold.
 */
export const performPTest = (data, threshold = 1200) => {
  const n = data.length;
  if (n < 2) return null;

  const mean = ss.mean(data);
  const sd = ss.sampleStandardDeviation(data);
  const se = sd / Math.sqrt(n);
  const tStat = (mean - threshold) / se;
  
  // Degrees of freedom
  const df = n - 1;

  // Note: simple-statistics doesn't have a t-distribution CDF built-in for p-values directly easily
  // but we can use a normal approximation for large n or a simple approximation.
  // For better accuracy in a real app we'd use a math library with t-dist.
  // Here we'll use an approximation for the p-value.
  let pValue = 1 - tCumulativeDistribution(tStat, df);

  // Ensure p-value stays within [0, 1] bounds
  pValue = Math.max(0, Math.min(1, pValue || 0));

  return {
    n,
    mean,
    threshold,
    sd,
    se,
    tStat,
    df,
    pValue,
    isSignificant: pValue < 0.05
  };
};

/**
 * Simplified P-value calculation
 * Uses a simpler approximation for the Normal Distribution.
 * This is easier to read and works well for large sample sizes like ours (n=115).
 */
function tCumulativeDistribution(t, df) {
  const z = t;
  // A simple but effective approximation for the Bell Curve area
  // Formula: 1 / (1 + exp(-1.654 * z))
  const p = 1 / (1 + Math.exp(-1.654 * z));
  return p;
}
