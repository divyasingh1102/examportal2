import React from 'react';
import { X, BookOpen, CheckSquare, Award, Clock, MapPin, Download } from 'lucide-react';

interface StudyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudyGuideModal: React.FC<StudyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#e2e7ff] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#e2e7ff] flex items-center justify-between bg-[#f2f3ff]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#5c3800] text-[#ffddb8] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c3800]">CS 380 Study Guide</span>
              <h3 className="font-bold text-base text-[#131b2e]">Midterm: Search Algorithms & Deep RL</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#757682] hover:text-[#131b2e] hover:bg-[#dae2fd] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Exam Logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#e2e7ff]">
              <span className="text-[10px] font-bold uppercase text-[#757682]">Time & Date</span>
              <p className="font-semibold text-xs text-[#131b2e] mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0051d5]" />
                Fri, Mar 21 • 10:00 - 12:00
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#e2e7ff]">
              <span className="text-[10px] font-bold uppercase text-[#757682]">Exam Arena</span>
              <p className="font-semibold text-xs text-[#131b2e] mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0051d5]" />
                Turing Hall Arena B4
              </p>
            </div>
            <div className="p-3 rounded-xl bg-[#faf8ff] border border-[#e2e7ff]">
              <span className="text-[10px] font-bold uppercase text-[#757682]">Weight</span>
              <p className="font-semibold text-xs text-[#131b2e] mt-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#0051d5]" />
                25% of Course Grade
              </p>
            </div>
          </div>

          {/* Rules */}
          <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fef3c7] text-xs text-[#92400e]">
            <h4 className="font-bold mb-1">Permitted Materials</h4>
            <p className="leading-relaxed">
              Closed-book exam. You are permitted exactly <strong>one double-sided handwritten 8.5" x 11" formula sheet</strong>.
              No digital devices, graphing calculators, or smartwatches permitted. Student ID must be displayed on desk.
            </p>
          </div>

          {/* Core Tested Topics */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#757682] mb-2">Core Tested Topics</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-[#e2e7ff] bg-white">
                <h5 className="font-bold text-xs text-[#131b2e]">1. Uninformed & Informed Heuristic Search</h5>
                <p className="text-xs text-[#444651] mt-1">
                  BFS, DFS, Uniform Cost Search, A* admissibility and consistency criteria ($h(n) \le c(n, a, n') + h(n')$), IDA*, and memory-bounded search algorithms.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-[#e2e7ff] bg-white">
                <h5 className="font-bold text-xs text-[#131b2e]">2. Adversarial Game Search & Minimax</h5>
                <p className="text-xs text-[#444651] mt-1">
                  Alpha-Beta pruning branch conditions, evaluation functions, quiescence search, Monte Carlo Tree Search (MCTS: Selection, Expansion, Simulation, Backpropagation).
                </p>
              </div>

              <div className="p-3 rounded-lg border border-[#e2e7ff] bg-white">
                <h5 className="font-bold text-xs text-[#131b2e]">3. Markov Decision Processes (MDPs) & Dynamic Programming</h5>
                <p className="text-xs text-[#444651] mt-1">
                  Bellman Expectation & Optimality Equations, Value Iteration convergence (V_k+1(s) = max_a sum P [R + gamma * V_k]), Policy Iteration.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-[#e2e7ff] bg-white">
                <h5 className="font-bold text-xs text-[#131b2e]">4. Reinforcement Learning Foundations</h5>
                <p className="text-xs text-[#444651] mt-1">
                  Model-Free Temporal Difference (TD) Learning, SARSA (on-policy) vs Q-Learning (off-policy), Experience Replay Buffers, Deep Q-Networks (DQN) stability tricks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2e7ff] flex items-center justify-between bg-[#faf8ff]">
          <span className="text-xs text-[#757682]">Spring 2025 • Compiled by Prof. Kenneth Vance</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert('Study Guide PDF downloaded: CS380_Midterm_Review_Packet_2025.pdf');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold bg-[#0051d5] text-white hover:bg-[#00236f] rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download Printable Packet (.pdf)
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-[#444651] hover:bg-[#eaedff] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
