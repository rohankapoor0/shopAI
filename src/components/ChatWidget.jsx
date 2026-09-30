import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Sparkles, Maximize2, Minimize2, Minus, Send, Bot, Star } from 'lucide-react';
import { assistantService } from '../services/assistantService';
import { productService } from '../services/productService';
import { getRatingColors } from '../utils/rating';

const SUGGESTIONS = [
  'Gift ideas under ₹2,000',
  'Best rated electronics',
  'What is the return policy?'
];

const formatINR = (val) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
}).format(val);

const iconButtonStyle = {
  width: 30,
  height: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  background: 'transparent',
  border: 'none',
  color: '#52525b',
  cursor: 'pointer'
};

export const ChatWidget = ({ navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isSending, isOpen]);

  const sendMessage = async (text) => {
    const content = text.trim();
    if (!content || isSending) return;

    const userMessage = { id: crypto.randomUUID(), role: 'user', content };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput('');
    setIsSending(true);

    try {
      // Failed replies are UI-only and never sent back to the model
      const { reply, productIds } = await assistantService.sendMessage(history.filter(m => !m.isError));
      const products = (await Promise.all(productIds.map(id => productService.getProductById(id)))).filter(Boolean);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: reply, products }]);
    } catch (err) {
      console.error('Assistant request failed:', err);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Something went wrong. Please try again.', isError: true }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const openProduct = (productId) => {
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open AI shopping assistant"
        aria-expanded="false"
        className="chat-widget-launcher"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#09090b',
          color: '#ffffff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(9, 9, 11, 0.25)',
          cursor: 'pointer',
          zIndex: 90
        }}
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="ShopAI Assistant"
      onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
      className="chat-widget-panel animate-fade-in"
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        width: isExpanded ? 520 : 360,
        height: isExpanded ? 680 : 520,
        maxWidth: 'calc(100vw - 48px)',
        maxHeight: 'calc(100vh - 48px)',
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        border: '1px solid #e4e4e7',
        borderRadius: 14,
        boxShadow: '0 16px 48px rgba(9, 9, 11, 0.18)',
        overflow: 'hidden',
        zIndex: 90
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 12px 12px 16px', borderBottom: '1px solid #f4f4f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={16} color="#09090b" />
          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#09090b' }}>ShopAI Assistant</span>
          <span style={{ fontSize: '0.62rem', background: '#e0e7ff', color: '#4338ca', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>BETA</span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Shrink chat' : 'Expand chat'}
            title={isExpanded ? 'Shrink' : 'Expand'}
            className="chat-widget-expand"
            style={iconButtonStyle}
          >
            {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Hide chat"
            aria-expanded="true"
            title="Hide"
            style={iconButtonStyle}
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} aria-live="polite" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: '#fafafa' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', margin: 'auto 0', color: '#52525b' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <Bot size={20} />
            </div>
            <div style={{ fontWeight: 700, color: '#09090b', marginBottom: 4 }}>Hi! How can I help you shop today?</div>
            <div style={{ fontSize: '0.8rem', marginBottom: 14 }}>Ask about products, gifts, orders or returns.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  style={{ padding: '7px 12px', borderRadius: 999, border: '1px solid #e4e4e7', background: '#ffffff', color: '#09090b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(message => (
          <div key={message.id} style={{ display: 'flex', flexDirection: 'column', alignItems: message.role === 'user' ? 'flex-end' : 'flex-start', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, maxWidth: '85%' }}>
              {message.role === 'assistant' && (
                <div style={{ width: 24, height: 24, flexShrink: 0, borderRadius: '50%', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={13} />
                </div>
              )}
              <div style={{
                padding: '9px 12px',
                borderRadius: 12,
                fontSize: '0.85rem',
                lineHeight: 1.45,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                ...(message.role === 'user'
                  ? { background: '#09090b', color: '#ffffff', borderBottomRightRadius: 4 }
                  : message.isError
                    ? { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fee2e2', borderBottomLeftRadius: 4 }
                    : { background: '#ffffff', color: '#09090b', border: '1px solid #e4e4e7', borderBottomLeftRadius: 4 })
              }}>
                {message.content}
              </div>
            </div>

            {message.products?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '85%', marginLeft: 30 }}>
                {message.products.map(product => (
                  <button
                    key={product.id}
                    onClick={() => openProduct(product.id)}
                    className="chat-widget-product"
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 10, border: '1px solid #e4e4e7', background: '#ffffff', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <img src={product.image} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#09090b' }}>{formatINR(product.price)}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, padding: '0 5px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 700, ...getRatingColors(product.rating) }}>
                          <Star size={9} fill="currentColor" strokeWidth={0} />
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }} aria-label="Assistant is typing">
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#09090b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={13} />
            </div>
            <div style={{ padding: '11px 14px', borderRadius: 12, borderBottomLeftRadius: 4, background: '#ffffff', border: '1px solid #e4e4e7', display: 'flex', gap: 4 }}>
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
              <span className="chat-typing-dot" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: 12, borderTop: '1px solid #f4f4f5' }}
      >
        <textarea
          ref={inputRef}
          rows={Math.min(3, input.split('\n').length)}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Ask about products, orders, returns..."
          aria-label="Message"
          style={{ flex: 1, resize: 'none', maxHeight: 90, minHeight: 40, padding: '10px 12px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: '0.85rem', lineHeight: 1.4, color: '#09090b', background: '#ffffff' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          aria-label="Send message"
          style={{
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: 10,
            border: 'none',
            background: !input.trim() || isSending ? '#d4d4d8' : '#09090b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !input.trim() || isSending ? 'not-allowed' : 'pointer'
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
