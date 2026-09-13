import { PageMotifIcon } from './PageMotifIcon';

export function Policy() {
  return (
    <section className="page-section policy-page">
      <div className="page-heading page-heading--privacy">
        <div className="page-heading-copy">
          <p className="eyebrow">Privacy · September 12, 2026</p>
          <h1>Clear by design</h1>
          <p>Promptfolio is designed to collect as little visitor data as practical. Here is what the site handles when you visit or follow a link.</p>
        </div>
        <PageMotifIcon kind="privacy" />
      </div>
      <div className="policy-content">
        <section><h2>No Promptfolio profiles</h2><p>Promptfolio has no accounts, contact forms, newsletter, advertising, or first-party analytics. The site does not ask for your name, email address, or other profile information.</p></section>
        <section><h2>Routine hosting records</h2><p>Vercel hosts and protects the site. Like other web hosts, it may process standard request details such as your IP address, browser information, requested URL, and request time under its own policies.</p></section>
        <section><h2>A preference kept on your device</h2><p>Your light, dark, or system theme choice is stored in your browser so it persists between visits. Promptfolio does not attach that preference to an account or visitor profile.</p></section>
        <section><h2>When you follow a link</h2><p>Links may open ChatGPT, GitHub, Threads, BenLive, or your email application. Those services apply their own privacy practices. Promptfolio does not receive your Custom GPT conversations.</p></section>
        <section className="policy-contact"><h2>Questions</h2><p>Email <a className="text-link" href="mailto:hello@promptfolio.dev">hello@promptfolio.dev</a> if you have a question about this page or how the site works.</p></section>
      </div>
    </section>
  );
}

export default Policy;
