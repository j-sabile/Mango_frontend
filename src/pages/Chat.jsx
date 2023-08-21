// import { useState } from "react";
// import NavBar from "../components/NavBar";

// function Chat() {
//   const [conversations, setConversations] = useState([]);
//   const userType = localStorage.getItem("userType");

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//       <NavBar />
//       <h3>Chat</h3>
//       <div style={{ display: "flex", flexGrow: "1" }}>
//         {/* SIDE BAR */}
//         <div style={{ display: "flex", flexDirection: "column", width: "250px" }}>
//           {conversations?.map((chat, index) => (
//             <div key={index} style={{ border: "1px solid black", padding: "0.5rem 1rem", cursor: "pointer" }} onClick={() => handleSelectChat(chat._id)}>
//               {userType === "Customer" && <div style={{ fontWeight: "500" }}>{chat.shop.name}</div>}
//               {userType === "Shop" && <div style={{ fontWeight: "500" }}>{`${chat.customer.first_name} ${chat.customer.last_name}`}</div>}
//               {userType !== chat.last_message?.sender && <div>{chat.last_message?.message}</div>}
//               {userType === chat.last_message?.sender && <div>{`You: ${chat.last_message?.message}`}</div>}
//             </div>
//           ))}
//         </div>
//         {selectedChat !== null && (
//           <div style={{ flex: 1, border: "1px solid black", padding: "0.5rem", display: "flex", flexDirection: "column" }}>
//             {/* HEADER */}
//             <div>
//               <h5>
//                 {userType === "Shop" && `${selectedChat.customer.first_name} ${selectedChat.customer.last_name}`}
//                 {userType === "Customer" && selectedChat.shop.name}
//               </h5>
//             </div>
//             {/* MESSAGES */}
//             <div style={{ display: "flex", flexDirection: "column", gap: "0.20rem", overflowY: "scroll", flexGrow: "1", height: "1px", padding: "1rem 0rem" }}>
//               {selectedChat.messages.map((chat, index) => (
//                 <div key={index}>
//                   {chat?.sender === userType ? (
//                     <div style={{ display: "flex", justifyContent: "end" }}>
//                       <div style={{ border: "1px solid black", padding: "0rem 0.75rem", marginLeft: "4rem", borderRadius: "20px" }}>{chat.message}</div>
//                     </div>
//                   ) : (
//                     <div style={{ display: "flex", justifyContent: "start", gap: "0.5rem" }}>
//                       {displayProfilePicture(index)}
//                       <div style={{ border: "1px solid black", padding: "0rem 0.75rem", marginRight: "4rem", borderRadius: "20px" }}>{chat.message}</div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//               {/* SENDING MESSAGES */}
//               {selectedChat.sending.length > 0 && (
//                 <div style={{ display: "flex", flexDirection: "column", gap: "0.20rem", marginTop: "0.5rem" }}>
//                   {selectedChat.sending.map((message, index) => (
//                     <div key={index} style={{ display: "flex", justifyContent: "end" }}>
//                       <div style={{ border: "1px solid", borderColor: "#555555", padding: "0rem 0.75rem", marginLeft: "4rem", color: "#555555", borderRadius: "20px" }}>{message}</div>
//                     </div>
//                   ))}
//                   <div style={{ display: "flex", justifyContent: "end" }}>
//                     <div style={{ fontSize: "14px", color: "#333333" }}>Sending...</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* TEXT BOX */}
//             <form style={{ display: "flex" }}>
//               <input type="text" placeholder="Enter a message" value={message} onChange={(e) => setMessage(e.target.value)} style={{ flex: 1 }} />
//               <button type="submit" onClick={handleSend}>
//                 Send
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Chat;

////////////////////////////////////////////////////////

import { useRef } from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import NavBar from "../components/NavBar";

function Chat() {
  const userType = localStorage.getItem("userType");
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const s = useRef(null);
  const conversationsRef = useRef(conversations);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/conversations`, { method: "GET", credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error(res.status);
      })
      .then((res) => {
        const request = res.request.map((i) => ({ ...i, sending: [] }));
        setConversations(request);
        conversationsRef.current = request;
      });

    const localSocket = io("ws://localhost:3001", { withCredentials: true });
    localSocket.emit("seen", { conversationId: "123", messageId: "345" });
    setSocket(localSocket);

    localSocket.on("message", ({ doc, conversationId }) => {
      console.log("Received a message:", doc);
      const temp = [...conversationsRef.current];

      for (let i = 0; i < temp.length; i++) {
        if (temp[i]._id === conversationId) {
          temp[i].messages.push(doc);
          temp[i].last_message = { message: doc.message, sender: doc.sender, timestamp: doc.timestamp };
          temp.unshift(temp[i]);
          temp.splice(i + 1, 1);
          break;
        }
      }
      setConversations(temp);
      conversationsRef.current = temp;
    });

    // message is sent
    localSocket.on("ack_message", ({ doc, conversationId }) => {
      console.log("ack_message", doc.message);
      // const tempMessages = [....current];
      const tempConversations = [...conversationsRef.current];
      // console.log("old tempConversations", tempConversations);
      // console.log("doc:", doc);
      // setConversations((tempConversations) => {
      for (let i = 0; i < tempConversations.length; i++) {
        if (tempConversations[i]._id === conversationId) {
          const index = tempConversations[i].sending.findIndex((j) => j === doc.message);
          console.log(index);
          if (index !== -1) tempConversations[i].sending.splice(index, 1);
          // console.log("new tempConversations", tempConversations);
          // console.log("changing conversations");
          tempConversations[i].messages.push(doc);
          console.log(tempConversations);
          conversationsRef.current = tempConversations;

          break; // return tempConversations;
        }
      }
      console.log("ack", tempConversations);
      setConversations(tempConversations);

      // console.log("ack messages:", tempMessages);
      // for (let i = 0; i < tempMessages.length; i++) {
      //   console.log(tempMessages[i], doc.message, tempMessages[i] === doc.message);
      //   if (tempMessages[i] === doc.message) {
      //     const temp = tempMessages;
      //     temp.splice(i, 1);
      //     console.log("to", temp);
      //     setSendingMessages(temp);

      //     break;
      //   }
      // }
    });
  }, []);

  useEffect(() => {
    if (socket === null || conversations?.length === 0 || !loading) return;
    setLoading(false);
  }, [socket, conversations]);

  // changing selected chat
  useEffect(() => {
    console.log("Trying to change selected chat");
    if (selectedChatId !== null) {
      const found = conversations?.find((i) => i._id === selectedChatId);
      console.log("found", found);
      if (found === undefined) return setSelectedChat(null);
      setSelectedChat(found);
      s.current = found;
    }
  }, [selectedChatId, conversations]);

  const handleSelectChat = async (id) => setSelectedChatId(id);

  useEffect(() => console.log("conversations:", conversations), [conversations]);
  useEffect(() => console.log("selectedChat:", selectedChat), [selectedChat]);
  useEffect(() => console.log("selectedChatId:", selectedChatId), [selectedChatId]);

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
  };

  const addSending = () => {
    // setConversations([]);
    const temp = [...conversationsRef.current];
    console.log("old temp", temp);
    for (let i = 0; i < temp.length; i++) {
      if (temp[i]._id === selectedChatId) {
        temp[i].sending.push(message);
        temp.unshift(temp[i]);
        temp.splice(i + 1, 1);
        console.log("new temp", temp);
        console.log("sending: ", temp);
        // conversationsRef.current = temp;
        break;
        // return temp;
      }
    }
    conversationsRef.current = temp;
    setConversations(temp);

    if (userType === "Shop") socket.emit("message", { recipientType: userType, recipientId: selectedChat.customer._id, conversationId: selectedChat._id, message: message.trim() });
    else if (userType === "Customer") socket.emit("message", { recipientType: userType, recipientId: selectedChat.shop._id, conversationId: selectedChat._id, message: message.trim() });
    setMessage("");
  };

  const addSendingTest = () => {
    setConversations([
      {
        last_message: { sender: "Customer", message: "Is anyone here?", timestamp: "2023-08-20T00:50:00.000Z" },
        last_message_date: "2023-08-20T00:50:00.000Z",
        messages: [
          { _id: "64e15da7dd1499e08e189381", sender: "Customer", message: "World", timestamp: "2023-08-20T00:26:15.353Z" },
          { _id: "64e15dbcdd1499e08e189394", sender: "Customer", message: "Hello", timestamp: "2023-08-20T00:40:24.422Z" },
          { _id: "64e15dbcdd1499e08e195391", sender: "Customer", message: "Is anyone here?", timestamp: "2023-08-20T00:50:00.000Z" },
        ],
        sending: [],
        shop: { _id: "64d938ed01755ee3737c2e6e", name: "Jane Doe" },
        status: "Sent",
        _id: "64d9753bfb4f04acd5a354a8",
      },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavBar />
      <h3>Chat</h3>
      <div style={{ display: "flex", flexGrow: "1" }}>
        <div style={{ display: "flex", flexDirection: "column", width: "250px" }}>
          {conversations?.map((chat, index) => (
            <div key={index} style={{ border: "1px solid black", padding: "0.5rem 1rem", cursor: "pointer" }} onClick={() => handleSelectChat(chat._id)}>
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

            {/* MESSAGES */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.20rem", overflowY: "scroll", flexGrow: "1", height: "1px", padding: "1rem 0rem" }}>
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
            </div>

            {/* TEXT BOX */}
            <form style={{ display: "flex" }}>
              <input type="text" placeholder="Enter a message" value={message} onChange={(e) => setMessage(e.target.value)} style={{ flex: 1 }} />
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
