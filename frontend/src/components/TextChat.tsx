'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';
import { Send, CornerDownLeft, AlertCircle } from 'lucide-react';
import { useChatStore, ChatMessage } from '../stores/useChatStore';

interface TextChatProps {
  onSendMessage: (text: string) => void;
  onSendTyping: () => void;
  onSendStopTyping: () => void;
}

export const TextChat: React.FC<TextChatProps> = ({ onSendMessage, onSendTyping, onSendStopTyping }) => {
  const { messages, isPartnerTyping, rateLimitWarning } = useChatStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPartnerTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    onSendTyping();

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      onSendStopTyping();
    }, 1500);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(inputText);
    setInputText('');
    onSendStopTyping();
  };

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Rate limit banner */}
      {rateLimitWarning && (
        <div className="flex items-center gap-2 bg-amber-950/90 border-b border-amber-800/50 px-4 py-2 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{rateLimitWarning}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg: ChatMessage) => {
          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="rounded-full bg-zinc-900/90 px-3 py-1 text-xs text-zinc-400 border border-zinc-800">
                  {msg.content}
                </span>
              </div>
            );
          }

          const isSelf = msg.sender === 'self';
          return (
            <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all ${
                  isSelf
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700/50'
                }`}
              >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                <div
                  className={`text-[10px] mt-1 text-right ${
                    isSelf ? 'text-emerald-200/80' : 'text-zinc-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Partner Typing Indicator */}
        {isPartnerTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-zinc-800/80 px-4 py-3 border border-zinc-700/50">
              <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls */}
      <form onSubmit={handleSend} className="p-3 border-t border-zinc-800 bg-zinc-900/50 flex gap-2 items-center">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
        />
        <Button type="submit" variant="primary" size="md" disabled={!inputText.trim()}>
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
};
