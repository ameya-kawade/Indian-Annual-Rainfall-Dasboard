import React from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle, HelpCircle } from 'lucide-react';

const PTestExplanation = ({ result }) => {
  if (!result) return null;

  const formatPValue = (p) => {
    if (p < 0.0001) return "< 0.0001";
    if (p > 0.9999) return "> 0.9999";
    return p.toFixed(4);
  };

  return (
    <motion.div 
      className="p-test-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <HelpCircle color="var(--primary)" />
        One-Sample T-Test Walkthrough
      </h2>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Is the annual rainfall in this region significantly higher than <strong>{result.threshold}mm</strong>?
      </p>

      <div className="step-list">
        <Step 
          number="1" 
          title="State the Hypotheses"
          description="The Null Hypothesis (H₀) assumes there is no significant difference, while the Alternative Hypothesis (H₁) represents the claim we are testing."
          formula={`H₀: μ ≤ ${result.threshold}, H₁: μ > ${result.threshold}`}
        />
        
        <Step 
          number="2" 
          title="Calculate the Sample Mean"
          description="The average rainfall is calculated by summing all annual records and dividing by the number of years."
          formula={`x̄ = Σx / n = ${result.mean.toFixed(2)}mm`}
        />

        <Step 
          number="3" 
          title="Standard Error (SE)"
          description="Standard Error measures how much the sample mean is expected to vary from the actual population mean, based on the standard deviation (SD) and sample size (n)."
          formula={`SE = SD / √n = ${result.sd.toFixed(2)} / √${result.n} = ${result.se.toFixed(2)}`}
        />

        <Step 
          number="4" 
          title="T-Statistic"
          description="The T-score represents how many standard errors the sample mean is away from the threshold. A larger T-score provides stronger evidence against the Null Hypothesis."
          formula={`T = (x̄ - μ₀) / SE = (${result.mean.toFixed(2)} - ${result.threshold}) / ${result.se.toFixed(2)} = ${result.tStat.toFixed(2)}`}
        />

        <Step 
          number="5" 
          title="Determine the P-Value"
          description="We use an exponential function to calculate the probability (p-value) based on our T-score. This tells us how likely the result is to be a random fluke."
          formula={`P ≈ 1 / (1 + e^(1.654 * ${result.tStat.toFixed(2)})) = ${formatPValue(result.pValue)}`}
        />
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        background: result.isSignificant ? '#dcfce7' : '#f1f5f9',
        border: `1px solid ${result.isSignificant ? '#15803d' : '#cbd5e1'}`,
        color: result.isSignificant ? '#15803d' : '#475569'
      }}>
        <h4 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {result.isSignificant ? <CheckCircle size={20} /> : <Info size={20} />}
          Conclusion: {result.isSignificant ? 'Significant Result' : 'Not Significant'}
        </h4>
        <p style={{ marginTop: '0.5rem', fontSize: '0.95rem', lineHeight: 1.5 }}>
          {result.isSignificant 
            ? `The p-value (${formatPValue(result.pValue)}) is below the 0.05 threshold. This indicates that the observed rainfall of ${result.mean.toFixed(2)}mm is significantly higher than ${result.threshold}mm and is unlikely to be due to chance.`
            : `The p-value (${formatPValue(result.pValue)}) is above 0.05. This means there isn't enough evidence to conclude that the rainfall is significantly higher than ${result.threshold}mm; the results may be due to natural variation.`
          }
        </p>
      </div>
    </motion.div>
  );
};

const Step = ({ number, title, description, formula }) => (
  <div className="step-item">
    <div className="step-number">{number}</div>
    <div className="step-content">
      <h4>{title}</h4>
      <p>{description}</p>
      {formula && <code className="formula">{formula}</code>}
    </div>
  </div>
);

export default PTestExplanation;
