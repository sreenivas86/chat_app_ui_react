import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { socket } from '../utils/socket';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
const apiUrl =
  window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL;

const ChatWindow = ({ chat, currentUser,allUsers, onUserMention }) => {
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});

  useEffect(() => {
    if (!chat?._id) return;

    socket.emit('joinRoom', chat._id);
    fetchMessages(chat._id);

    const handleNewMessage = (msg) => {
      if (msg.chatRoom === chat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [chat?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (chatRoomId) => {
    try {
      const res = await axios.get(`${apiUrl}/api/message/${chatRoomId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMessage = (messageId) => {
    const el = messageRefs.current[messageId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight');
      setTimeout(() => el.classList.remove('highlight'), 2000);
    }
  };

  const handleMentionClick = (username) => {
    if (!username || !chat?.members) return;

    const mentionedUser = chat.members.find(u => u.displayName === username);
    if (mentionedUser && mentionedUser._id !== currentUser._id) {
      onUserMention?.(mentionedUser); // Notify parent (e.g., ChatPage) to switch chat
    }
  };

  return (
    <div style={{ width: '100%', padding: '10px' }} className="d-flex flex-column h-100">
      {/* Message list */}
      <div className="flex-grow-1 overflow-auto mb-2" style={{ maxHeight: '80vh' }}>
        {messages.map((msg) => (
          <div key={msg._id} ref={(el) => (messageRefs.current[msg._id] = el)}>
            <MessageItem
              msg={msg}
              currentUser={currentUser}
              onReply={() => setReplyTo(msg)}
              onReplyClick={() => {
                if (msg.replyTo?._id) scrollToMessage(msg.replyTo._id);
              }}
              onMentionClick={handleMentionClick} // ✅ Add this
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box with mention support */}
      <MessageInput
        chatId={chat._id}
        currentUser={currentUser}
        replyTo={replyTo}
        clearReplyTo={() => setReplyTo(null)}
        allUsers={allUsers || []}
      />
    </div>
  );
};

export default ChatWindow;
