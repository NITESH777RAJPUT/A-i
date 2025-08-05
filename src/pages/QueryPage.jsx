import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// --- Icons for better UI ---
const UploadIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);
const SendIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
);
const DownloadIcon = () => (
  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);
const BotIcon = () => (
  <svg className="w-8 h-8 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 7h14c.552 0 1 .448 1 1v8c0 .552-.448 1-1 1H5c-.552 0-1-.448-1-1V8c0-.552.448-1 1-1zM5 7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V7z"></path>
  </svg>
);
const UserIcon = () => (
  <svg className="w-8 h-8 text-green-500 dark:text-green-400 flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
  </svg>
);
const HistoryIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const QueryPage = ({ token, onLogout }) => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history on component mount
  useEffect(() => {
    fetchChatSessions();
  }, [token]);

  // Add a message to the chat history
  const addMessage = (sender, text, type = 'text') => {
    setMessages(prev => [...prev, { sender, text, type, timestamp: new Date() }]);
  };

  const fetchChatSessions = async () => {
    try {
      const res = await axios.get('https://ai-ja3l.onrender.com/api/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatSessions(res.data);
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
    }
  };

  // Function to start a new chat session
  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    fetchChatSessions(); // Refresh sessions list
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    addMessage('status', `⏳ Uploading "${file.name}"...`);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://ai-ja3l.onrender.com/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      addMessage('status', `✅ ${res.data.message}`);
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Upload failed';
      if (err.response?.status === 401 || /invalid token/i.test(errorMsg)) {
        addMessage('status', '❌ Session expired. Please log in again.');
        setTimeout(() => onLogout(), 2000);
      } else {
        addMessage('status', `❌ ${errorMsg}`);
      }
    }
  };

  const handleUrlUpload = async () => {
    if (!pdfUrl || !/\.(pdf|docx|eml)(\?.*)?$/.test(pdfUrl)) {
      return addMessage('status', '❌ Please enter a valid .pdf, .docx, or .eml URL');
    }
    addMessage('status', `⏳ Fetching from URL...`);
    try {
      const res = await axios.post('https://ai-ja3l.onrender.com/api/upload/url', { pdfUrl }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      addMessage('status', `✅ ${res.data.message}`);
      setPdfUrl('');
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'URL upload failed';
      if (err.response?.status === 401 || /invalid token/i.test(errorMsg)) {
        addMessage('status', '❌ Session expired. Please log in again.');
        setTimeout(() => onLogout(), 2000);
      } else {
        addMessage('status', `❌ ${errorMsg}`);
      }
    }
  };

  const handleQuerySubmit = async () => {
    if (!query.trim()) return;
    addMessage('user', query);
    setQuery('');
    setIsLoading(true);

    try {
      const res = await axios.post('https://ai-ja3l.onrender.com/api/query', { query, sessionId: currentSessionId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newBotMessage = {
        sender: 'bot',
        text: res.data,
        type: 'json',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newBotMessage]);
      setCurrentSessionId(res.data.sessionId);
      fetchChatSessions(); // Refresh sessions list
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Query failed';
      if (err.response?.status === 401 || /invalid token/i.test(errorMsg)) {
        addMessage('status', '❌ Session expired. Please log in again.');
        setTimeout(() => onLogout(), 2000);
      } else {
        addMessage('bot', { error: '❌ Query Failed', details: errorMsg }, 'json');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadJson = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llm-response.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Load a previous chat session based on sessionId
  const loadSession = async (sessionId) => {
    try {
      const res = await axios.get(`https://ai-ja3l.onrender.com/api/history/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages);
      setCurrentSessionId(sessionId);
    } catch (err) {
      console.error('Failed to load chat session:', err);
      addMessage('status', '❌ Failed to load chat session.');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-white dark:bg-gray-800 transition-colors duration-300">
      {/* Sidebar for Upload/URL and History */}
      <div className="w-1/4 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 p-6 flex flex-col space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Document Input</h3>

        {/* File Upload */}
        <div className="flex flex-col items-center space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <input
            type="file"
            accept=".pdf,.docx,.eml"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
            title="Upload Document"
          >
            <UploadIcon /> <span className="ml-2">Upload Document</span>
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">(.pdf, .docx, .eml)</span>
        </div>

        {/* URL Upload */}
        <div className="flex flex-col space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <label htmlFor="pdf-url-input" className="text-sm font-medium text-gray-700 dark:text-gray-200">Or paste a URL:</label>
          <input
            id="pdf-url-input"
            type="text"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlUpload()}
            placeholder="e.g., https://example.com/doc.pdf"
            className="w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition duration-150 ease-in-out bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            onClick={handleUrlUpload}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transform transition-transform duration-200 hover:scale-105"
          >
            Fetch URL
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={startNewChat}
          className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 transform hover:scale-105"
          title="Start a New Chat"
        >
          <PlusIcon /> <span className="ml-2">New Chat</span>
        </button>

        {/* Chat History */}
        <div className="flex flex-col space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center">
            <HistoryIcon /> Chat History
          </h3>
          <div className="overflow-y-auto max-h-96 custom-scrollbar">
            {chatSessions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No chat history yet.</p>
            ) : (
              chatSessions.map((session, index) => (
                <button
                  key={index}
                  onClick={() => loadSession(session.sessionId)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                    session.sessionId === currentSessionId
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-gray-700 dark:text-gray-200">
                    Chat from {new Date(session.createdAt).toLocaleString()}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="flex-grow"></div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-grow">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-md flex items-center justify-between">
          <h2 className="text-2xl font-bold">CogniDoc AI Assistant</h2>
        </div>

        <div className="flex-grow p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900 custom-scrollbar">
          <div className="space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-start`}>
                {msg.sender === 'bot' && <BotIcon />}
                {msg.type === 'status' ? (
                  <div className="text-center w-full">
                    <span className="text-sm text-gray-600 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-800 rounded-full px-4 py-2 shadow-sm italic">{msg.text}</span>
                  </div>
                ) : (
                  <div className={`max-w-3xl p-4 rounded-xl shadow-md transform transition-all duration-300 ease-out
                    ${msg.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none animate-slide-in-right'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600 animate-slide-in-left'
                    }`}>
                    {msg.type === 'json' ? (
                      <div>
                        <pre className="text-sm whitespace-pre-wrap bg-gray-800 dark:bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto custom-scrollbar">
                          {typeof msg.text === 'string'
                            ? msg.text
                            : JSON.stringify(msg.text, null, 2)
                          }
                        </pre>

                        <button
                          onClick={() => downloadJson(msg.text)}
                          className="mt-3 flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200"
                        >
                          <DownloadIcon /> Download JSON
                        </button>
                      </div>
                    ) : (
                      <p className="text-base">{msg.text}</p>
                    )}
                  </div>
                )}
                {msg.sender === 'user' && <UserIcon />}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-start animate-pulse">
                <BotIcon />
                <div className="max-w-3xl p-4 rounded-xl shadow-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-600">
                  <p className="text-base">AI is thinking<span className="animate-ping-dots">.</span><span className="animate-ping-dots delay-100">.</span><span className="animate-ping-dots delay-200">.</span></p>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex items-center space-x-3 bg-white dark:bg-gray-800 shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
            placeholder="Ask your query about the document..."
            className="flex-grow border border-gray-300 dark:border-gray-600 px-5 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-base shadow-sm transition duration-150 ease-in-out bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleQuerySubmit}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-transform duration-200 hover:scale-105"
            title="Send Query"
            disabled={isLoading}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryPage;