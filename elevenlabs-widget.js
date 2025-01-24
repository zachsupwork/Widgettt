class ElevenLabsConvAI extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Initialize state and placeholders
    this.agentId = this.getAttribute("agent-id");
    this.apiKey = this.getAttribute("api-key"); // Optional if the key isn't hardcoded
    this.shadowRoot.innerHTML = `
      <style>
        #widget-container {
          width: 300px;
          height: 400px;
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 10px;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }
        #chat-log {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          padding: 5px;
          border-radius: 4px;
        }
        #input-container {
          display: flex;
          align-items: center;
        }
        #user-input {
          flex: 1;
          padding: 5px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        #send-button {
          padding: 5px 10px;
          margin-left: 5px;
          background: #007bff;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <div id="widget-container">
        <div id="chat-log"></div>
        <div id="input-container">
          <input id="user-input" type="text" placeholder="Type a message..." />
          <button id="send-button">Send</button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.chatLog = this.shadowRoot.getElementById("chat-log");
    this.userInput = this.shadowRoot.getElementById("user-input");
    this.sendButton = this.shadowRoot.getElementById("send-button");

    // Add event listeners
    this.sendButton.addEventListener("click", () => this.sendMessage());
  }

  async sendMessage() {
    const message = this.userInput.value;
    if (!message) return;

    // Append user message to chat log
    this.appendMessage("You", message);

    // Call ElevenLabs API
    const response = await this.fetchResponse(message);
    this.appendMessage("AI", response);
  }

  appendMessage(sender, message) {
    const newMessage = document.createElement("p");
    newMessage.textContent = `${sender}: ${message}`;
    this.chatLog.appendChild(newMessage);
  }

  async fetchResponse(message) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/conversations`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          initial_message: message,
          agent_id: this.agentId
        })
      });
      const data = await response.json();
      return data.response || "No response received.";
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Error fetching response. Please try again.";
    }
  }
}

// Define the custom element
customElements.define("elevenlabs-convai", ElevenLabsConvAI);
