import React, { useState } from "react";
import { MessageSquare, X, Send, Eye } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Toggle collapsible array items
  const [expandedArrays, setExpandedArrays] = useState({});

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const newChat = [...chat, { user: input }];
    setChat(newChat);

    try {
      const res = await fetch("http://localhost:5050/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      if (data.answer === "image" && data.imageUrl) {
        setChat([...newChat, { botImage: `http://localhost:5050${data.imageUrl}` }]);
      } else {
        setChat([...newChat, { bot: data.answer }]);
      }
    } catch (err) {
      setChat([...newChat, { bot: "⚠️ Error: " + err.message }]);
    }

    setInput("");
    setLoading(false);
  };

  // Helper: format arrays as collapsible chips
  const renderArray = (text, idx) => {
    const items = text.match(/[\w.-]+/g) || [];
    const expanded = expandedArrays[idx] || false;
    const visibleItems = expanded ? items : items.slice(0, 20);

    return (
      <div className="flex flex-wrap gap-2">
        {visibleItems.map((item, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs shadow-sm"
          >
            {item}
          </span>
        ))}
        {items.length > 20 && (
          <button
            className="text-xs text-gray-500 hover:underline ml-1"
            onClick={() =>
              setExpandedArrays({ ...expandedArrays, [idx]: !expanded })
            }
          >
            {expanded ? "Show Less" : `+ ${items.length - 20} more`}
          </button>
        )}
      </div>
    );
  };

  // Helper: render tables
  // Helper: render tables (fix for phrases with spaces)
const renderTable = (text) => {
  const rows = text
    .split("\n")
    .filter((line) => line.trim() !== ""); // keep lines, don't split by spaces

  return (
    <div className="overflow-x-auto max-h-64">
      <table className="border-collapse border border-gray-300 w-full text-xs">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-gray-300 px-2 py-1">{row}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


  // Helper: detect response type
  const renderBotMessage = (msg, idx) => {
    const text = msg.bot;

    if (!text) return null;

    // Image
    if (msg.botImage) return <img src={msg.botImage} alt="Chart" />;

    // JSON or array
    if ((text.startsWith("{") && text.endsWith("}")) || text.startsWith("["))
      return (
        <SyntaxHighlighter language="json" style={docco} wrapLongLines>
          {text}
        </SyntaxHighlighter>
      );

    // Array of items
    if (text.includes("[") && text.includes("]") && !text.includes("columns"))
      return renderArray(text, idx);

    // Table detection
    if (text.includes("[") && text.includes("columns") && text.includes("rows"))
      return renderTable(text);

    // Alerts
    if (text.toLowerCase().includes("error") || text.toLowerCase().includes("⚠️"))
      return (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded-md shadow-sm text-sm">
          {text}
        </div>
      );

    // Normal text
    return (
      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl rounded-bl-none text-sm max-w-[80%] shadow">
        {text}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-3 rounded-full shadow-xl hover:scale-105 transition"
        >
          <MessageSquare size={22} />
        </button>
      )}

      {isOpen && (
        <div className="w-96 max-w-full bg-white rounded-2xl h-[80vh] shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h2 className="text-sm font-semibold tracking-wide">Digital Assistant</h2>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scrollbar-thin scrollbar-thumb-gray-300">
            {chat.map((msg, i) => (
              <div key={i} className="flex flex-col gap-1">
                {msg.user && (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-xl rounded-br-none text-sm max-w-[80%] shadow-md">
                      {msg.user}
                    </div>
                  </div>
                )}
                {msg.bot && <div className="flex justify-start">{renderBotMessage(msg, i)}</div>}
                {msg.botImage && (
                  <div className="flex justify-start">
                    <img
                      src={msg.botImage}
                      alt="Generated Chart"
                      className="rounded-xl border border-gray-200 shadow max-w-full"
                    />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-center">
                <div className="animate-spin h-5 w-5 border-4 border-blue-600 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center p-4 border-t border-gray-200 bg-gray-50">
            <input
              className="flex-1 bg-white border border-gray-300 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="ml-2 text-blue-600 hover:text-blue-800 transition disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
