"use client";

import {useState, useRef, useEffect} from "react";
import ResponseComponent from "@/components/ResponseComp";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [response, setResponse] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [generatedConcept, setGeneratedConcept] = useState("");
  const [iteration, setIteration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize the textarea 
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [idea]);

  //idea input 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setIsSubmitting(true);

    try{
      const response = await fetch("http://localhost:8000/idea",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea })
      })

      const data = await response.json();

      if(data.status == "success"){
        setResponse(data.message);
        setConversationId(data.conversation_id);
        setGeneratedConcept(data.generated_concept);
        setIteration(data.iteration || 1);
        setShowResponse(true);
      }else{
        setResponse("Error: " + data.message);
        setShowResponse(true);
      }
    }catch (error){
      setResponse("An error occurred while submitting your idea. Please try again.");
      setShowResponse(true);
    }finally {
      setIsSubmitting(false);
    }
  };


  const resetForm = () => {
    setShowResponse(false);
    setResponse("");
    setConversationId("");
    setGeneratedConcept("");
    setIdea("");
    setIteration(1);
  };

  return (
    <main className="flex min-h-[calc(100vh-76px)] flex-col items-center justify-center p-6 bg-gray-50">
      {!showResponse ? (
        <div className="w-full max-w-lg text-center space-y-8">
          <h1 className="text-4xl font-bold text-gray-800">Project<span className="text-blue-600">Pal</span></h1>
          <p className="text-xl text-gray-600">Share your project idea, and we'll help you bring it to life</p>
          
          {isSubmitting ? (
            <LoadingSpinner />
          ) : (
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
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full transition-colors ${
                    isSubmitting || !idea.trim() ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                  }`}
                  disabled={isSubmitting || !idea.trim()}
                >
                  Generate Plan
                </button>
              </div>
            </form>
          )}
          
          {!isSubmitting && (
            <div className="text-gray-600 mt-4 text-sm">
              <p>Try ideas like "fitness tracking app" or "smart home dashboard"</p>
            </div>
          )}
        </div>
      ) : (
        <ResponseComponent 
          responseMessage={response}
          conversationId={conversationId}
          generatedConcept={generatedConcept}
          iteration={iteration}
          onBack={resetForm}
        />
      )}
    </main>
  );
}
