import React from 'react';

export const metadata = {
  title: 'Privacy Policy | DramaFlix',
  description: 'Privacy Policy for DramaFlix.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6 md:px-12 text-zinc-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-5xl font-black text-white font-outfit tracking-tight mb-8">
          Privacy <span className="text-accent">Policy</span>
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
          <p className="text-sm text-zinc-500">Last updated: July 17, 2026</p>

          <p className="leading-relaxed">
            At DramaFlix, we value your privacy and are committed to protecting your personal information. 
            This Privacy Policy outlines how we collect, use, and safeguard the data you provide to us when you use our platform.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, such as:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Name and email address</li>
            <li>Profile picture and account preferences</li>
            <li>Watch history, liked videos, and bookmarks</li>
          </ul>
          <p>We also automatically collect certain information when you visit, use, or navigate the platform, such as your IP address, browser type, device characteristics, operating system, and usage data.</p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p>We use the collected information for various purposes, including:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Providing, operating, and maintaining our platform</li>
            <li>Personalizing your experience (e.g., video recommendations)</li>
            <li>Improving our website and developing new features</li>
            <li>Communicating with you regarding updates, support, and promotions</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Data Security</h2>
          <p className="leading-relaxed">
            We implement a variety of security measures to maintain the safety of your personal information. 
            However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure, 
            and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Third-Party Services</h2>
          <p className="leading-relaxed">
            We may use third-party service providers (like Firebase) to monitor and analyze the use of our service, authenticate users, or host content. 
            These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Changes to This Policy</h2>
          <p className="leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
            and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@dramaflix.com" className="text-accent hover:underline">privacy@dramaflix.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
