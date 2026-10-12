import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, FolderTree, Terminal, Sparkles, BookOpen } from 'lucide-react';
import { JAVA_CODE_FILES } from '../data/javaCodeFiles';
import { CodeFile } from '../types';

export const JavaCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CodeFile>(JAVA_CODE_FILES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['All', 'Configuration', 'Entity', 'Repository', 'Security', 'Controller', 'DTO', 'Exception'];

  const filteredFiles = filterCategory === 'All'
    ? JAVA_CODE_FILES
    : JAVA_CODE_FILES.filter((f) => f.category === filterCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Code Viewer Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                Spring Boot 3.3 &amp; Spring Security 6 Production Source Code
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Clean Java 17+ code adhering to SOLID principles, Jakarta EE annotations, Lombok, JJWT 0.12, and Spring Data JPA. Fully functional code ready to import into IntelliJ IDEA or Eclipse.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-colors self-start md:self-auto"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : `Copy ${selectedFile.filename}`}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto mt-5 pt-3 border-t border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: File Tree + Code Editor Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Selector Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm text-slate-100 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              <span>Java Project Files ({filteredFiles.length})</span>
            </div>
          </div>

          <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 border ${
                    isSelected
                      ? 'bg-indigo-950/70 border-indigo-500/80 text-white font-medium'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div className="overflow-hidden">
                    <div className="font-mono text-slate-200 truncate">{file.filename}</div>
                    <div className="text-[10px] text-slate-500 truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Code Editor & Explanations (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-sm text-white">
                  {selectedFile.filename}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  {selectedFile.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {selectedFile.description}
              </p>
            </div>

            <div className="font-mono text-[11px] text-slate-500">
              {selectedFile.code.split('\n').length} lines
            </div>
          </div>

          {/* Code Window with Syntax Highlighting Look */}
          <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
            <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800/80 text-xs text-slate-400">
              <span className="font-mono text-[11px]">{selectedFile.path}</span>
              <button
                onClick={handleCopy}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 font-mono text-[11px] text-indigo-200/90 overflow-x-auto max-h-[500px] leading-relaxed">
              {selectedFile.code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
