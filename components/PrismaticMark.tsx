export function PrismaticMark() {
  return (
    <div className="prismatic-mark" aria-hidden="true">
      <span className="prismatic-orbit" />
      <span className="prismatic-satellite"><span className="prismatic-satellite-dot" /></span>
      <svg viewBox="0 0 260 260" role="presentation">
        <defs>
          <linearGradient id="prism-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".9" />
            <stop offset=".2" stopColor="#bff8ff" stopOpacity=".5" />
            <stop offset=".47" stopColor="#e8b7ff" stopOpacity=".3" />
            <stop offset=".72" stopColor="#ffe89d" stopOpacity=".52" />
            <stop offset="1" stopColor="#ffbde8" stopOpacity=".72" />
          </linearGradient>
          <linearGradient id="prism-edge" x1=".1" y1=".1" x2=".9" y2=".9">
            <stop offset="0" stopColor="#8ff6ff" />
            <stop offset=".3" stopColor="#fff" />
            <stop offset=".55" stopColor="#c67cff" />
            <stop offset=".8" stopColor="#ffe575" />
            <stop offset="1" stopColor="#ff88c9" />
          </linearGradient>
          <radialGradient id="prism-core">
            <stop offset="0" stopColor="#fff" stopOpacity=".8" />
            <stop offset=".46" stopColor="#d8b8ff" stopOpacity=".24" />
            <stop offset="1" stopColor="#8ae8ff" stopOpacity="0" />
          </radialGradient>
          <filter id="prism-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle className="prism-core" cx="132" cy="126" r="105" fill="url(#prism-core)" />
        <g className="prism-shadow" transform="translate(8 10)">
          <path d="M135 16C141 75 166 101 226 108C166 116 141 142 135 204C129 142 104 116 43 108C104 101 129 75 135 16Z" />
        </g>
        <g className="prism-faces" filter="url(#prism-glow)">
          <path d="M135 16C141 75 166 101 226 108C166 116 141 142 135 204C129 142 104 116 43 108C104 101 129 75 135 16Z" fill="url(#prism-face)" stroke="url(#prism-edge)" />
          <path className="prism-facet" d="M135 16C138 79 151 100 226 108C158 110 143 116 135 204Z" />
          <path className="prism-highlight" d="M135 28C132 79 112 101 56 108" />
        </g>
        <g className="prism-small prism-small--one">
          <path d="M55 153C58 174 68 184 90 187C68 190 58 200 55 223C52 200 42 190 20 187C42 184 52 174 55 153Z" />
        </g>
        <g className="prism-small prism-small--two">
          <path d="M205 39C207 53 214 60 229 62C214 64 207 71 205 87C203 71 196 64 181 62C196 60 203 53 205 39Z" />
        </g>
      </svg>
      <span className="prismatic-flare" />
    </div>
  );
}
