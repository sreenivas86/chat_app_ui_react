import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
const apiUrl =
  window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL;

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const headers = { Authorization: `Bearer ${token}` };
        const [userRes, chatsRes, usersRes] = await Promise.all([
          axios.get(`${apiUrl}/api/auth/me`, { headers }),
          axios.get(`${apiUrl}/api/chat`, { headers }),
          axios.get(`${apiUrl}/api/users`, { headers }),
        ]);

        setCurrentUser(userRes.data);
        setChats(chatsRes.data);
        setAllUsers(usersRes.data);
      } catch (err) {
        console.error("Authentication failed:", err.message);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUserClick = async (user) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const existingChat = chats.find(
        (chat) =>
          !chat.isGroup &&
          chat.members?.some((u) => u._id === user._id) &&
          chat.members?.some((u) => u._id === currentUser?._id)
      );

      if (existingChat) {
        setSelectedChat(existingChat);
      } else {
        const res = await axios.post(
          `${apiUrl}/api/chat/private`,
          { userId: user._id },
          { headers }
        );
        const newChat = res.data;
        setChats((prev) => [...prev, newChat]);
        setSelectedChat(newChat);
      }

      setIsSidebarOpen(false); // Close sidebar on small screens
    } catch (err) {
      console.error("Error creating/fetching chat:", err.message);
    }
  };

  return (
    <div className="vh-100 vw-100 d-flex flex-column">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light border-bottom">
        <h6 className="m-0 text-truncate">
          Welcome, {currentUser?.displayName || "User"}
        </h6>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-md-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-grow-1 d-flex flex-column flex-md-row position-relative">
        {/* Sidebar */}
        <div
          className={`bg-white overflow-auto border-end p-2
            ${isSidebarOpen ? "d-block" : "d-none"} 
            d-md-block
          `}
          style={{
            width: "100%",
            maxWidth: "300px",
            minWidth: "35%",
            position: isSidebarOpen ? "absolute" : "relative",
            zIndex: 10,
            height: "100%",
          }}
        >
          <Sidebar
            users={allUsers}
            currentUser={currentUser}
            selectedChat={selectedChat}
            onUserClick={handleUserClick}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-grow-1 bg-light overflow-auto">
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              currentUser={currentUser}
              allUsers={allUsers}
              onUserMention={handleUserClick} // ✅ Pass handler for mentions
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted text-center p-3">
              Select a user to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
