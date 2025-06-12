'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';

type ChatMessage = {
  type: 'user' | 'bot';
  content: string;
};

const starterQuestions = [
  'Which places face the highest latency?',
  'How often do you check my website’s status?',
  'Can I monitor multiple websites?',
  'Do you offer downtime alerts?',
];

const Chatbot = () => {
  const [isActive, setIsActive] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'bot', content: 'Hello! How can I assist you?' },
  ]);

  const { getToken } = useAuth();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendToChatBot = async (customPrompt?: string) => {
    const input = customPrompt || prompt.trim();
    if (!input) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');

    try {
      const token = await getToken();
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/chatbot`,
        { data: { prompt: input } },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reply: ChatMessage = {
        type: 'bot',
        content: res.data?.response || "Sorry, I couldn't understand that.",
      };

      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: 'Something went wrong. Please try again.',
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isActive ? (
        <div className="w-[30vw] h-[70vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 bg-gray-900 text-white">
            <h2 className="font-semibold text-sm">Uptime Assistant</h2>
            <button onClick={() => setIsActive(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-800 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md max-w-[75%] ${
                  msg.type === 'user'
                    ? 'bg-blue-100 self-end ml-auto text-right'
                    : 'bg-gray-200 self-start mr-auto'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {/* Starter Questions */}
            {messages.length === 1 && (
              <div className="space-y-2 mt-3">
                <p className="text-xs text-gray-500">Try asking:</p>
                {starterQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendToChatBot(question)}
                    className="block text-left bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm w-fit max-w-full"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 text-black flex justify-center items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendToChatBot()}
              className="w-full text-sm border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              className="cursor-pointer hover:text-blue-600 font-semibold"
              onClick={() => sendToChatBot()}
            >
              <Send />
            </div>
          </div>
        </div>
      ) : (
        <button
          className="bg-green-600 h-12 w-12 rounded-full text-white text-lg font-bold flex items-center justify-center shadow-lg hover:bg-green-700 transition"
          onClick={() => setIsActive(true)}
        >
          AI
        </button>
      )}
    </div>
  );
};

export default Chatbot;
