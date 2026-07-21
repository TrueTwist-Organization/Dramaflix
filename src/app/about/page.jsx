import React from 'react';

export const metadata = {
  title: 'About Us | DramaFlix',
  description: 'Learn more about DramaFlix, your premium destination for immersive OTT video content.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6 md:px-12 text-zinc-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-5xl font-black text-white font-outfit tracking-tight mb-8">
          About <span className="text-accent">Us</span>
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-zinc-400">
          <p className="text-lg leading-relaxed">
            Welcome to <strong className="text-white">DramaFlix</strong>, your ultimate destination for premium, immersive Over-The-Top (OTT) video content. 
            We are dedicated to bringing you the best in entertainment, ranging from trending short dramas to full-scale cinematic experiences.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Mission</h2>
          <p className="leading-relaxed">
            Our mission is simple: to provide high-quality, engaging, and diverse content to audiences worldwide. 
            We believe that great stories have the power to connect people, evoke emotions, and transcend boundaries. 
            Whether you are looking for a quick dose of entertainment during your commute or a deep, binge-worthy series for the weekend, 
            DramaFlix has something for everyone.
          </p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">What We Offer</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-white">Short Dramas:</strong> Bite-sized, high-intensity stories designed for modern viewers on the go.</li>
            <li><strong className="text-white">Cinematic Series:</strong> High-production value series that rival traditional television and film.</li>
            <li><strong className="text-white">Diverse Genres:</strong> From romance and comedy to thriller and action, we cater to all tastes.</li>
            <li><strong className="text-white">Seamless Experience:</strong> A modern, intuitive interface that makes finding and watching your favorite content effortless.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Vision</h2>
          <p className="leading-relaxed">
            We envision a future where top-tier storytelling is accessible to everyone, anywhere, at any time. 
            By constantly innovating our platform and collaborating with talented creators, we aim to be at the forefront of the digital entertainment revolution.
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-12">
            <h3 className="text-xl font-bold text-white mb-3">Get in Touch</h3>
            <p className="text-sm">
              Have questions or feedback? We'd love to hear from you. Reach out to our support team at <a href="mailto:support@dramaflix.com" className="text-accent hover:underline">support@dramaflix.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
