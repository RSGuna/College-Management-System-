import React, { useState } from 'react';
import { CheckCircle2, Play, Copy, Check, Smartphone, Terminal, Download, Shield, Sparkles } from 'lucide-react';
import { API_ENDPOINTS, MOBILE_INTEGRATION_SNIPPETS, POSTMAN_COLLECTION_JSON } from '../data/apiDocs';
import { ApiEndpoint, RoleType } from '../types';

interface ApiExplorerViewProps {
  currentRole: RoleType;
}

export const ApiExplorerView: React.FC<ApiExplorerViewProps> = ({ currentRole }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  const [activeSnippetTab, setActiveSnippetTab] = useState<'reactNative' | 'androidKotlin'>('reactNative');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      // Check if current role has permission
      const requiresAuth = selectedEndpoint.authRequired;
      let isAllowed = true;

      if (requiresAuth && selectedEndpoint.requiredRole) {
        isAllowed = selectedEndpoint.requiredRole.includes(currentRole);
      }

      if (!isAllowed) {
        setExecutionOutput(JSON.stringify({
          timestamp: new Date().toISOString(),
          status: 403,
          error: "FORBIDDEN",
          message: `Access Denied: User with role [${currentRole}] is not authorized for endpoint ${selectedEndpoint.path}`,
          path: selectedEndpoint.path
        }, null, 2));
      } else {
        setExecutionOutput(selectedEndpoint.responseSample);
      }
      setIsExecuting(false);
    }, 400);
  };

  const downloadPostman = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(POSTMAN_COLLECTION_JSON, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "College_Management_System.postman_collection.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header & Postman Export */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white">
                Interactive Swagger / OpenAPI 3.0 &amp; Mobile REST Endpoints
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl">
              Uniform JSON envelopes, JWT Bearer security schemes, and cross-platform mobile compatibility. Test endpoints live with your active role (<strong className="text-indigo-400">{currentRole}</strong>) or download the Postman Collection.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadPostman}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Postman Collection</span>
            </button>
          </div>
        </div>

        {/* Endpoints Quick Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-5 pt-3 border-t border-slate-800/80">
          {API_ENDPOINTS.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                setSelectedEndpoint(ep);
                setExecutionOutput(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                selectedEndpoint.id === ep.id
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 font-semibold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                ep.method === 'GET' ? 'bg-emerald-950 text-emerald-400' : 'bg-sky-950 text-sky-400'
              }`}>
                {ep.method}
              </span>
              <span>{ep.summary}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Endpoint Tester + Mobile Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint Tester & Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  selectedEndpoint.method === 'GET'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-sky-950 text-sky-400 border border-sky-800'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <span className="text-white font-semibold">{selectedEndpoint.path}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedEndpoint.description}</p>
            </div>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow transition-colors self-start sm:self-auto disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Calling API...' : 'Execute Request'}</span>
            </button>
          </div>

          {/* Security & Header Info */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400">Auth:</span>
              <span className="text-indigo-300">
                {selectedEndpoint.authRequired ? `Bearer Token (${selectedEndpoint.requiredRole || 'Any Auth'})` : 'Public (.permitAll)'}
              </span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Active Role: <span className="text-amber-400">{currentRole}</span>
            </div>
          </div>

          {/* Request Body if present */}
          {selectedEndpoint.requestBody && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Request Payload (JSON Body):</span>
                <button
                  onClick={() => copyText(selectedEndpoint.requestBody!, 'req-body')}
                  className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  {copiedId === 'req-body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                {selectedEndpoint.requestBody}
              </pre>
            </div>
          )}

          {/* cURL Command */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>cURL Equivalent:</span>
              </span>
              <button
                onClick={() => copyText(selectedEndpoint.curlExample, 'curl')}
                className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
              >
                {copiedId === 'curl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy cURL</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300/90 overflow-x-auto">
              {selectedEndpoint.curlExample}
            </pre>
          </div>

          {/* Server Response Window */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Simulated Server Response:</span>
              <span className="text-[11px] text-slate-500 font-mono">Content-Type: application/json</span>
            </div>
            <pre className={`p-4 bg-slate-950 rounded-lg border font-mono text-[11px] overflow-x-auto max-h-[300px] ${
              executionOutput?.includes('"status": 403')
                ? 'border-rose-800 text-rose-300 bg-rose-950/20'
                : 'border-slate-800 text-emerald-300/90'
            }`}>
              {executionOutput || selectedEndpoint.responseSample}
            </pre>
          </div>
        </div>

        {/* Right: Mobile App Integration (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm text-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">Mobile App Architecture</h3>
            </div>
          </div>

          {/* Mobile usage note for the selected endpoint */}
          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
            <div className="font-semibold text-indigo-400 text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mobile Contract Guideline:</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {selectedEndpoint.mobileUsageNote}
            </p>
          </div>

          {/* Snippet Code Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveSnippetTab('reactNative')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    activeSnippetTab === 'reactNative'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  React Native (Axios)
                </button>
                <button
                  onClick={() => setActiveSnippetTab('androidKotlin')}
                  className={`px-3 py-1 rounded font-medium transition-colors ${
                    activeSnippetTab === 'androidKotlin'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Android (Retrofit)
                </button>
              </div>

              <button
                onClick={() => copyText(
                  activeSnippetTab === 'reactNative' ? MOBILE_INTEGRATION_SNIPPETS.reactNative : MOBILE_INTEGRATION_SNIPPETS.androidKotlin,
                  'mobile-code'
                )}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedId === 'mobile-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Code</span>
              </button>
            </div>

            <pre className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[10.5px] text-indigo-200/90 overflow-x-auto max-h-[460px] leading-relaxed">
              {activeSnippetTab === 'reactNative' ? MOBILE_INTEGRATION_SNIPPETS.reactNative : MOBILE_INTEGRATION_SNIPPETS.androidKotlin}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
