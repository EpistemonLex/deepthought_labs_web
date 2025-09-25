'use client';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FlotsamItem = ({ content }: { content: string }) => (
  <motion.div 
    className="bg-gray-700 border border-gray-600 rounded-md p-2 text-xs text-gray-300 shadow-lg"
    layout // This tells framer-motion to animate layout changes
  >
    {content}
  </motion.div>
);

const items = [
  { id: 1, content: 'Email: Q3 Report Draft', type: 'comms' },
  { id: 2, content: 'Note: Follow up with marketing', type: 'task' },
  { id: 3, content: 'Chart: User Growth YoY', type: 'data' },
  { id: 4, content: 'Idea: New onboarding flow', type: 'idea' },
  { id: 5, content: 'Slack: @channel please review', type: 'comms' },
  { id: 6, content: 'TODO: Update dependencies', type: 'task' },
  { id: 7, content: 'Data: NPS Score is 45', type: 'data' },
  { id: 8, content: 'Concept: "Symbiotic Disbelief"', type: 'idea' },
  { id: 9, content: 'Email: Lunch next week?', type: 'comms' },
  { id: 10, content: 'Task: Prepare for board meeting', type: 'task' },
];

const buckets = ['comms', 'task', 'data', 'idea'];
const bucketTitles: { [key: string]: string } = {
  comms: 'Comms',
  task: 'Tasks',
  data: 'Data',
  idea: 'Ideas',
};

const DeconstructionVisuals = () => {
  const [isSorted, setIsSorted] = useState(false);

  // Memoize the random initial positions so they don't change on re-render
  const chaosPositions = useMemo(() => 
    items.map(() => ({
      x: Math.random() * 300 - 150,
      y: Math.random() * 200 - 100,
      rotate: Math.random() * 40 - 20,
    })), []);

  return (
    <motion.div 
      className="relative w-full max-w-3xl h-[28rem] bg-gray-800/20 rounded-lg border border-gray-700 flex items-center justify-center"
      onViewportEnter={() => setIsSorted(true)}
      onViewportLeave={() => setIsSorted(false)}
      viewport={{ amount: 0.6 }}
    >
      <AnimatePresence>
        {isSorted ? (
          // SORTED STATE
          <motion.div 
            className="grid grid-cols-4 gap-4 w-full h-full p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
            exit={{ opacity: 0 }}
          >
            {buckets.map(bucket => (
              <div key={bucket} className="flex flex-col items-center">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">{bucketTitles[bucket]}</h3>
                <div className="w-full p-2 bg-gray-900/30 rounded-md h-full space-y-2">
                  {items
                    .filter(item => item.type === bucket)
                    .map(item => (
                      <FlotsamItem key={item.id} content={item.content} />
                    ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          // CHAOS STATE
          <div className="absolute">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="absolute"
                initial={{ 
                  ...chaosPositions[index],
                  opacity: 0,
                  scale: 0.5
                }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  transition: { delay: index * 0.1, type: 'spring', stiffness: 100 }
                }}
                exit={{ 
                  ...chaosPositions[index],
                  opacity: 0,
                  scale: 0.5,
                  transition: { duration: 0.3 }
                }}
              >
                <FlotsamItem content={item.content} />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DeconstructionVisuals;