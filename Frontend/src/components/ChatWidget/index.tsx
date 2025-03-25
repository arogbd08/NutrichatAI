import React, { useState } from 'react';
import { MessageCircle, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage } from '../ChatMessage';
import { ChatInput } from '../ChatInput';
import { useChat } from '../../hooks/useChat';

export const ChatWidget: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { messages, input, isLoading, messagesEndRef, setInput, sendMessage } = useChat();

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-gray-800 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-[600px]'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="font-medium text-white">Chat Assistant</h3>
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isMinimized ? (
            <Maximize2 className="w-5 h-5" />
          ) : (
            <Minimize2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 p-4 overflow-y-auto h-[calc(600px-8rem)]">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.text}
                  isBot={message.isBot}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-gray-700">
            <ChatInput
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={sendMessage}
            />
          </div>
        </>
      )}
    </div>
  );
};