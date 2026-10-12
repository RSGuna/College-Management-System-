import React, { useState } from 'react';
import { FileText, Copy, Check, Sparkles, HelpCircle, ChevronDown, ChevronUp, Calendar, GitBranch, Trophy } from 'lucide-react';
import { RESUME_CONTENT, INTERVIEW_QUESTIONS, ROADMAP_STEPS, InterviewQuestion } from '../data/interviewPrep';

export const ResumeInterviewView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(INTERVIEW_QUESTIONS[0].id);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const categories = ['All', 'Spring Security', 'Spring Data JPA', 'Architecture & Design', 'MySQL & Performance'];

  const filteredQuestions = activeCategory === 'All'
    ? INTERVIEW_QUESTIONS
    : INTERVIEW_QUESTIONS.filter((q) => q.category === activeCategory);

  const fullResumeText = `${RESUME_CONTENT.title}
Key Technologies: ${RESUME_CONTENT.skillsList.join(', ')}

Highlights:
${RESUME_CONTENT.bullets.map((b) => `• ${b}`).join('\n')}
`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                Fresher Resume Accelerator &amp; Senior Architect Interview Kit
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Engineered specifically for fresher software engineers to outshine generic applicants. Includes high-impact STAR resume bullets, senior architect technical answers, and an end-to-end 10-day roadmap.
            </p>
          </div>

          <button
            onClick={() => copyText(fullResumeText, 'resume-all')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-colors self-start md:self-auto"
          >
            {copiedSection === 'resume-all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>Copy Full Resume Section</span>
          </button>
        </div>
      </div>

      {/* Section 1: STAR Resume Bullet Points */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Resume Bullets (Google X-Y-Z &amp; STAR Formula)
            </h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">ATS-Friendly Keywords Embedded</span>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
          <div className="text-xs font-semibold text-white mb-1">{RESUME_CONTENT.title}</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {RESUME_CONTENT.skillsList.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800 font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {RESUME_CONTENT.bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-3 hover:border-slate-700 transition-colors"
            >
              <span className="w-5 h-5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="flex-1 leading-relaxed">{bullet}</p>
              <button
                onClick={() => copyText(bullet, `bullet-${idx}`)}
                className="text-slate-500 hover:text-slate-200 text-[11px] shrink-0 ml-1"
                title="Copy single bullet"
              >
                {copiedSection === `bullet-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Top Technical Interview Questions & Architect Model Answers */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Senior Architect Viva &amp; Technical Interview Preparation
            </h3>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === c
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedQuestion === q.id;
            return (
              <div
                key={q.id}
                className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                  className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      q.difficulty === 'Fresher'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : q.difficulty === 'Intermediate'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-purple-950 text-purple-300 border-purple-800'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs font-medium text-slate-200">{q.question}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-900/30 text-xs space-y-3">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                      {q.seniorAnswer}
                    </div>

                    <div className="p-2.5 bg-indigo-950/40 rounded border border-indigo-800/60 text-indigo-200 text-[11px] flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Architect Interview Secret:</strong> {q.interviewTip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: 10-Day Step-by-Step Roadmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">
            10-Day Step-by-Step Implementation Roadmap (Zero to Production)
          </h3>
        </div>

        <div className="space-y-3">
          {ROADMAP_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold flex items-center justify-center text-xs">
                    {step.step}
                  </span>
                  <span className="font-semibold text-white text-sm">{step.title}</span>
                </div>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                  {step.duration}
                </span>
              </div>

              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                {step.tasks.map((task, i) => (
                  <li key={i} className="text-slate-300">{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
