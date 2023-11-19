// components/PrivacyPolicy.tsx
import React from "react";

export function Policy() {
  return (
    <div className="container mx-auto px-8 py-4">
      <h1 className="text-2xl font-bold mb-4">
        Privacy Policy for promptfolio.dev
      </h1>
      <p>
        <strong>Effective Date: November 19, 2023</strong>
      </p>

      <h2 className="text-xl font-semibold mt-6">1. Introduction</h2>
      <p>
        Welcome to promptfolio.dev. We are committed to respecting your privacy
        and protecting your personal data. This privacy policy outlines our
        practices concerning the collection, use, and disclosure of your
        information through the use of our website and services.
      </p>

      <h2 className="text-xl font-semibold mt-6">2. Data We Collect</h2>
      <p>
        As of the effective date of this policy, we do not collect any personal
        data from our users. However, this may change in the future as we
        enhance our services. Potential future data collection will be limited
        to what is necessary for user authentication and essential functionality
        of our services.
      </p>

      <h2 className="text-xl font-semibold mt-6">3. Use of Data</h2>
      <p>Any data collected in the future will be used exclusively for:</p>
      <ul className="list-disc list-inside">
        <li>User authentication and account management.</li>
        <li>Ensuring the provision of requested services.</li>
        <li>
          Improving and maintaining the functionality of our website and
          services.
        </li>
      </ul>
      <p>
        We will not use your data for marketing, selling to third parties, or
        any other purposes beyond the essential functionality of our services.
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Data Protection</h2>
      <p>
        We are committed to ensuring the security of your data. In the event of
        any future data collection, we will implement appropriate technical and
        organizational measures to protect your personal data against
        unauthorized or unlawful processing and against accidental loss,
        destruction, or damage.
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Changes to This Policy</h2>
      <p>
        We reserve the right to modify this privacy policy at any time. Any
        changes will be posted on our website and will be effective immediately
        upon posting. We encourage you to periodically review this page for the
        latest information on our privacy practices.
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Contact Us</h2>
      <p>
        If you have any questions or concerns about our privacy practices,
        please contact us at hello@promptfolio.dev.
      </p>
    </div>
  );
}

export default Policy;
