import React, { useState } from 'react';
import { Bot, X, Mic, Send } from 'lucide-react';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-[9999]"
      >
        <Bot className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] flex flex-col overflow-hidden" 
      style={{ height: '500px' }}
    >
      {/* Header */}
      <div className="bg-primary-500 p-4 flex items-center justify-between text-white shadow-sm z-10">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-white" />
          <h3 className="font-bold text-lg">AI Assistant</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-primary-100 hover:text-white transition-colors p-1 rounded-md hover:bg-primary-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area Layout (Mockup) */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
        {/* Bot Message */}
        <div className="flex space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="h-4 w-4 text-primary-600" />
          </div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm self-start text-gray-700 text-sm">
            <p>Hi there! I can help you place orders via text or voice. What would you like today?</p>
          </div>
        </div>
        
        {/* User Message */}
        <div className="bg-primary-50 p-3 rounded-2xl rounded-tr-sm border border-primary-100 shadow-sm max-w-[85%] self-end text-gray-800 text-sm">
          <p>I'd like a grilled salmon and a caesar salad.</p>
        </div>

        {/* Bot Message */}
        <div className="flex space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1">
            <Bot className="h-4 w-4 text-primary-600" />
          </div>
          <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm self-start text-gray-700 text-sm w-full">
            <p>Got it! I've prepared those items for your order. Anything else?</p>
            {/* Mocked Up Order Card Preview */}
            <div className="mt-3 bg-gray-50 rounded-lg p-2 border border-gray-200">
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>Items added</span>
                <span>$37.98</span>
              </div>
              <div className="text-xs text-gray-500">
                • 1x Grilled Salmon<br/>
                • 1x Caesar Salad
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 flex flex-col space-y-3 relative">
        <div className="flex items-center justify-center -mt-8 relative z-20">
          {/* Voice Input Button */}
          <button className="flex items-center justify-center h-14 w-14 rounded-full bg-white text-gray-600 border border-gray-200 hover:text-red-500 hover:border-red-500 shadow-lg transition-all group">
            <Mic className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <input 
            type="text" 
            placeholder="Type your order..." 
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-gray-50 focus:bg-white transition-colors"
          />
          <button className="h-9 w-9 bg-primary-500 text-white rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
