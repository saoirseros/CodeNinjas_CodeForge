import React, { useState, useEffect, useRef } from 'react';
import { ref, push, onValue, query, limitToLast } from 'firebase/database';
import { auth, rtdb } from '../firebase';

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('AnonStudent');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Get username from email
  useEffect(() => {
    if (auth.currentUser?.email) {
      setUsername(auth.currentUser.email.split('@')[0]);
    }
  }, []);

  // Load messages in real-time
  useEffect(() => {
    const messagesRef = ref(rtdb, 'messages');
    const messagesQuery = query(messagesRef, limitToLast(50));

    const unsubscribe = onValue(
      messagesQuery,
      (snapshot) => {
        const data = snapshot.val();
        const loaded = [];

        if (data) {
          for (let id in data) {
            loaded.push({ id, ...data[id] });
          }
        }
        setMessages(loaded);

        setTimeout(scrollToBottom, 100);
      },
      (error) => console.error('Realtime DB error:', error)
    );

    return () => unsubscribe();
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messagePayload = {
      text: newMessage,
      sender: username,
      timestamp: Date.now(),
      senderId: auth.currentUser?.uid || 'anonymous',
    };

    push(ref(rtdb, 'messages'), messagePayload)
      .then(() => setNewMessage(''))
      .catch(console.error);
  };

  const isMine = (id) => id === auth.currentUser?.uid;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Neon Background Blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 h-72 w-72 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute top-40 -right-16 h-72 w-72 bg-pink-500/25 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 bg-sky-500/20 blur-3xl rounded-full" />
      </div>

      {/* Chat Container */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          <div className="bg-slate-950/80 backdrop-blur-xl rounded-[1.5rem] p-6 border border-slate-800">

            {/* Header */}
            <h1 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text drop-shadow-[0_0_20px_rgba(129,140,248,0.6)] mb-5">
              💬 Campus Chatroom
            </h1>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto h-[55vh] space-y-4 p-3 bg-slate-900/40 rounded-xl border border-slate-800 backdrop-blur">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${isMine(msg.senderId) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm p-3 rounded-2xl shadow-lg transition-all backdrop-blur-md border ${
                      isMine(msg.senderId)
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400/40 shadow-indigo-500/40'
                        : 'bg-slate-800/70 text-slate-100 border-slate-700'
                    }`}
                  >
                    <p className="text-xs opacity-70 mb-1">
                      {isMine(msg.senderId) ? 'You' : msg.sender}
                    </p>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-[10px] text-right opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="flex mt-4 space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-xl bg-slate-900/70 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-3 rounded-xl font-semibold text-slate-950
                  bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                  shadow-[0_0_18px_rgba(168,85,247,0.7)]
                  hover:shadow-[0_0_26px_rgba(236,72,153,0.9)]
                  hover:translate-y-[1px] active:translate-y-[2px]
                  transition-all duration-200 disabled:opacity-50"
              >
                Send
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
