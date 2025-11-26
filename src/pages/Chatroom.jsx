import React, { useState, useEffect, useRef } from 'react';
import { getDatabase, ref, push, onValue, query, limitToLast } from 'firebase/database';
import { auth, rtdb } from '../firebase'; 

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('AnonStudent');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    
    if (auth.currentUser && auth.currentUser.email) {
      setUsername(auth.currentUser.email.split('@')[0] || 'CampusUser');
    }
  }, []);

  useEffect(() => {
    
    const messagesRef = ref(rtdb, 'messages');
    
    
    const messagesQuery = query(messagesRef, limitToLast(50));

    
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      const loadedMessages = [];
      
      if (data) {
        for (let id in data) {
          loadedMessages.push({ id, ...data[id] });
        }
      }
      setMessages(loadedMessages);
      
      setTimeout(scrollToBottom, 100); 

    }, (error) => {
      console.error("Realtime DB error:", error);
    });

    return () => unsubscribe();
  }, [rtdb]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messagePayload = {
      text: newMessage,
      sender: username,
      timestamp: Date.now(),
      senderId: auth.currentUser?.uid || 'anonymous'
    };

    const messagesRef = ref(rtdb, 'messages');
    push(messagesRef, messagePayload)
      .then(() => {
        setNewMessage('');
      })
      .catch(error => {
        console.error("Error sending message:", error);
      });
  };

  const isMyMessage = (senderId) => senderId === auth.currentUser?.uid;

  return (
    <div className="container mx-auto max-w-2xl h-[80vh] flex flex-col p-4 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-indigo-600 border-b pb-3 mb-4 flex items-center">
        💬 Campus Chatroom
      </h1>

      <div className="flex-1 overflow-y-auto space-y-4 p-3 bg-gray-50 rounded-lg mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${isMyMessage(msg.senderId) ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-xs sm:max-w-md p-3 rounded-xl shadow-md transition-all duration-300 ${
                isMyMessage(msg.senderId) 
                  ? 'bg-indigo-500 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-tl-none'
              }`}
            >
              <div className={`text-xs font-semibold mb-1 ${isMyMessage(msg.senderId) ? 'text-indigo-200' : 'text-gray-600'}`}>
                {isMyMessage(msg.senderId) ? 'You' : msg.sender}
              </div>
              <div>{msg.text}</div>
              <div className="text-right text-xs mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

     
      <form onSubmit={sendMessage} className="flex space-x-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your campus message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          disabled={!auth.currentUser}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white p-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400"
          disabled={!auth.currentUser || newMessage.trim() === ''}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatroom;
