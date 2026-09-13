'use client';

import { useState } from 'react';
import { PageMotifIcon } from './PageMotifIcon';

interface TimeResponse { time: string; message: string; }

function isTimeResponse(value: unknown): value is TimeResponse {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<TimeResponse>;
  return typeof candidate.time === 'string' && !Number.isNaN(Date.parse(candidate.time)) && typeof candidate.message === 'string';
}

export function Time() {
  const [serverTime, setServerTime] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const updateTime = async () => {
    setStatus('loading');
    try {
      const response = await fetch('/api/time');
      if (!response.ok) throw new Error('Request failed');
      const data: unknown = await response.json();
      if (!isTimeResponse(data)) throw new Error('Invalid response');
      setServerTime(new Date(data.time).toLocaleTimeString());
      setLocalTime(new Date().toLocaleTimeString());
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };
  return (
    <section className="demo-page" aria-labelledby="time-title">
      <div className="page-heading page-heading--time">
        <div className="page-heading-copy"><p className="eyebrow">Small API demonstration</p><h1 id="time-title">Compare server and local time</h1><p>Request the current timestamp from Promptfolio’s public JSON endpoint.</p></div>
        <PageMotifIcon kind="time" />
      </div>
      <div className="time-grid"><div><span>Server</span><output>{serverTime || 'Awaiting server time'}</output></div><div><span>Local</span><output>{localTime || 'Awaiting local time'}</output></div></div>
      {status === 'error' && <p role="alert" className="error-message">The time service did not return a valid response. Please try again.</p>}
      <button type="button" className="button-primary" onClick={updateTime} disabled={status === 'loading'}>{status === 'loading' ? 'Requesting…' : status === 'error' ? 'Try again' : 'Update time'}</button>
    </section>
  );
}

export default Time;
