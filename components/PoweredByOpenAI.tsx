import Image from 'next/image';

export function PoweredByOpenAIBadge() {
  return (
    <a
      className="powered-by-openai"
      href="https://openai.com/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="OpenAI homepage (opens in a new tab)"
    >
      <Image
        src="/powered-by-openai-badges/powered-by-openai-badge-outlined-on-light.svg"
        alt=""
        width={280}
        height={54}
        className="openai-badge-light"
      />
      <Image
        src="/powered-by-openai-badges/powered-by-openai-badge-outlined-on-dark.svg"
        alt=""
        width={280}
        height={54}
        className="openai-badge-dark"
      />
    </a>
  );
}
