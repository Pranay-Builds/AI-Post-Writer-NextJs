
'use client';

import { ClipLoader } from 'react-spinners';
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

// Load the custom font (Inter)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

 
  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <ClipLoader color="white" size={40} />
      </div>
    );
  }


  return (
    <>
    <div className={`min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 ${inter.variable}`}>
      {/* Hero Section */}
      <section className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold mb-4">AI Writer</h1>
        <p className="text-xl mb-6 max-w-xl mx-auto">
          Unlock the power of AI writing and transform your content creation experience.
        </p>

        {/* Conditional Button for Sign In or Dashboard */}
        {isSignedIn ? (
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-400 transition duration-300"
          >
            Go to Dashboard
          </button>
        ) : (
          <div className="flex flex-col items-center">
            
            <RedirectToSignIn />
            <button
              className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-400 transition duration-300"
            >
              Sign In to Get Started
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        <div className="p-8 bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-semibold mb-4">Feature 1</h2>
          <p className="text-sm">Explore AI-generated content to supercharge your writing tasks.</p>
        </div>
        <div className="p-8 bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-semibold mb-4">Feature 2</h2>
          <p className="text-sm">Personalized writing experiences that adapt to your needs.</p>
        </div>
        <div className="p-8 bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-semibold mb-4">Feature 3</h2>
          <p className="text-sm">Generate unique content ideas and writing styles with AI-powered assistance.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-400">
        <p>&copy; 2025 AI Writer. All Rights Reserved.</p>
      </footer>
    </div>
    </>
  );
}
