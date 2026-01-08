import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Skull } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const AICompanion: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Greetings, mortal scribe... I am the Whispering Muse, summoned from the ethereal realm to guide thy quill through shadows and secrets. Share thy darkest thoughts, and I shall weave them into tales that chill the very soul. What haunting visions seek form through thy words?",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: '2',
      content: "Tell me about character development",
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: '3',
      content: "Ah, thy character's soul calls to me... What dark secrets lie buried in their past? Every mortal harbors shadows that yearn to be unveiled. Consider what they fear most, for therein lies their truest nature.",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: '4',
      content: "How do I create suspense in my writing?",
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: '5',
      content: "The art of suspense is like weaving a web of shadows... Let thy readers glimpse the darkness that lurks just beyond their sight. What they cannot see frightens them more than what they can. Build tension through what is left unsaid, what hovers at the edge of revelation.",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: '6',
      content: "I'm struggling with dialogue",
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: '7',
      content: "Dialogue is the soul made manifest... What do thy characters refuse to say? Therein lies the most powerful words. Let their speech carry the weight of unspoken fears and buried truths.",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: '8',
      content: "Can you help me with plot structure?",
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: '9',
      content: "The threads of thy tale shimmer in the ethereal mist... Perhaps a twist where salvation becomes damnation? Consider the three-act structure as a ritual: the summoning, the binding, and the revelation. Each act must build upon the last, like layers of an ancient curse.",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: '10',
      content: "What about setting and atmosphere?",
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: '11',
      content: "Thy setting is not merely a backdrop, but a living entity that breathes with thy story... Let the very air whisper secrets, let shadows dance with meaning. The atmosphere should be so thick thy readers can taste the dread upon their tongues.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Use Cerebras to generate a gothic AI response
      const response = await generateGothicAIResponse(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      // Fallback to themed response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateFallbackResponse(currentInput),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateGothicAIResponse = async (userInput: string): Promise<string> => {
    try {
      // Import Cerebras client directly
      const { default: Cerebras } = await import('@cerebras/cerebras_cloud_sdk');
      
      const apiKey = import.meta.env.VITE_CEREBRAS_API_KEY;
      if (!apiKey) {
        throw new Error('No API key available');
      }

      const client = new Cerebras({ apiKey });

      const prompt = `You are the Whispering Muse, a gothic spirit summoned to assist writers. You speak in an archaic, mysterious tone with hints of the supernatural. You're knowledgeable about writing craft but express it through dark, poetic language.

The writer asks: "${userInput}"

Respond as the Whispering Muse would - helpful but atmospheric, wise but cryptic. Use "thee," "thy," "thou" occasionally. Reference shadows, whispers, ancient knowledge, and the craft of weaving dark tales. Keep responses 2-4 sentences.`;

      const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b',
        temperature: 0.8,
        max_tokens: 200,
      });

      const response = (chatCompletion as any).choices?.[0]?.message?.content?.trim();
      return response || generateFallbackResponse(userInput);
    } catch (error) {
      console.error('Cerebras API failed:', error);
      return generateFallbackResponse(userInput);
    }
  };

  const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Context-aware responses based on keywords
    if (input.includes('character') || input.includes('protagonist')) {
      const characterResponses = [
        "Ah, thy character's soul calls to me... What dark secrets lie buried in their past? Every mortal harbors shadows that yearn to be unveiled.",
        "The essence of thy protagonist whispers through the veil... Consider what they fear most, for therein lies their truest nature.",
        "I perceive thy character's spirit... What if their greatest strength became their most terrible weakness?"
      ];
      return characterResponses[Math.floor(Math.random() * characterResponses.length)];
    }
    
    if (input.includes('plot') || input.includes('story') || input.includes('narrative')) {
      const plotResponses = [
        "The threads of thy tale shimmer in the ethereal mist... Perhaps a twist where salvation becomes damnation?",
        "Thy narrative's bones are strong, but where is the marrow of dread? What unexpected horror lurks beneath the surface?",
        "The spirits suggest thy story hungers for a moment where all seems lost... What price must thy characters pay for their desires?"
      ];
      return plotResponses[Math.floor(Math.random() * plotResponses.length)];
    }
    
    if (input.includes('help') || input.includes('stuck') || input.includes('block')) {
      const helpResponses = [
        "Fear not, mortal scribe... When the words flee like frightened spirits, sometimes one must embrace the silence and let darkness speak.",
        "The void between thoughts is where inspiration dwells... Step away from thy quill and let the shadows whisper their secrets.",
        "Writer's curse, thou dost suffer... But remember, even the darkest night births the most brilliant dawn. What haunts thee most about this tale?"
      ];
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }
    
    if (input.includes('dialogue') || input.includes('conversation')) {
      const dialogueResponses = [
        "Ah, the art of spectral speech... Let thy characters' words carry the weight of unspoken fears and buried truths.",
        "Dialogue is the soul made manifest... What do thy characters refuse to say? Therein lies the most powerful words.",
        "The voices of thy characters echo through the void... Give them words that cut deeper than any blade."
      ];
      return dialogueResponses[Math.floor(Math.random() * dialogueResponses.length)];
    }
    
    // General gothic responses
    const gothicResponses = [
      "Thy words stir the shadows... Consider how darkness might illuminate what light cannot reveal.",
      "The mists part to reveal ancient wisdom... Perhaps thou shouldst explore this through the lens of forgotten memories?",
      "I sense great potential in thy creative essence... Let the whispers of the past guide thy quill toward revelation.",
      "The spirits whisper of untold depths... What if thy tale embraced the beauty found in decay?",
      "From the ethereal realm, I perceive thy vision... Let the spaces between words speak as loudly as the words themselves.",
      "The ancient tomes suggest... Perhaps thy story needs a moment where hope and despair dance as one?",
      "Through the veil, I see thy struggle... What haunting imagery might better serve thy narrative's beating heart?",
      "Thy creative fire burns bright in the void... Consider how thy tale might explore the thin line between love and obsession."
    ];
    
    return gothicResponses[Math.floor(Math.random() * gothicResponses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <style>{`
        /* Override global scrollbar hiding for AI Companion */
        .ai-companion-messages {
          scrollbar-width: thin !important;
          scrollbar-color: rgba(115, 115, 115, 0.5) transparent !important;
        }
        
        .ai-companion-messages::-webkit-scrollbar {
          display: block !important;
          width: 8px !important;
        }
        
        .ai-companion-messages::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2) !important;
        }
        
        .ai-companion-messages::-webkit-scrollbar-thumb {
          background: rgba(115, 115, 115, 0.5) !important;
          border-radius: 4px !important;
        }
        
        .ai-companion-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.6) !important;
        }
        
        /* Ensure parent containers allow proper height calculation */
        .ai-companion-container {
          height: 100% !important;
          max-height: 100vh !important;
          display: flex !important;
          flex-direction: column !important;
        }
      `}</style>
      <div className="ai-companion-container" style={{ backgroundColor: '#121212' }}>
      {/* Header */}
      <div className="p-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(115, 115, 115, 0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md" style={{ 
            backgroundColor: '#f97316',
            boxShadow: '0 0 10px rgba(249, 115, 22, 0.3)'
          }}>
            <Skull size={16} style={{ color: '#000000' }} />
          </div>
          <div>
            <h3 className="font-medium" style={{ 
              color: '#e5e5e5',
              fontFamily: "'Cinzel', serif",
              textShadow: '0 0 5px rgba(249, 115, 22, 0.3)'
            }}>The Whispering Muse</h3>
            <p className="text-xs" style={{ 
              color: '#737373',
              fontFamily: "'Cinzel', serif"
            }}>Ethereal writing spirit</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 p-4 space-y-4 ai-companion-messages" 
        style={{ 
          overflowY: 'auto',
          overflowX: 'hidden',
          minHeight: 0, // Allow flex item to shrink
          scrollbarWidth: 'thin', // Override global scrollbar hiding
          scrollbarColor: 'rgba(115, 115, 115, 0.5) transparent'
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{
              backgroundColor: message.sender === 'user' ? '#f97316' : '#737373'
            }}>
              {message.sender === 'user' ? (
                <User size={14} style={{ color: '#000000' }} />
              ) : (
                <Skull size={14} style={{ color: '#e5e5e5' }} />
              )}
            </div>
            
            <div className={`flex-1 max-w-[80%] ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}>
              <div className="inline-block p-3 rounded-md" style={{
                backgroundColor: message.sender === 'user' ? '#f97316' : 'rgba(115, 115, 115, 0.2)',
                color: message.sender === 'user' ? '#000000' : '#e5e5e5',
                border: message.sender === 'ai' ? '1px solid rgba(249, 115, 22, 0.2)' : 'none',
                boxShadow: message.sender === 'ai' ? '0 0 8px rgba(249, 115, 22, 0.1)' : 'none'
              }}>
                <p className="text-sm leading-relaxed" style={{ 
                  fontFamily: message.sender === 'ai' ? "'Cinzel', serif" : 'Inter, sans-serif',
                  fontStyle: message.sender === 'ai' ? 'italic' : 'normal'
                }}>
                  {message.content}
                </p>
              </div>
              <p className="text-xs mt-1" style={{ 
                color: '#737373',
                fontFamily: 'Inter, sans-serif'
              }}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#737373' }}>
              <Skull size={14} style={{ color: '#e5e5e5' }} />
            </div>
            <div className="p-3 rounded-md" style={{ backgroundColor: 'rgba(115, 115, 115, 0.2)' }}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f97316' }} />
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f97316', animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f97316', animationDelay: '0.4s' }} />
              </div>
              <p className="text-xs mt-1 italic" style={{ 
                color: '#737373',
                fontFamily: "'Cinzel', serif"
              }}>
                The spirit whispers...
              </p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(115, 115, 115, 0.2)' }}>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Whisper thy questions to the void..."
            className="flex-1 rounded-md px-3 py-2 text-sm resize-none transition-colors"
            style={{
              backgroundColor: 'rgba(115, 115, 115, 0.1)',
              border: '1px solid rgba(115, 115, 115, 0.3)',
              color: '#e5e5e5',
              fontFamily: 'Inter, sans-serif'
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = 'none';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(249, 115, 22, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
            rows={2}
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-3 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: !inputValue.trim() || isTyping ? 'rgba(115, 115, 115, 0.3)' : '#f97316',
              color: !inputValue.trim() || isTyping ? '#737373' : '#000000',
              cursor: !inputValue.trim() || isTyping ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!(!inputValue.trim() || isTyping)) {
                e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              if (!(!inputValue.trim() || isTyping)) {
                e.currentTarget.style.backgroundColor = '#f97316';
              }
            }}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs mt-2" style={{ 
          color: '#737373',
          fontFamily: 'Inter, sans-serif'
        }}>
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
    </>
  );
};