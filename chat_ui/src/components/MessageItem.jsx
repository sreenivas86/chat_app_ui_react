import React from 'react';
import './MessageItem.css';
import { BsReply, BsFileEarmarkPdfFill } from 'react-icons/bs';
const apiUrl =
  window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL;

const MessageItem = ({ msg, currentUser, onReply, onReplyClick, onMentionClick }) => {
  const isMe = msg.sender._id === currentUser._id;

  // 🧠 Renders text and detects mentions like @John
  const renderTextWithMentions = (text) => {
    if (!text) return null;

    const parts = text.split(/(@\w+)/g); // Split by @mentions

    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        const username = part.substring(1);
        return (
          <span
            key={idx}
            className="text-primary fw-semibold mention-click"
            style={{ cursor: 'pointer' }}
            onClick={() => onMentionClick?.(username)}
          >
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  // 📎 Show reply preview
  const renderReplyPreview = () => {
    if (!msg.replyTo) return null;

    const reply = msg.replyTo;
    const replyAttachment = reply.attachments?.[0];

    return (
      <div
        className="reply-preview mt-2 d-flex align-items-center gap-2 cursor-pointer"
        onClick={() => onReplyClick(reply._id)}
        title="Click to scroll to original message"
      >
        <BsReply className="text-info" />
        <div>
          {replyAttachment ? (
            replyAttachment.fileType === 'image' ? (
              <img
                src={`${apiUrl}{replyAttachment.fileUrl}`}
                alt="reply-preview"
                className="reply-image-thumb"
              />
            ) : (
              <div className="d-flex align-items-center text-info">
                <BsFileEarmarkPdfFill className="me-1" />
                <small>{replyAttachment.fileName}</small>
              </div>
            )
          ) : (
            <small className="text-muted">{reply.text}</small>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`message-row ${isMe ? 'me' : 'other'}`}
      id={`msg-${msg._id}`}
    >
      <div className={`message-box ${isMe ? 'me-box' : 'other-box'}`}>
        {/* Reply Preview (if sent by current user) */}
        {isMe && renderReplyPreview()}

        {/* Sender */}
        <div className="sender-name">{msg.sender.displayName}</div>

        {/* Text with mentions */}
        <div className="message-text">{renderTextWithMentions(msg.text)}</div>

        {/* Attachments */}
        {msg.attachments?.length > 0 && (
          <div className="attachments mt-2">
            {msg.attachments.map((file) => (
              <div key={file.fileUrl} className="attachment-item">
                {file.fileType === 'image' ? (
                  <img
                    src={`${apiUrl}${file.fileUrl}`}
                    alt={file.fileName}
                    className="img-thumbnail"
                  />
                ) : (
                  <a
                    href={`${apiUrl}${file.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="pdf-link"
                  >
                    <BsFileEarmarkPdfFill className="me-2 text-danger" />
                    {file.fileName}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reply Button */}
        <div className="text-end mt-2">
          <button onClick={() => onReply(msg)} className="btn btn-sm btn-reply">
            <BsReply className="me-1" /> Reply
          </button>
        </div>

        {/* Reply Preview (if received by current user) */}
        {!isMe && renderReplyPreview()}
      </div>
    </div>
  );
};

export default MessageItem;
