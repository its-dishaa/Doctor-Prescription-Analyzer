import { useEffect, useRef, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function Chatbot({ investigations = [] }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm Claris AI. How can I help you?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, loading]);


  // ==========================================
  // TEXT TO SPEECH
  // ==========================================

  const speakAnswer = (text) => {
    if (!window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeaking(true);
    };

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };


  // ==========================================
  // SEND MESSAGE
  // ==========================================

  const sendMessage = async (messageText = null) => {
    const userMessage =
      messageText !== null
        ? messageText.trim()
        : input.trim();

    if (!userMessage || loading) {
      return;
    }

    const previousMessages = messages;

    const updatedMessages = [
      ...previousMessages,
      {
        role: "user",
        content: userMessage
      }
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/v1/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: userMessage,
            conversation: previousMessages,
            investigations: investigations
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          `Chat request failed: ${response.status}`
        );
      }

      const data = await response.json();

      const assistantMessage = {
        role: "assistant",
        content: data.reply
      };

      setMessages([
        ...updatedMessages,
        assistantMessage
      ]);

      speakAnswer(data.reply);

    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the AI assistant."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // VOICE INPUT
  // ==========================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (listening) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0][0].transcript;

      setInput(transcript);

      sendMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };


  // ==========================================
  // STOP SPEAKING
  // ==========================================

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setSpeaking(false);
  };


  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort();
    };
  }, []);


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="ai-agent-page">

      {/* ================= HEADER ================= */}

      <div className="ai-agent-header">

        <div className="ai-agent-heading">

          <div className="ai-agent-icon">
            ✨
          </div>

          <div>
            <h1>Claris AI</h1>

            <p>
              Your local AI medical assistant
            </p>
          </div>

        </div>

        <div className="ai-agent-status">
          <span></span>
          Local AI
        </div>

      </div>


      {/* ================= CHAT ================= */}

      <div className="ai-agent-chat">

        <div className="chatbot-messages">

          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.role}`}
            >
              <div className="chat-message-content">
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message assistant">

              <div className="chat-message-content">
                Thinking...
              </div>

            </div>
          )}

          <div ref={messagesEndRef} />

        </div>

      </div>


      {/* ================= SPEAKING ================= */}

      {speaking && (
        <div className="chatbot-speaking">

          🔊 Speaking...

          <button onClick={stopSpeaking}>
            Stop
          </button>

        </div>
      )}


      {/* ================= INPUT ================= */}

      <div className="ai-agent-input-container">

        <div className="chatbot-input-area">

          <input
            type="text"
            value={input}
            placeholder={
              listening
                ? "Listening..."
                : "Ask Claris AI anything..."
            }
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            disabled={loading}
          />


          {/* MIC */}

          <button
            className={`chatbot-voice ${
              listening ? "listening" : ""
            }`}
            onClick={startListening}
            disabled={loading}
            title="Speak"
          >
            {listening ? "🔴" : "🎙️"}
          </button>


          {/* SEND */}

          <button
            className="chatbot-send"
            onClick={() => sendMessage()}
            disabled={
              loading || !input.trim()
            }
            title="Send"
          >
            ➤
          </button>

        </div>

        <p className="ai-agent-disclaimer">
          Claris AI runs locally using Qwen.
        </p>

      </div>

    </div>
  );
}

export default Chatbot;