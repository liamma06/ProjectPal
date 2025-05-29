import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ResponseComponentProps {
  responseMessage: string;
  conversationId?: string;
  generatedConcept?: string;
  iteration?: number;
  onBack: () => void;
}

export default function ResponseComponent({
  responseMessage,
  conversationId,
  generatedConcept,
  iteration = 1,
  onBack
}: ResponseComponentProps) {
  // Remove feedback state and submission logic
  // const [feedback, setFeedback] = useState('');
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [updatedResponse, setUpdatedResponse] = useState('');

  // Remove feedback submission handler
  // const handleFeedbackSubmit = async (e: React.FormEvent) => {...}

  // Use the original response message directly
  const displayMessage = responseMessage;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-blue-700 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Plan</h1>
        {iteration > 1 && (
          <span className="px-3 py-1 bg-white text-blue-700 rounded-full text-sm font-medium">
            Version {iteration}
          </span>
        )}
      </div>
      
      {generatedConcept && (
        <div className="px-6 py-4 bg-blue-50">
          <div className="font-medium text-lg text-blue-800 mb-2">Project Concept</div>
          <p className="text-blue-900">{generatedConcept}</p>
        </div>
      )}

      <div className="px-6 py-6">
        <div className="prose prose-lg max-w-none prose-headings:text-blue-700 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-blue-600 prose-li:my-1 prose-ul:my-2 prose-ol:my-2 prose-p:my-3 prose-hr:my-6">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-blue-700 mt-6 mb-3" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-blue-600 mt-5 mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-medium text-blue-500 mt-4 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="my-3" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 my-3" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-3" {...props} />,
              li: ({node, ...props}) => <li className="ml-2 my-1" {...props} />,
              hr: ({node, ...props}) => <hr className="my-6 border-t border-gray-300" {...props} />,
            }}
          >
            {displayMessage}
          </ReactMarkdown>
        </div>
      </div>

      {/* Replace feedback form with just the "New Project" button */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Start New Project
        </button>
      </div>
    </div>
  );
}