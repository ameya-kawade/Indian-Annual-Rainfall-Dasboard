import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ label, value, unit = 'mm', icon: Icon }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="stat-label">
        {Icon && <Icon size={16} />}
        {label}
      </div>
      <div className="stat-value">
        {typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : value}
        <span style={{ fontSize: '0.875rem', fontWeight: 500, marginLeft: '0.25rem', color: 'var(--text-muted)' }}>
          {unit}
        </span>
      </div>
    </motion.div>
  );
};

export default StatsCard;
