import React, { useState } from 'react';
import { Copy, Check, Code, FileText } from 'lucide-react';

export default function CodeViewer({ pseudocode, javascriptCode }) {
  const [activeTab, setActiveTab] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const currentCode = activeTab === 'javascript' ? javascriptCode : pseudocode;

  const handleCopy = () => {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-viewer-container">
      <div className="code-viewer-header">
        <div className="code-viewer-tabs">
          <button 
            className={`code-tab ${activeTab === 'javascript' ? 'active' : ''}`}
            onClick={() => setActiveTab('javascript')}
          >
            <Code className="w-4 h-4 mr-1.5" />
            JavaScript
          </button>
          <button 
            className={`code-tab ${activeTab === 'pseudocode' ? 'active' : ''}`}
            onClick={() => setActiveTab('pseudocode')}
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Pseudocode
          </button>
        </div>

        <button 
          onClick={handleCopy}
          className="btn-copy"
          title="Copy Code to Clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 mr-1" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="code-block-body">
        <pre className="code-pre">
          <code>{currentCode}</code>
        </pre>
      </div>
    </div>
  );
}
