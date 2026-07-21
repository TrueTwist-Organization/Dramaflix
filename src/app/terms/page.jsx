import React from 'react';

export const metadata = {
  title: 'Terms of Service | DramaFlix',
  description: 'Terms of Service for DramaFlix.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6 md:px-12 text-zinc-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-5xl font-black text-white font-outfit tracking-tight mb-8">
          Terms of <span className="text-accent">Service</span>
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
          <p className="text-sm text-zinc-500">Last updated: July 17, 2026</p>

          <p className="leading-relaxed">
            Welcome to DramaFlix. These Terms of Service ("Terms") govern your use of the DramaFlix website, 
            applications, and services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="leading-relaxed">
            By creating an account, accessing, or using the Service, you confirm that you have read, understood, and agreed to these Terms. 
            If you do not agree with any part of these Terms, you may not use our Service.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">2. User Accounts</h2>
          <p className="leading-relaxed">
            To access certain features of DramaFlix, you must create an account. You agree to provide accurate, current, and complete information 
            during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Content and Use of Service</h2>
          <p className="leading-relaxed">
            All content provided on DramaFlix, including videos, text, graphics, and logos, is the property of DramaFlix or its content suppliers 
            and protected by international copyright laws. You may use the Service only for your personal, non-commercial use.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>You may not copy, reproduce, distribute, or create derivative works from our content without explicit permission.</li>
            <li>You may not use the Service for any illegal or unauthorized purpose.</li>
            <li>You may not attempt to hack, destabilize, or adapt the Service.</li>
          </ul>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Subscriptions and Payments</h2>
          <p className="leading-relaxed">
            Some content or features may require a paid subscription. By selecting a subscription plan, you agree to pay the applicable fees. 
            Subscriptions are billed on a recurring basis and can be canceled at any time in your account settings.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">5. Termination</h2>
          <p className="leading-relaxed">
            We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without notice, 
            for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="leading-relaxed">
            DramaFlix shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from 
            your access to or use of, or inability to access or use, the Service or any content on the Service.
          </p>

          <h2 className="text-xl font-bold text-white mt-8 mb-4">Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions or suggestions regarding our Terms of Service, please contact us at <a href="mailto:legal@dramaflix.com" className="text-accent hover:underline">legal@dramaflix.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
