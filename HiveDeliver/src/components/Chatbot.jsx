import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import './Chatbot.css';

const quickActions = [
  { label: 'Delivery Status Inquiry', value: 'Where is my parcel?' },
  { label: 'Create Delivery Order', value: 'Send a parcel to Jalan Ampang, 2kg.' },
  { label: 'Drone Availability', value: 'Do you have drones available now?' },
  { label: 'Delivery Cost Estimation', value: 'How much to deliver to Cheras?' },
  { label: 'Customer Support / FAQ', value: 'How does drone delivery work?' },
  { label: 'Report Delivery Issue', value: "My parcel hasn't arrived." },
  { label: 'Order Modification', value: 'Change the delivery address to Bukit Jalil.' },
];

function getBotResponse(userMsg) {
  // Simulated AI logic for each feature
  const msg = userMsg.toLowerCase();
  if (msg.includes('where is my parcel') || msg.includes('parcel status')) {
    return 'Your parcel is currently being delivered by Drone D4 and will arrive in 8 minutes.';
  }
  if (msg.includes('send a parcel') || msg.includes('create delivery order')) {
    return 'Confirm delivery to Jalan Ampang with parcel weight 2kg?';
  }
  if (msg.includes('drones available')) {
    return '3 drones are available. Estimated pickup time is 5 minutes.';
  }
  if (msg.includes('how much to deliver') || msg.includes('cost')) {
    return 'Estimated delivery cost is RM6.50.';
  }
  if (msg.includes('how does drone delivery work')) {
    return 'Our drones autonomously deliver parcels using optimized routes. Maximum parcel weight is 5kg. We deliver to most areas in KL & Selangor.';
  }
  if (msg.includes("hasn't arrived") || msg.includes('delayed')) {
    return "I'm checking the delivery status for you. Please provide your Parcel ID.";
  }
  if (msg.includes('change the delivery address') || msg.includes('update address')) {
    return 'Address updated successfully.';
  }
  if (msg.includes('cancel order')) {
    return 'Order cancelled successfully.';
  }
  if (msg.includes('notification')) {
    return '🚁 Drone dispatched\n📦 Parcel arriving in 5 minutes\n✅ Delivery completed';
  }
  // Default fallback
  return 'Thanks for your message. Our AI will respond soon!';
}

const Chatbot = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (msg) => {
    const userMsg = msg !== undefined ? msg : input;
    if (!userMsg.trim()) return;
    setMessages([...messages, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: getBotResponse(userMsg) }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className={`chatbot-container ${isDark ? 'dark' : 'light'}`}>
      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatbot-message chatbot-${msg.sender}`}>{msg.text}</div>
        ))}
        {loading && <div className="chatbot-message chatbot-bot">Typing...</div>}
      </div>
      <div className="chatbot-actions">
        {quickActions.map((action, idx) => (
          <button key={idx} className="chatbot-action-btn" onClick={() => handleSend(action.value)}>{action.label}</button>
        ))}
      </div>
      <div className="chatbot-input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button onClick={() => handleSend()}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
