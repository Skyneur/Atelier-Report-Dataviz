import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  text: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'rgba(96, 165, 250, 0.12)',
        border: '1px solid rgba(96, 165, 250, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'default',
        color: '#60a5fa',
        flexShrink: 0
      }}>
        <Info size={11} />
      </div>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 8px)',
              right: 0,
              width: '240px',
              background: '#1a1e2a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              padding: '10px 12px',
              fontSize: '0.78rem',
              lineHeight: '1.5',
              color: '#c8cdd8',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              zIndex: 100,
              pointerEvents: 'none'
            }}
          >
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              right: '7px',
              width: '9px',
              height: '9px',
              background: '#1a1e2a',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: 'none',
              borderLeft: 'none',
              transform: 'rotate(45deg)'
            }} />
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
