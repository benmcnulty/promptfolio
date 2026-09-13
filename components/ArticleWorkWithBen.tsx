'use client';

import { useEffect, useRef } from 'react';
import { ExternalLinkIcon } from './ExternalLinkIcon';

const profiles = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/benmcnulty' },
  { label: 'GitHub', href: 'https://github.com/benmcnulty' },
  { label: 'Threads', href: 'https://www.threads.com/@benlivenow' },
];

export function ArticleWorkWithBen() {
  const agentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    let latestPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const updateGaze = () => {
      const agent = agentRef.current;
      if (!agent) return;

      const bounds = agent.getBoundingClientRect();
      const deltaX = latestPoint.x - (bounds.left + bounds.width / 2);
      const deltaY = latestPoint.y - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(deltaX, deltaY) || 1;
      const strength = Math.min(1, distance / Math.max(bounds.width, 1));

      agent.style.setProperty('--agent-gaze-x', `${(deltaX / distance) * 4.5 * strength}px`);
      agent.style.setProperty('--agent-gaze-y', `${(deltaY / distance) * 4 * strength}px`);
    };

    const followPoint = (event: PointerEvent) => {
      latestPoint = { x: event.clientX, y: event.clientY };
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateGaze);
    };

    window.addEventListener('pointermove', followPoint, { passive: true });
    window.addEventListener('pointerdown', followPoint, { passive: true });
    updateGaze();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', followPoint);
      window.removeEventListener('pointerdown', followPoint);
    };
  }, []);

  return (
    <aside className="article-collaboration" aria-labelledby="work-with-ben-title">
      <div className="article-collaboration-intro">
        <p className="eyebrow">Work with Ben</p>
        <h2 id="work-with-ben-title">
          <span>Bring AI-enabled judgment</span>
          <span>to your engineering team</span>
        </h2>
        <p>
          Ben McNulty is a QA Automation Engineer with experience spanning front-end engineering, quality systems,
          and operational leadership. In his current role, he leads the practical integration of agentic development
          tools into his team’s workflow, turning emerging capabilities into reliable, repeatable ways of working.
        </p>
      </div>
      <div className="article-collaboration-system" data-motif="planned-full-stack-system" aria-hidden="true">
        <svg viewBox="0 0 260 220">
          <defs>
            <linearGradient id="collaboration-system-layer" x1="42" y1="40" x2="188" y2="171" gradientUnits="userSpaceOnUse">
              <stop stopColor="#baf5ff" stopOpacity=".34" />
              <stop offset=".58" stopColor="#cf8cff" stopOpacity=".22" />
              <stop offset="1" stopColor="#ffe685" stopOpacity=".15" />
            </linearGradient>
          </defs>
          <g className="collaboration-system-connections">
            <path d="M116 60C153 53 183 57 209 76" />
            <path d="M116 108C158 108 181 104 211 91" />
            <path d="M116 154C157 163 184 147 214 111" />
            <circle cx="151" cy="57" r="3" />
            <circle cx="166" cy="108" r="3" />
            <circle cx="171" cy="155" r="3" />
          </g>
          <g className="collaboration-system-stack">
            <g className="collaboration-system-layer collaboration-system-layer--interface">
              <path d="M23 42h96v43H23z" fill="url(#collaboration-system-layer)" />
              <path d="M23 53h96M32 48h1M39 48h1M46 48h1" />
              <path d="M39 67h25M39 74h52" />
            </g>
            <g className="collaboration-system-layer collaboration-system-layer--logic">
              <path d="M29 94h90v42H29z" fill="url(#collaboration-system-layer)" />
              <path d="m55 107-10 8 10 8M88 107l10 8-10 8M78 104l-13 22" />
            </g>
            <g className="collaboration-system-layer collaboration-system-layer--data">
              <path d="M39 150c0-7 17-12 39-12s39 5 39 12v25c0 7-17 12-39 12s-39-5-39-12Z" fill="url(#collaboration-system-layer)" />
              <path d="M39 150c0 7 17 12 39 12s39-5 39-12M39 163c0 7 17 12 39 12s39-5 39-12" />
            </g>
          </g>
          <g className="collaboration-system-plan">
            <path className="collaboration-system-board" d="M190 54h48v77h-48z" />
            <path className="collaboration-system-tab" d="M204 54v-8h20v8" />
            <path className="collaboration-system-check" d="m199 73 4 4 7-9M199 94l4 4 7-9M199 115l4 4 7-9" />
            <path d="M215 73h14M215 94h14M215 115h14" />
          </g>
          <g className="collaboration-system-infrastructure">
            <path d="M177 164c0-10 8-18 18-18 7 0 13 4 16 10a15 15 0 0 1 20 14h-54a12 12 0 0 1 0-6Z" />
            <path d="M192 177h28M198 185h16" />
            <circle className="collaboration-system-status" cx="226" cy="185" r="4" />
          </g>
          <path className="collaboration-system-packet" d="M143 104h8v8h-8z" />
        </svg>
      </div>
      <div ref={agentRef} className="article-collaboration-agent" data-motif="agent-quality-loop" aria-hidden="true">
        <svg viewBox="0 0 220 220">
          <defs>
            <linearGradient id="collaboration-agent-shell" x1="44" y1="45" x2="177" y2="178" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c7f7ff" stopOpacity=".5" />
              <stop offset=".52" stopColor="#dca6ff" stopOpacity=".3" />
              <stop offset="1" stopColor="#ffe58b" stopOpacity=".22" />
            </linearGradient>
            <radialGradient id="collaboration-agent-screen" cx="0" cy="0" r="1" gradientTransform="translate(104 102) rotate(38) scale(72 58)" gradientUnits="userSpaceOnUse">
              <stop stopColor="#bff8ff" stopOpacity=".3" />
              <stop offset="1" stopColor="#9d63db" stopOpacity=".08" />
            </radialGradient>
            <filter id="collaboration-agent-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g className="collaboration-agent-orbits">
            <ellipse className="collaboration-agent-orbit collaboration-agent-orbit--outer" cx="110" cy="110" rx="101" ry="86" transform="rotate(-9 110 110)" />
            <ellipse className="collaboration-agent-orbit collaboration-agent-orbit--inner" cx="110" cy="110" rx="94" ry="76" transform="rotate(12 110 110)" />
            <path className="collaboration-agent-route" d="M15 127C31 61 81 24 145 34c36 6 61 26 72 57" />
            <circle className="collaboration-agent-node collaboration-agent-node--context" cx="22" cy="137" r="7" />
            <circle className="collaboration-agent-node collaboration-agent-node--quality" cx="199" cy="67" r="7" />
            <path className="collaboration-agent-check" d="m195 67 3 3 6-7" />
          </g>
          <g className="collaboration-agent-core" transform="translate(13.2 13.2) scale(.88)">
            <g className="collaboration-agent-body">
              <path className="collaboration-agent-shoulders" d="M50 194c6-25 25-38 60-38s54 13 60 38" />
              <rect className="collaboration-agent-shell" x="43" y="53" width="134" height="112" rx="35" fill="url(#collaboration-agent-shell)" />
              <path className="collaboration-agent-ear" d="M43 88H31a8 8 0 0 0-8 8v25a8 8 0 0 0 8 8h12M177 88h12a8 8 0 0 1 8 8v25a8 8 0 0 1-8 8h-12" />
              <rect className="collaboration-agent-screen" x="57" y="69" width="106" height="77" rx="27" fill="url(#collaboration-agent-screen)" />
              <path className="collaboration-agent-scan" d="M66 105h88" />
              <g className="collaboration-agent-eye collaboration-agent-eye--left">
                <ellipse cx="86" cy="103" rx="16" ry="18" />
                <g className="collaboration-agent-gaze">
                  <circle className="collaboration-agent-pupil" cx="89" cy="104" r="7" />
                  <circle className="collaboration-agent-eye-light" cx="91.5" cy="101.5" r="1.8" />
                </g>
              </g>
              <g className="collaboration-agent-eye collaboration-agent-eye--right">
                <ellipse cx="134" cy="103" rx="16" ry="18" />
                <g className="collaboration-agent-gaze">
                  <circle className="collaboration-agent-pupil" cx="137" cy="104" r="7" />
                  <circle className="collaboration-agent-eye-light" cx="139.5" cy="101.5" r="1.8" />
                </g>
              </g>
              <path className="collaboration-agent-smile" d="M88 128c6 8 14 12 22 12s16-4 22-12" />
              <g className="collaboration-agent-antenna">
                <path d="M110 53V34" />
                <path d="M101 29h18" />
                <circle cx="110" cy="27" r="5" />
                <path className="collaboration-agent-signal" d="M123 36c8 3 13 9 15 17M97 36c-8 3-13 9-15 17" />
              </g>
            </g>
          </g>
          <path className="collaboration-agent-spark" d="M180 137c1.6 8.5 6 12.9 14.5 14.5-8.5 1.6-12.9 6-14.5 14.5-1.6-8.5-6-12.9-14.5-14.5 8.5-1.6 12.9-6 14.5-14.5Z" filter="url(#collaboration-agent-glow)" />
        </svg>
      </div>
      <div className="article-collaboration-details">
        <p>
          Across more than a decade of software delivery, his independent work carries that discipline through
          full-stack product engineering: translating nuanced intent into polished, accessible interfaces while
          directing frontier models through context engineering, human review, and repeatable validation. He is
          open to conversations about senior remote roles where quality, AI adoption, and product craft all matter.
        </p>
        <div className="article-profile-links" aria-label="Ben McNulty profiles">
          {profiles.map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer">
              <span>{label}</span>
              <ExternalLinkIcon />
            </a>
          ))}
        </div>
        <a className="text-link article-collaboration-link" href="https://benlive.tv/about" target="_blank" rel="noopener noreferrer">
          <span>Explore Ben’s work</span>
          <ExternalLinkIcon />
        </a>
      </div>
    </aside>
  );
}
