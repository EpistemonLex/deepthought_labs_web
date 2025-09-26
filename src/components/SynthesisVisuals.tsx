'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { id: 1, content: 'Email: Q3 Report Draft', type: 'comms', key: true, position: { top: '15%', left: '10%' } },
  { id: 5, content: 'Slack: @channel please review', type: 'comms', key: false, position: { top: '5%', left: '40%' } },
  { id: 9, content: 'Email: Lunch next week?', type: 'comms', key: false, position: { top: '20%', left: '70%' } },
  { id: 2, content: 'Note: Follow up with marketing', type: 'task', key: false, position: { top: '35%', left: '80%' } },
  { id: 6, content: 'TODO: Update dependencies', type: 'task', key: false, position: { top: '55%', left: '5%' } },
  { id: 10, content: 'Task: Prepare for board meeting', type: 'task', key: false, position: { top: '85%', left: '45%' } },
  { id: 3, content: 'Chart: User Growth YoY', type: 'data', key: true, position: { top: '45%', left: '40%' } },
  { id: 7, content: 'Data: NPS Score is 45', type: 'data', key: true, position: { top: '75%', left: '15%' } },
  { id: 4, content: 'Idea: New onboarding flow', type: 'idea', key: false, position: { top: '65%', left: '60%' } },
  { id: 8, content: 'Concept: "Symbiotic Disbelief"', type: 'idea', key: false, position: { top: '90%', left: '80%' } },
];

const connections = [
  { from: 1, to: 3 },
  { from: 3, to: 7 },
  { from: 7, to: 1 },
];

const Item = ({ content, isKey, isVisible }: { content: string; isKey: boolean; isVisible: boolean }) => (
  <motion.div
    className={`bg-gray-700 border border-gray-600 rounded-md p-2 text-xs text-gray-300 shadow-lg relative`}
    animate={{
      opacity: isVisible ? 1 : 0.2,
      boxShadow: isVisible && isKey ? '0 0 15px rgba(59, 130, 246, 0.8)' : '0 0 0px rgba(59, 130, 246, 0)',
      borderColor: isVisible && isKey ? 'rgba(59, 130, 246, 0.8)' : '#4B5563',
    }}
    transition={{ duration: 0.5 }}
  >
    {content}
  </motion.div>
);

type SynthesisVisualsProps = {
  initialState?: 'default' | 'synthesized';
};

const SynthesisVisuals = ({ initialState = 'default' }: SynthesisVisualsProps) => {
  const [isInView, setIsInView] = useState(initialState === 'synthesized');

  useEffect(() => {
    if (initialState === 'synthesized') {
      setIsInView(true);
    }
  }, [initialState]);

  const keyItems = items.filter(i => i.key);

  return (
    <motion.div
      className="relative w-full max-w-3xl h-[28rem] bg-gray-800/20 rounded-lg border border-gray-700 p-4"
      onViewportEnter={() => initialState === 'default' && setIsInView(true)}
      onViewportLeave={() => initialState === 'default' && setIsInView(false)}
      viewport={{ amount: 0.6 }}
    >
      <div className="relative w-full h-full">
        {/* Items */}
        {items.map(item => (
          <motion.div
            key={item.id}
            className="absolute"
            initial={item.position}
            animate={item.position}
          >
            <Item content={item.content} isKey={item.key} isVisible={!isInView || item.key} />
          </motion.div>
        ))}

        {/* Connections */}
        <AnimatePresence>
          {isInView && (
            <svg data-testid="synthesis-connections" className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {connections.map((conn, index) => {
                const fromItem = keyItems.find(i => i.id === conn.from);
                const toItem = keyItems.find(i => i.id === conn.to);
                if (!fromItem || !toItem || !fromItem.position || !toItem.position) return null;

                // These are approximations for line start/end points
                const x1 = `${parseInt(fromItem.position.left) + 5}%`;
                const y1 = `${parseInt(fromItem.position.top) + 2}%`;
                const x2 = `${parseInt(toItem.position.left) + 5}%`;
                const y2 = `${parseInt(toItem.position.top) + 2}%`;

                return (
                  <motion.line
                    key={index}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(59, 130, 246, 0.8)"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.3 }}
                  />
                );
              })}
            </svg>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SynthesisVisuals;