import React, { useState } from 'react';
import { Copy, Check, FileCode2 } from 'lucide-react';

export default function CodeSelector({ implementations }) {
  const languages = [
    { id: 'c', label: 'C', icon: 'C' },
    { id: 'cpp', label: 'C++', icon: 'C++' },
    { id: 'java', label: 'Java', icon: 'Java' },
    { id: 'python', label: 'Python', icon: 'Py' }
  ];

  const [activeLang, setActiveLang] = useState('cpp');
  const [copied, setCopied] = useState(false);

  const code = implementations?.[activeLang] || '// No code implementation available.';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="gdp-code-card">
      <div className="gdp-code-header">
        <div className="gdp-code-tabs">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`gdp-code-tab ${activeLang === lang.id ? 'active' : ''}`}
            >
              <FileCode2 className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="gdp-code-copy-btn"
          title="Copy source code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 mr-1.5" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      <div className="gdp-code-body">
        <pre className="gdp-code-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
