import React, { useState } from 'react';
import {
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Terminal,
  ArrowLeft,
  ShieldCheck,
  Zap,
  GitBranch,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { ActionWorkflowRun } from '../../engine/types';
import { INITIAL_WORKFLOW_RUNS } from '../../engine/actionsEngine';

export interface ActionsViewProps {
  currentBranch: string;
}

export const ActionsView: React.FC<ActionsViewProps> = ({ currentBranch }) => {
  const [runs, setRuns] = useState<ActionWorkflowRun[]>(INITIAL_WORKFLOW_RUNS);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 0: true, 3: true, 4: true });
  const [isRunning, setIsRunning] = useState(false);

  const selectedRun = runs.find((r) => r.id === selectedRunId);

  const toggleStep = (idx: number) => {
    setExpandedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleTriggerRun = () => {
    setIsRunning(true);
    const newId = `run-${Math.floor(Math.random() * 90000 + 10000)}`;
    const newRun: ActionWorkflowRun = {
      id: newId,
      workflowName: 'CI / Automated Node.js Pipeline',
      eventName: 'workflow_dispatch',
      branch: currentBranch,
      commitHash: Math.random().toString(16).substring(2, 9),
      commitMessage: 'Manual pipeline trigger via GitHub Actions UI',
      author: 'luxarion',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      status: 'completed',
      conclusion: 'success',
      startedAt: 'just now',
      duration: '42s',
      steps: [
        {
          name: 'Set up job (ubuntu-latest)',
          status: 'completed',
          duration: '3s',
          logs: ['Host: Azure Cloud Run Worker az-7', 'Node: v22.14.0, pnpm 9.15.0'],
        },
        {
          name: 'Run typecheck and linter',
          status: 'completed',
          duration: '14s',
          logs: ['tsc --noEmit -> 0 errors', 'eslint src/ -> 0 errors, 0 warnings'],
        },
        {
          name: 'Run test suites',
          status: 'completed',
          duration: '12s',
          logs: ['PASS 42/42 tests completed in 2.1s'],
        },
        {
          name: 'Vite Production Build',
          status: 'completed',
          duration: '13s',
          logs: ['dist/assets/index.js (182 kB)', '✓ Build succeeded!'],
        },
      ],
    };

    setTimeout(() => {
      setRuns([newRun, ...runs]);
      setIsRunning(false);
      setSelectedRunId(newId);
    }, 1000);
  };

  // Detail View of a Workflow Run with step logs
  if (selectedRun) {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6 w-full max-w-full overflow-hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedRunId(null)}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to all workflow runs
        </Button>

        {/* Run Header */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CheckCircle2 className="w-5 h-5 text-[#3fb950]" />
              <h2 className="text-base md:text-lg font-bold text-[#f0f6fc]">
                {selectedRun.workflowName}
              </h2>
              <Badge variant="success" size="sm">
                Success
              </Badge>
            </div>
            <p className="text-xs text-[#8b949e]">
              Commit <code className="font-mono text-[#58a6ff]">{selectedRun.commitHash}</code>: {selectedRun.commitMessage}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#8b949e] shrink-0">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedRun.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span>{selectedRun.branch}</span>
            </div>
          </div>
        </div>

        {/* Execution Steps & Live Terminal Logs */}
        <div className="border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden">
          <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs font-semibold text-[#f0f6fc]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#58a6ff]" />
              <span>Job: build (ubuntu-latest)</span>
            </div>
            <span className="text-[#8b949e] font-normal">
              {selectedRun.steps.length} steps completed
            </span>
          </div>

          <div className="divide-y divide-[#30363d]/60">
            {selectedRun.steps.map((step, idx) => {
              const isExpanded = !!expandedSteps[idx];
              return (
                <div key={idx} className="text-xs">
                  {/* Step Header */}
                  <div
                    onClick={() => toggleStep(idx)}
                    className="px-4 py-2.5 flex items-center justify-between bg-[#161b22]/40 hover:bg-[#161b22] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 text-[#c9d1d9] font-medium">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#8b949e]" />
                      )}
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span>{step.name}</span>
                    </div>

                    <span className="text-[#8b949e] font-mono">{step.duration}</span>
                  </div>

                  {/* Step Terminal Output */}
                  {isExpanded && (
                    <div className="px-6 py-3 bg-[#0d1117] font-mono text-[11px] text-[#7ee787] space-y-1 overflow-x-auto leading-5">
                      {step.logs.map((log, lIdx) => (
                        <div key={lIdx} className="whitespace-pre">
                          <span className="text-[#8b949e] select-none mr-2">$</span>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // All Runs List
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 w-full max-w-full overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#f0f6fc]">Workflow runs</h2>
          <p className="text-xs text-[#8b949e]">
            Continuous integration and automated delivery pipeline execution logs
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleTriggerRun}
          loading={isRunning}
          icon={<PlayCircle className="w-3.5 h-3.5" />}
        >
          Run workflow
        </Button>
      </div>

      {/* Runs Table */}
      <div className="border border-[#30363d] rounded-lg bg-[#0d1117] overflow-hidden">
        <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] text-xs font-semibold text-[#f0f6fc]">
          All workflows ({runs.length})
        </div>

        <div className="divide-y divide-[#30363d]/60">
          {runs.map((run) => (
            <div
              key={run.id}
              onClick={() => setSelectedRunId(run.id)}
              className="px-4 py-3.5 flex items-center justify-between gap-4 hover:bg-[#161b22] cursor-pointer transition-colors group"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#3fb950] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs md:text-sm font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                      {run.commitMessage}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                      {run.workflowName}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#8b949e] flex items-center gap-1.5 flex-wrap">
                    <span>by {run.author}</span>
                    <span>•</span>
                    <span>on branch <code className="text-[#58a6ff] font-mono">{run.branch}</code></span>
                    <span>•</span>
                    <span className="font-mono text-[#8b949e]">{run.commitHash}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#8b949e] shrink-0">
                <div className="hidden sm:flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{run.duration}</span>
                </div>
                <span>{run.startedAt}</span>
                <ChevronRight className="w-4 h-4 text-[#6e7681]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
