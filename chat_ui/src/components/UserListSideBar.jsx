import React, { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl =
  window.__ENV__?.VITE_API_URL || import.meta.env.VITE_API_URL;

const UserListSidebar = ({ currentUser, onStartChat }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${apiUrl}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Exclude current user
      setUsers(res.data.filter(u => u._id !== currentUser._id));
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <div style={{ height: '100%', overflowY: 'auto', borderLeft: '1px solid #ccc' }}>
      <h6 className="text-center mt-3">Start Chat</h6>
      {users.map(user => (
        <div
          key={user._id}
          onClick={() => onStartChat(user)}
          className="p-2 border-bottom"
          style={{ cursor: 'pointer' }}
        >
          {user.displayName}
        </div>
      ))}
    </div>
  );
};

export default UserListSidebar;
