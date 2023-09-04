import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import NavBar from "../components/NavBar";

const dict = { Shop: "customer", Customer: "shop" };

function Chat() {
  const userType = localStorage.getItem("userType");
  const chatSeen = `${dict[userType]}_seen`;
  const chatReceived = `${dict[userType]}_received`;
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [sendTypingInterval, setSendingTypeInterval] = useState(null);
  const [sendTypingIntervalRunning, setSendTypingIntervalRunning] = useState(false);
  const conversationsRef = useRef(conversations);
  const selectedChatIdRef = useRef(selectedChatId);
  const scrollableRef = useRef(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/conversations`, { method: "GET", credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error(res.status);
      })
      .then((res) => {
        const request = res.request.map((i) => ({ ...i, sending: [], isTyping: false, intervalId: null }));
        setConversations(request.reverse());
        conversationsRef.current = request;
      });

    const localSocket = io(import.meta.env.VITE_SOCKET_API, { withCredentials: true });
    setSocket(localSocket);
    localSocket.on("message", ({ doc, conversationId }) => addMessageToConversation(conversationId, doc, false, localSocket));
    localSocket.on("ack_message", ({ doc, conversationId }) => addMessageToConversation(conversationId, doc, true, null));
    localSocket.on("start_typing", receiveStartTyping);
    localSocket.on("stop_typing", receiveStopTyping);
    localSocket.on("seen", onSeen);
    localSocket.on("received", onReceived);

    return () => {
      setSelectedChatId(null);
      selectedChatIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (selectedChatId !== null && conversations.length !== 0) {
      const found = conversations?.find((i) => i._id === selectedChatId);
      if (found === undefined) return setSelectedChat(null);
      setSelectedChat(found);
      stopSendingTyping();
      if (scrollableRef.current !== null) scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [selectedChatId, conversations]);

  useEffect(() => {
    if (scrollableRef.current !== null) scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
  }, [selectedChat]);

  useEffect(() => {
    if (socket) socket.emit("seen", { conversationId: selectedChatId });
    setMessage("");
    stopSendingTyping();
  }, [selectedChatId]);

  const onSeen = ({ conversationId, date }) => onSeenOrReceived("seen", conversationId, date);
  const onReceived = ({ conversationId, date }) => onSeenOrReceived("received", conversationId, date);
  const onSeenOrReceived = (status, conversationId, date) => {
    const temp = [...conversationsRef.current];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id == conversationId) {
        if (status === "seen") temp[i][chatSeen] = date;
        temp[i][chatReceived] = date;
        break;
      }
    }
    setConversations(temp);
    conversationsRef.current = temp;
  };

  const addMessageToConversation = (conversationId, message, removeInSending, localSocket) => {
    const temp = [...conversationsRef.current];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === conversationId) {
        if (removeInSending) {
          const index = temp[i].sending.findIndex((j) => j === message.message);
          if (index !== -1) temp[i].sending.splice(index, 1);
        } else selectedChatIdRef.current === conversationId ? localSocket.emit("seen", { conversationId: selectedChatIdRef.current }) : localSocket.emit("received", { conversationId: conversationId });
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

  const seenIcon = () => (
    <div style={{ display: "flex", justifyContent: "end", margin: "0.25rem 0rem" }}>
      <div style={{ backgroundColor: "#999999", height: "12px", width: "12px", borderRadius: "50%" }} />
    </div>
  );
  const receivedIcon = () => <div style={{ display: "flex", justifyContent: "end", fontSize: "12px", marginBottom: "0.25rem" }}>Received</div>;
  const sentIcon = () => <div style={{ display: "flex", justifyContent: "end", fontSize: "12px", marginBottom: "0.25rem" }}>Sent</div>;

  const showStatus = (i) => {
    if (selectedChat.messages.length === i + 1) {
      if (selectedChat.last_message.sender === userType) {
        if (selectedChat[chatSeen] >= selectedChat.last_message.timestamp) return seenIcon();
        else if (selectedChat[chatReceived] >= selectedChat.last_message.timestamp) return receivedIcon();
        else return sentIcon();
      } else return seenIcon();
    } else if (selectedChat.last_message.sender === userType) {
      if (selectedChat[chatSeen] > selectedChat.messages[i].timestamp && selectedChat[chatSeen] < selectedChat.messages[i + 1].timestamp) return seenIcon();
      else if (selectedChat[chatReceived] > selectedChat.messages[i].timestamp && selectedChat[chatReceived] < selectedChat.messages[i + 1].timestamp) return receivedIcon();
    }
  };

  const handleSelectChatId = (id) => {
    setSelectedChatId(id);
    selectedChatIdRef.current = id;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <NavBar />
      <div style={{ display: "flex", flexGrow: "1" }}>
        <div className="d-flex flex-column" style={{ width: "250px", backgroundColor: "#FEF7D7" }}>
          <div className="fw-semibold fs-5 py-3 ps-3 pe-1" style={{ height: "60px" }}>
            Messages
          </div>
          <hr className="m-0" />
          {/* CONVERSATION TILES */}
          <div className="d-flex flex-column">
            {conversations?.map((chat, index) => (
              <div className={`conv-tile rounded-4 ptr px-3 py-3 ${selectedChatId === chat._id ? "conv-tile-selected" : ""}`} onClick={() => handleSelectChatId(chat._id)} key={index}>
                {userType === "Customer" && <div className="fw-semibold">{chat.shop.name}</div>}
                {userType === "Shop" && <div className="fw-semibold">{`${chat.customer.first_name} ${chat.customer.last_name}`}</div>}
                {userType !== chat.last_message?.sender && <div>{chat.last_message?.message}</div>}
                {userType === chat.last_message?.sender && <div>{`You: ${chat.last_message?.message}`}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex flex-column flex-fill">
          {/* HEADER */}
          <div className="d-flex align-items-center px-3" style={{ backgroundColor: "#FEF7D7", height: "60px" }}>
            <h5 className="m-0 fw-semibold">
              {userType === "Shop" && selectedChat !== null && `${selectedChat?.customer?.first_name} ${selectedChat?.customer.last_name}`}
              {userType === "Customer" && selectedChat !== null && selectedChat?.shop.name}
            </h5>
          </div>
          <hr className="m-0" />

          {/* ALL MESSAGES */}
          <div
            className="d-flex flex-column py-3 px-2"
            ref={scrollableRef}
            style={{ gap: "0.20rem", overflowY: "scroll", flexGrow: "1", height: "1px", background: "radial-gradient(circle, rgba(252,250,238,1) 35%, rgba(240,229,168,1) 100%)" }}>
            {/* MESSAGES */}
            {selectedChat?.messages.map((chat, index) => (
              <div key={index}>
                {chat?.sender === userType ? (
                  <div style={{ display: "flex", justifyContent: "end" }}>
                    <div className="msg-tile-me rounded-pill">{chat.message}</div>
                    {/* <div style={{ border: "1px solid black", padding: "0rem 0.75rem", marginLeft: "4rem", borderRadius: "20px" }}>{chat.message}</div> */}
                  </div>
                ) : (
                  <div className="d-flex align-items-center gap-2">
                    {displayProfilePicture(index)}
                    {/* <div style={{ border: "1px solid black", padding: "0rem 0.75rem", marginRight: "4rem", borderRadius: "20px" }}>{chat.message}</div> */}
                    <div className="msg-tile-you rounded-pill">{chat.message}</div>
                  </div>
                )}
                {showStatus(index)}
              </div>
            ))}
            {/* SENDING MESSAGES */}
            {selectedChat?.sending.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.20rem", marginTop: "0.5rem" }}>
                {selectedChat.sending.map((message, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: "end" }}>
                    <div className="msg-tile-me rounded-pill">{message}</div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <div style={{ fontSize: "14px", color: "#333333" }}>Sending...</div>
                </div>
              </div>
            )}
            {/* TYPING... */}
            {selectedChat?.isTyping && <div style={{ color: "#555555" }}>Typing...</div>}
          </div>

          <hr className="m-0" />
          {/* MESSAGE BOX */}
          <form className="d-flex py-2 ps-2 gap-1" style={{ backgroundColor: "#FEF7D7" }}>
            <input type="text" className="form-control rounded-pill px-3" placeholder="Enter a message" value={message} onChange={handleMessageChange} style={{ flex: 1 }} />
            <button type="submit" className="btn px-3" onClick={handleSend}>
              Send
            </button>
          </form>
        </div>
        {/* )} */}
      </div>
    </div>
  );
}

export default Chat;
