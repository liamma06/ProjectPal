"use client";

import {useState, useRef, useEffect} from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize the textarea as content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [idea]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(idea);
  };

  return (
    <main className="flex min-h-[calc(100vh-76px)] flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">What Idea is On Your Mind?</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Type your project idea here..."
              rows={1}
              className="w-full px-6 py-4 text-lg bg-white border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-hidden"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
        
        <p className="text-gray-600 mt-4">
          Share your project ideas and we'll help you bring them to life
        </p>
      </div>
    </main>
  );
}
