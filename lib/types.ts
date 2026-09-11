export type Mode = 'url' | 'text';

export interface AnalyzeRequest {
  type: Mode;
  content: string;
}

export type Severity = 'good' | 'info' | 'warn';

export interface Insight {
  title: string;
  detail: string;
  severity: Severity;
  savings: number | null;
}

export interface Claim {
  text: string;
  verdict: 'verifiable' | 'vague' | 'unfalsifiable';
  reason: string;
  checkWith?: string[];
}

export interface AnalysisResult {
  scores: {
    sensationalism: number;   // 0-100
    sourcing: number;         // 0-100 (higher = worse)
    hedging: number;          // 0-100
  };
  verdict: {
    label: string;            // "Reads like viral panic" etc.
    severity: Severity;
    summary: string;
  };
  signals: Insight[];
  claims: Claim[];
  meta: {
    wordCount: number;
    source: string;           // url hostname or "pasted text"
    fetchedTitle?: string;
  };
}