import React from 'react';
import { MessageCircle, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
  return (
    <div className={`flex items-start gap-3 message-appear ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`p-2.5 rounded-full ${isBot ? 'bg-indigo-500' : 'bg-gray-600'} shadow-glow`}>
        {isBot ? 
          <MessageCircle className="w-5 h-5 text-white" /> : 
          <User className="w-5 h-5 text-white" />
        }
      </div>
      <div 
        className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
          isBot ? 'bg-gray-800 text-gray-100' : 'bg-indigo-500 text-white'
        }`}
      >
        <p className="text-sm md:text-base">{message}</p>
      </div>
    </div>
  );
};