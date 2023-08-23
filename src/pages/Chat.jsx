import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import NavBar from "../components/NavBar";

function Chat() {
  const userType = localStorage.getItem("userType");
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [sendTypingInterval, setSendingTypeInterval] = useState(null);
  const [sendTypingIntervalRunning, setSendTypingIntervalRunning] = useState(false);
  const conversationsRef = useRef(conversations);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/conversations`, { method: "GET", credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error(res.status);
      })
      .then((res) => {
        const request = res.request.map((i) => ({ ...i, sending: [], isTyping: false, intervalId: null }));
        setConversations(request);
        conversationsRef.current = request;
      });

    const localSocket = io(import.meta.env.VITE_SOCKET_API, { withCredentials: true });
    setSocket(localSocket);
    localSocket.on("message", ({ doc, conversationId }) => addMessageToConversation(conversationId, doc, false));
    localSocket.on("ack_message", ({ doc, conversationId }) => addMessageToConversation(conversationId, doc, true));
    localSocket.on("start_typing", receiveStartTyping);
    localSocket.on("stop_typing", receiveStopTyping);
  }, []);

  useEffect(() => {
    if (selectedChatId !== null) {
      const found = conversations?.find((i) => i._id === selectedChatId);
      if (found === undefined) return setSelectedChat(null);
      setSelectedChat(found);stopSendingTyping()
      setMessage("");
    }
  }, [selectedChatId, conversations]);

  useEffect(() => {
    setMessage("");
    stopSendingTyping();
  }, [selectedChatId]);

  const addMessageToConversation = (conversationId, message, removeInSending) => {
    const temp = [...conversationsRef.current];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === conversationId) {
        if (removeInSending) {
          const index = temp[i].sending.findIndex((j) => j === message.message);
          if (index !== -1) temp[i].sending.splice(index, 1);
        }
        temp[i].messages.push(message);
        temp[i].last_message = { message: message.message, sender: message.sender, timestamp: message.timestamp };
        temp.unshift(temp[i]);
        temp.splice(i + 1, 1);
        break;
      }
    }
    setConversations(temp);
    conversationsRef.current = temp;
  };

  const receiveStartTyping = ({ conversationId }) => {
    const temp = [...conversationsRef.current];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === conversationId) {
        clearInterval(temp[i].intervalId);
        temp[i].isTyping = true;
        temp[i].intervalId = setInterval(() => {
          temp[i].isTyping = false;
          setConversations((prev) => {
            const updated = [...prev];
            updated[i].isTyping = false;
            return updated;
          });
          clearInterval(temp[i].intervalId);
        }, 11000);
      }
    }
    conversationsRef.current = temp;
    setConversations(temp);
  };

  const receiveStopTyping = ({ conversationId }) => {
    const temp = [...conversationsRef.current];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === conversationId) {
        temp[i].isTyping = false;
        break;
      }
    }
    conversationsRef.current = temp;
    setConversations(temp);
  };

  const displayProfilePicture = (index) => {
    if (index + 1 >= selectedChat.messages.length) {
      if (selectedChat.messages[index].sender === "Customer") return <div style={{ backgroundColor: "#999999", height: "24px", width: "24px", borderRadius: "50%" }} />;
      else if (selectedChat.messages[index].sender === "Shop") return <div style={{ backgroundColor: "#444444", height: "24px", width: "24px", borderRadius: "50%" }} />;
    }
    if (selectedChat.messages[index].sender === selectedChat.messages[index + 1].sender) return <div style={{ height: "24px", width: "24px" }} />;
    if (selectedChat.messages[index].sender === "Customer") return <div style={{ backgroundColor: "#999999", height: "24px", width: "24px", borderRadius: "50%" }} />;
    if (selectedChat.messages[index].sender === "Shop") return <div style={{ backgroundColor: "#444444", height: "24px", width: "24px", borderRadius: "50%" }} />;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (message === "") return;
    addSending();
    socket.emit("stop_typing", { conversationId: selectedChatId });
    stopSendingTyping();
  };

  const addSending = () => {
    const temp = [...conversationsRef.current];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === selectedChatId) {
        temp[i].sending.push(message);
        temp.unshift(temp[i]);
        temp.splice(i + 1, 1);
        break;
      }
    }
    conversationsRef.current = temp;
    setConversations(temp);

    if (userType === "Shop") socket.emit("message", { recipientType: userType, recipientId: selectedChat.customer._id, conversationId: selectedChat._id, message: message.trim() });
    else if (userType === "Customer") socket.emit("message", { recipientType: userType, recipientId: selectedChat.shop._id, conversationId: selectedChat._id, message: message.trim() });
    setMessage("");
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value === "") {
      socket.emit("stop_typing", { conversationId: selectedChatId });
      stopSendingTyping();
    } else if (sendTypingIntervalRunning === false) {
      sendTyping();
      setSendingTypeInterval(setInterval(sendTyping, 5000));
      setSendTypingIntervalRunning(true);
    }
  };
  const sendTyping = () => socket.emit("start_typing", { conversationId: selectedChatId });
  
  const stopSendingTyping = () => {
    clearInterval(sendTypingInterval);
    setSendTypingIntervalRunning(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavBar />
      <h3>Chat</h3>
      <div style={{ display: "flex", flexGrow: "1" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "250px" }}>
          {/* CONVERSATION TILES */}
          {conversations?.map((chat, index) => (
            <div key={index} style={{ border: "1px solid black", padding: "0.5rem 1rem", cursor: "pointer" }} onClick={() => setSelectedChatId(chat._id)}>
              {userType === "Customer" && <div style={{ fontWeight: "500" }}>{chat.shop.name}</div>}
              {userType === "Shop" && <div style={{ fontWeight: "500" }}>{`${chat.customer.first_name} ${chat.customer.last_name}`}</div>}
              {userType !== chat.last_message?.sender && <div>{chat.last_message?.message}</div>}
              {userType === chat.last_message?.sender && <div>{`You: ${chat.last_message?.message}`}</div>}
            </div>
          ))}
        </div>
        {selectedChat !== null && (
          <div style={{ flex: 1, border: "1px solid black", padding: "0.5rem", display: "flex", flexDirection: "column" }}>
            {/* HEADER */}
            <div>
              <h5>
                {userType === "Shop" && `${selectedChat.customer.first_name} ${selectedChat.customer.last_name}`}
                {userType === "Customer" && selectedChat.shop.name}
              </h5>
            </div>

            {/* ALL MESSAGES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.20rem", overflowY: "scroll", flexGrow: "1", height: "1px", padding: "1rem 0rem" }}>
              {/* MESSAGES */}
              {selectedChat.messages.map((chat, index) => (
                <div key={index}>
                  {chat?.sender === userType ? (
                    <div style={{ display: "flex", justifyContent: "end" }}>
                      <div style={{ border: "1px solid black", padding: "0rem 0.75rem", marginLeft: "4rem", borderRadius: "20px" }}>{chat.message}</div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "start", gap: "0.5rem" }}>
                      {displayProfilePicture(index)}
                      <div style={{ border: "1px solid black", padding: "0rem 0.75rem", marginRight: "4rem", borderRadius: "20px" }}>{chat.message}</div>
                    </div>
                  )}
                </div>
              ))}
              {/* SENDING MESSAGES */}
              {selectedChat.sending.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.20rem", marginTop: "0.5rem" }}>
                  {selectedChat.sending.map((message, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "end" }}>
                      <div style={{ border: "1px solid", borderColor: "#555555", padding: "0rem 0.75rem", marginLeft: "4rem", color: "#555555", borderRadius: "20px" }}>{message}</div>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <div style={{ fontSize: "14px", color: "#333333" }}>Sending...</div>
                  </div>
                </div>
              )}
              {/* TYPING... */}
              {selectedChat.isTyping && <div style={{ color: "#555555" }}>Typing...</div>}
            </div>

            {/* MESSAGE BOX */}
            <form style={{ display: "flex" }}>
              <input type="text" placeholder="Enter a message" value={message} onChange={handleMessageChange} style={{ flex: 1 }} />
              <button type="submit" onClick={handleSend}>
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
