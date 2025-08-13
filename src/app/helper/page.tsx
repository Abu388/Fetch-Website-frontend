"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Message {
  id: string;
  username: string;
  content: string;
  parent_id: string | null;
  created_at: string;
}

export default function HelperChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [username, _setUsername] = useState('Anonymous'); // Or use user auth if you want

  // Fetch messages on mount
  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from<'messages', Message>('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    }
    fetchMessages();

    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          const eventType = payload.eventType; // INSERT, UPDATE, DELETE

          setMessages((currentMessages) => {
            if (eventType === 'INSERT') {
              // Add new message to list
              return [...currentMessages, newMessage];
            } else if (eventType === 'UPDATE') {
              // Update existing message
              return currentMessages.map(msg => (msg.id === newMessage.id ? newMessage : msg));
            } else if (eventType === 'DELETE') {
              // Remove deleted message
              return currentMessages.filter(msg => msg.id !== payload.old.id);
            }
            return currentMessages;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from<'messages', Message>('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const { error } = await supabase.from('messages').insert({
      username,
      content: input,
      parent_id: replyTo,
    });

    if (!error) {
      setInput('');
      setReplyTo(null);
    }
  }
  async function deleteMessage(id: string) {
    const { error } = await supabase.from('messages').delete().eq('id', id);

    if (error) {
      alert('Failed to delete message');
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        backgroundColor: '#f5f5f5',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        border: '1px solid #2196f3', 
        padding: 20,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          marginBottom: 20,
          color: '#333',
        }}
      >
        Public Chat (FAQ)
      </h2>

      {/* Messages container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          borderRadius: 10,
          backgroundColor: '#fff',
          padding: 15,
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          marginBottom: 10,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: 12,
              paddingTop: 10,
              paddingRight: 18,
              paddingBottom: 10,
              paddingLeft: msg.parent_id ? 20 : 10,
              borderLeft: msg.parent_id ? '3px solid #4caf50' : 'none',
              borderRadius: 8,
              backgroundColor: msg.parent_id ? '#e8f5e9' : '#f0f0f0',
            }}
          >
            <div style={{ padding: '3px 8px',}}> <strong style={{ color: '#555' }}>{msg.username}:</strong> {msg.content}
            <div style={{ marginTop: 5 }}>
              <button
                onClick={() => setReplyTo(msg.id)}
                style={{
                  background: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  marginRight: 5,
                }}
              >
                Reply
              </button>
              <button
                onClick={() => deleteMessage(msg.id)}
                style={{
                  background: '#f44336',
                  color: '#fff',
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
              </div>
            </div>
          </div>
        ))}
        
      </div>

      {replyTo && (
        <div style={{ marginBottom: 10, textAlign: 'left' }}>
          <p>Replying to message </p>
          <button
            onClick={() => setReplyTo(null)}
            style={{
              background: '#633a3aff',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: 4,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }}
          >
            Cancel Reply
          </button>
        </div>
      )}

      {/* Input at the bottom */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={input}
          placeholder={replyTo ? 'Write your reply...' : 'Write your message...'}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // prevent form submission or line break
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 25,
            border: '1px solid #ccc',
            outline: 'none',
            fontSize: 16,
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: '#2196f3',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 25,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );



}

