// TextChat.js
import React, { useState } from 'react';
import './TextChat.css'; // Import CSS file for styling

const TextChat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleMessageSend = () => {
        // Send message to peer
        // Update messages state
        setMessages([...messages, inputValue]);
        setInputValue('');
    };

    return (
        <div className="text-chat-container"> {/* Apply CSS class */}
            <div className="message-container"> {/* Apply CSS class */}
                {messages.map((message, index) => (
                    <div key={index} className="message">{message}</div>
                ))}
            </div>
            <div className="input-container"> {/* Apply CSS class */}

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="chat-input"
                    placeholder='type your message here...'
                />
                <button onClick={handleMessageSend} className="send-button">Send</button> {/* Apply CSS class */}
            </div>
        </div>
    );
};

export default TextChat;
