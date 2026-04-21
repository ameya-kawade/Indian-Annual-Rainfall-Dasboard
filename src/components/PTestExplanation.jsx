import React from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle, HelpCircle } from 'lucide-react';

const PTestExplanation = ({ result }) => {
  if (!result) return null;

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
          description={`We start with an assumption called the Null Hypothesis (H₀). In our case, H₀: Rainfall ≤ ${result.threshold}mm. We want to see if we have enough evidence to support the Alternative Hypothesis (H₁): Rainfall > ${result.threshold}mm.`}
        />
        
        <Step 
          number="2" 
          title="Calculate the Sample Mean"
          description={`From our ${result.n} years of data, we found an average (mean) of ${result.mean.toFixed(2)}mm.`}
        />

        <Step 
          number="3" 
          title="Standard Error (SE)"
          description="Rainfall varies every year. Standard Error tells us how much our sample mean might differ from the actual long-term population mean. It's calculated using the variation (SD) and sample size (n)."
          formula={`SE = SD / √n = ${result.sd.toFixed(2)} / √${result.n} = ${result.se.toFixed(2)}`}
        />

        <Step 
          number="4" 
          title="T-Statistic"
          description="This score tells us how many standard errors our sample mean is away from our threshold. A higher T-score means more evidence that the rainfall is truly higher."
          formula={`T = (Mean - Threshold) / SE = (${result.mean.toFixed(2)} - ${result.threshold}) / ${result.se.toFixed(2)} = ${result.tStat.toFixed(2)}`}
        />

        <Step 
          number="5" 
          title="Determine the P-Value"
          description="The P-value is the probability that we would see this result just by random chance. If it's very small (usually less than 0.05 or 5%), we say the result is 'Statistically Significant'."
          formula={`P-Value = ${result.pValue.toFixed(4)}`}
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
        <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
          {result.isSignificant 
            ? `Since the p-value (${result.pValue.toFixed(4)}) is less than 0.05, we reject the Null Hypothesis. There is strong evidence that this region receives significantly more than ${result.threshold}mm of annual rainfall.`
            : `Since the p-value (${result.pValue.toFixed(4)}) is greater than 0.05, we fail to reject the Null Hypothesis. The observed mean of ${result.mean.toFixed(2)}mm could be due to natural yearly variation.`
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
