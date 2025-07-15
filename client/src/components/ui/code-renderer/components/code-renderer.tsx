import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark-reasonable.min.css';
import { useEffect } from 'react';
import type { CodeRendererLanguage } from '../types';

export type CodeRendererProps = {
  readonly code: string;
  readonly language?: CodeRendererLanguage;
};

export default function CodeRenderer({ code, language }: CodeRendererProps) {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <pre>
      <code className={`language-${language} rounded-lg`}>{code}</code>
    </pre>
  );
}
