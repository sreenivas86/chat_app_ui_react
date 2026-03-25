import React, { useState, useRef, useEffect } from 'react';
import { socket } from '../utils/socket';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
const apiUrl =
  window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL;

const MAX_FILES = 5;

const MessageInput = ({ chatId, currentUser, replyTo, clearReplyTo, allUsers }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionResults, setMentionResults] = useState([]);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const mentionBoxRef = useRef(null);

  const handleSend = async () => {
    if (!chatId) return alert("Chat room not selected!");
    if (!text && files.length === 0) return alert("Please enter a message or upload files.");

    const formData = new FormData();
    formData.append('chatRoomId', chatId);
    formData.append('text', text);
    if (replyTo) formData.append('replyTo', replyTo._id);
    files.forEach(file => formData.append('attachments', file));

    try {
      const res = await axios.post(`${apiUrl}/api/message/send`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      socket.emit('sendMessage', {
        chatRoomId: chatId,
        senderId: currentUser._id,
        text,
        replyTo: replyTo?._id,
        attachments: res.data.attachments || []
      });

      setText('');
      setFiles([]);
      clearReplyTo();
      setShowMentionList(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('❌ Message send failed:', err.response?.data || err.message);
      alert('Failed to send message. Check the console for more info.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file =>
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    const combinedFiles = [...files, ...validFiles];
    if (combinedFiles.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files.`);
      return;
    }

    setFiles(combinedFiles);
  };

  const handleRemoveFile = (indexToRemove) => {
    const updated = files.filter((_, i) => i !== indexToRemove);
    setFiles(updated);
  };

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    const match = value.match(/@(\w*)$/);
    if (match && allUsers) {
      const query = match[1].toLowerCase();
      const filtered = allUsers.filter(u =>
        u.displayName.toLowerCase().includes(query)
      );
      setMentionQuery(query);
      setMentionResults(filtered);
      setShowMentionList(true);
    } else {
      setShowMentionList(false);
    }
  };

  const handleMentionClick = (user) => {
    const updatedText = text.replace(/@(\w*)$/, `@${user.displayName} `);
    setText(updatedText);
    setShowMentionList(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mentionBoxRef.current && !mentionBoxRef.current.contains(e.target)) {
        setShowMentionList(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div className="mt-2 p-2 border-top position-relative">
      {/* Replying Section */}
      {replyTo && (
        <div className="bg-light p-2 border rounded position-relative mb-2">
          <small>Replying to: {replyTo.text}</small>
          <button
            className="btn-close position-absolute end-0 top-0 m-2"
            onClick={clearReplyTo}
            title="Cancel reply"
          ></button>
        </div>
      )}

      {/* Mention Dropdown Above */}
      {showMentionList && mentionResults.length > 0 && (
        <ul
          ref={mentionBoxRef}
          className="list-group position-absolute bg-white shadow-sm zindex-dropdown"
          style={{
            bottom: '100%',
            left: 0,
            width: '250px',
            marginBottom: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 999,
          }}
        >
          {mentionResults.map(user => (
            <li
              key={user._id}
              className="list-group-item list-group-item-action d-flex align-items-center"
              onClick={() => handleMentionClick(user)}
              style={{ cursor: 'pointer' }}
            >
              <FaUserCircle className="me-2 text-primary" />
              @{user.displayName}
            </li>
          ))}
        </ul>
      )}

      {/* Input + Attachments + Send */}
      <div className="d-flex align-items-center gap-2 mb-3 position-relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={handleTextChange}
          className="form-control"
        />

        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => fileInputRef.current?.click()}
          title="Attach image or PDF"
        >
          📎
        </button>

        <button onClick={handleSend} className="btn btn-primary">
          Send
        </button>
      </div>

      {/* Attachments Preview */}
      {files.length > 0 && (
        <div className="bg-white p-2 rounded border">
          <strong>Attachments:</strong>
          <div className="d-flex flex-wrap gap-3 mt-2">
            {files.map((file, idx) => (
              <div key={idx} className="position-relative text-center">
                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle p-1"
                  title="Remove"
                  style={{ borderRadius: '50%', lineHeight: 1 }}
                  onClick={() => handleRemoveFile(idx)}
                >
                  ×
                </button>

                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                    }}
                  />
                ) : (
                  <div style={{ fontSize: '40px', marginTop: '10px' }}>📄</div>
                )}

                <div className="small mt-1 text-truncate" style={{ maxWidth: '80px' }}>
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
