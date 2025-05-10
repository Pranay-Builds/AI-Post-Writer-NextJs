'use client';

import { useUser } from '@clerk/nextjs';
import { ClipLoader } from 'react-spinners';
import { Inter } from 'next/font/google';
import { toast } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

// Load the custom font (Inter)
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function Dashboard() {
  const { isLoaded, user } = useUser();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("neutral");
  const [length, setLength] = useState("short");
  const [targetAudience, setTargetAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [useCase, setUseCase] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClear = () => {
    setTopic('');
    setTone('neutral');
    setLength('short');
    setTargetAudience('');
    setKeywords('');
    setUseCase('');
    setResult(null);
  };

  const formatPlainTextToMarkdown = (text) => {
    let formattedText = text;
    formattedText = formattedText.replace(/^# (.+)$/gm, '## $1');
    formattedText = formattedText.replace(/^[-*]\s+(.+)$/gm, '- $1');

    return formattedText;
  }

  const handleFormSubmit = async () => {
    if (!topic || !tone || !length) {
      return toast.error("Please provide at least the topic, tone and length of your desired result")
    }


    try {
      setLoading(true);
      const response = await fetch(`/api/writer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          tone,
          length,
          targetAudience,
          keywords,
          useCase,
        })
      })

      const data = await response.json();

      if (!response.ok) {
        return toast.error(data.message)
      }

      if (data.generatedContent) {
        toast.success("Content generated successfully!")
        handleClear();
        return setResult(data.generatedContent);
      }

    } catch (error) {
      return toast.error("An error occurred while generating the content")
    } finally {
      setLoading(false);
    }

  }

  const copyTextToClipboard = (text) => {
    try {
      window.navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard")
    } catch (error) {
      toast.error("Something unexpected happened while trying to copy text.")
    }
  }

  // Show loading spinner until the user data is loaded
  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
        <ClipLoader color="white" size={40} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 ${inter.variable}`}>
      <Toaster />
      <section className="text-center mb-12 max-w-4xl mx-auto">
        <h1 className="text-6xl font-extrabold mb-4">AI Writer Dashboard</h1>
        <p className="text-xl mb-6 max-w-xl mx-auto">
          Customize your content creation with AI. Set your preferences below and start generating!
        </p>
      </section>

      {/* Content Creation Options */}
      <section className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Input Section */}
          <div className="p-8 bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Content Information</h2>
            <p className="text-sm mb-4">Provide the details for the AI to generate content.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-semibold mb-2">Topic</label>
                <input value={topic} onChange={(e) => setTopic(e.target.value)} type="text" id="topic" className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="Enter content topic" />
              </div>
              <div>
                <label htmlFor="tone" className="block text-sm font-semibold mb-2">Tone</label>
                <select onChange={(e) => setTone(e.target.value)} value={tone} id="tone" className="w-full p-3 bg-gray-700 rounded-lg text-white">
                  <option value="neutral">Neutral</option>
                  <option value="formal">Formal</option>
                  <option value="informal">Informal</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>
              <div>
                <label htmlFor="length" className="block text-sm font-semibold mb-2">Length</label>
                <select value={length} onChange={(e) => setLength(e.target.value)} id="length" className="w-full p-3 bg-gray-700 rounded-lg text-white">
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes & Additional Options */}
          <div className="p-8 bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Additional Settings</h2>
            <p className="text-sm mb-4">Customize further settings for the generated content.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="audience" className="block text-sm font-semibold mb-2">Target Audience</label>
                <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} type="text" id="audience" className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="Who is your target audience?" />
              </div>
              <div>
                <label htmlFor="keywords" className="block text-sm font-semibold mb-2">Keywords</label>
                <input value={keywords} onChange={(e) => setKeywords(e.target.value)} type="text" id="keywords" className="w-full p-3 bg-gray-700 rounded-lg text-white" placeholder="Enter relevant keywords" />
              </div>
              <div>
                <label htmlFor="use-case" className="block text-sm font-semibold mb-2">Use Case</label>
                <select value={useCase} onChange={(e) => setUseCase(e.target.value)} id="use-case" className="w-full p-3 bg-gray-700 rounded-lg text-white">
                  <option value="blog">Blog Post</option>
                  <option value="email">Email</option>
                  <option value="social-media">Social Media</option>
                  <option value="product-description">Product Description</option>
                </select>
              </div>

              <div className="text-sm text-gray-400 mt-4">
                <p>Note: Ensure all the settings are correct to get the best content results.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div className='mt-3'>
          <ClipLoader size={50} color='white' loading={loading} />
        </div>
      )}

      {result && (
        <div className='bg-gray-800 flex flex-col justify-center items-center shadow-md rounded-md max-w-4xl p-3 mt-5 text-white'>
          <h1 className='font-bold text-center text-2xl'>Your Generated Content: </h1>
          <div className='p-4'>
            <ReactMarkdown>{formatPlainTextToMarkdown(result)}</ReactMarkdown>
          </div>
          <button onClick={() => copyTextToClipboard(result)} className='bg-blue-500 py-2 px-3 rounded-md font-bold cursor-pointer hover:bg-blue-500'>Copy Text</button>
        </div>
      )}

  
      <section className="w-full max-w-4xl mx-auto mt-12">
        <div className="flex flex-col items-center">
          <button
            onClick={() => handleFormSubmit()}
            className="bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-400 transition duration-300 w-full sm:w-auto"
          >
            Generate Content
          </button>
          <p className="text-sm text-gray-400 mt-4">Click to generate content based on the details provided above.</p>
        </div>
      </section>



      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-400">
        <p>&copy; 2025 AI Writer. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
