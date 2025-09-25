'use client';

import React from 'react';
import { motion } from 'framer-motion';
import DeconstructionVisuals from './DeconstructionVisuals';

import SynthesisVisuals from './SynthesisVisuals';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const ChaosToClarityStoryboard = () => {
  return (
    <div className="w-full">
      {/* Step 1: Deconstruction */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-bold mb-4">First, We Deconstruct.</h2>
        <p className="text-xl max-w-3xl text-gray-300 mb-8">
          We instantly sort your scattered information into structured, understandable categories.
        </p>
        
        <DeconstructionVisuals />

        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg text-left max-w-3xl">
          <p className="font-bold text-yellow-400">💡 How it really works:</p>
          <p className="text-gray-400">
            The DeepThought app securely scans your designated sources in real-time. This isn&apos;t just an animation; it&apos;s a high-speed analysis of your actual data.
          </p>
        </div>
      </motion.section>

      {/* Step 2: Synthesis */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-bold mb-4">Then, We Synthesize.</h2>
        <p className="text-xl max-w-3xl text-gray-300 mb-8">
          DeepThought moves beyond simple sorting to find the hidden connections and critical insights that link your data.
        </p>

        <SynthesisVisuals />

        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg text-left max-w-3xl">
          <p className="font-bold text-yellow-400">💡 How it really works:</p>
          <p className="text-gray-400">
            Our Architecture of Synthesis is designed to discover non-obvious relationships and surface the &apos;aha!&apos; moments buried in the noise.
          </p>
        </div>
      </motion.section>

      {/* Step 3: Composition */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-bold mb-4">Next, We Compose.</h2>
        <p className="text-xl max-w-2xl text-gray-300 mb-4">
          We transform those insights into an actionable starting point—a draft, a plan, or a model—so you&apos;re not starting from a blank page.
        </p>
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-left">
          <p className="font-bold text-yellow-400">💡 How it really works:</p>
          <p className="text-gray-400">
            The app uses a library of intelligent &apos;Blocks&apos; to create fully editable documents, plans, and reports tailored to your specific needs.
          </p>
        </div>
      </motion.section>

      {/* Step 4: Iteration */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-bold mb-4">Finally, We Iterate Toward Clarity.</h2>
        <p className="text-xl max-w-2xl text-gray-300 mb-4">
          The goal isn&apos;t just an answer; it&apos;s the right question. We help you refine your thinking and challenge assumptions.
        </p>
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg text-left">
          <p className="font-bold text-yellow-400">💡 How it really works:</p>
          <p className="text-gray-400">
            This Socratic dialogue is the core of the Symbiotic Workbench. The app is your partner in a continuous cycle of feedback and refinement.
          </p>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="min-h-screen flex flex-col justify-center items-center text-center p-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
      >
        <h2 className="text-5xl font-extrabold mb-4">Experience the Full Power of Symbiosis.</h2>
        <p className="text-xl max-w-2xl text-gray-300 mb-8">
          This was a preview of the DeepThought workflow. The fully interactive experience, where you can use your own data to find clarity, is coming soon.
        </p>
        <button className="bg-brand-blue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-full text-xl">
          [ Notify Me When the Interactive Demo is Live ]
        </button>
      </motion.section>
    </div>
  );
};

export default ChaosToClarityStoryboard;
