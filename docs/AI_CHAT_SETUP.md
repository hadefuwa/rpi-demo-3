# AI Chat Setup Guide

## Overview
This guide will help you set up the AI Chat feature on your Raspberry Pi to run Google Gemma 3 270M using Ollama.

## Prerequisites
- Raspberry Pi (3B+, 4, or 5 recommended)
- Internet connection for initial setup
- At least 1GB of free storage space

## Step 1: Install Ollama

### For Raspberry Pi (ARM64)
```bash
# Download and install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
sudo systemctl start ollama

# Enable Ollama to start on boot
sudo systemctl enable ollama
```

### For other systems
Visit [https://ollama.ai/download](https://ollama.ai/download) and follow the installation instructions for your platform.

## Step 2: Download Gemma 3 270M Model

```bash
# Pull the Gemma 3 270M model
ollama pull gemma3:270m
```

This will download approximately 292MB of data. The download may take a few minutes depending on your internet connection.

## Step 3: Verify Installation

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Test the model
ollama run gemma3:270m "Hello, how are you?"
```

You should see a response from the AI model.

## Step 4: Access the AI Chat

1. Start your Raspberry Pi showcase application
2. Navigate to the main menu
3. Tap on the "AI Chat" card (green card with robot emoji 🤖)
4. The chat interface will appear with an on-screen keyboard

## Features

### On-Screen Keyboard
- Full QWERTY layout optimized for touchscreen
- Numbers and special characters
- Backspace and space keys
- Visual feedback on key presses

### Chat Interface
- Real-time connection status indicator
- Message history with user and AI messages
- Typing indicators
- Local storage of chat history
- Clear chat functionality

### Connection Status
- **Green dot**: Connected and ready
- **Red dot**: Connection issues
- Status messages show specific problems:
  - "Ollama not running"
  - "Gemma 3 not found"
  - "Connection failed"

## Troubleshooting

### Ollama not starting
```bash
# Check Ollama status
sudo systemctl status ollama

# Restart Ollama
sudo systemctl restart ollama

# Check logs
sudo journalctl -u ollama -f
```

### Model not found
```bash
# List available models
ollama list

# Re-download the model
ollama pull gemma3:270m
```

### Connection refused
```bash
# Check if Ollama is listening on port 11434
netstat -tlnp | grep 11434

# Restart Ollama service
sudo systemctl restart ollama
```

### Performance Issues
- The 270M model is optimized for single GPU usage
- Close other applications to free up memory
- Ensure adequate cooling for your Raspberry Pi

## API Endpoints Used

The AI Chat uses these Ollama API endpoints:
- `GET /api/tags` - Check available models
- `POST /api/generate` - Generate AI responses

## Model Specifications

- **Model**: Google Gemma 3 270M
- **Parameters**: 268M
- **Context Window**: 32K tokens
- **Quantization**: Q8_0
- **Size**: ~292MB
- **Languages**: 140+ languages supported

## Security Notes

- Ollama runs locally on your device
- No data is sent to external servers
- Chat history is stored locally in browser localStorage
- The model operates completely offline once downloaded

## Performance Tips

1. **Memory**: Ensure at least 1GB of free RAM
2. **Storage**: Keep at least 500MB free for the model
3. **Cooling**: Monitor Pi temperature during extended use
4. **Network**: Initial download requires internet, but usage is offline

## Support

If you encounter issues:
1. Check the connection status in the chat interface
2. Verify Ollama is running: `sudo systemctl status ollama`
3. Test the model directly: `ollama run gemma3:270m "test"`
4. Check system resources: `htop` or `free -h`

## Advanced Configuration

### Custom Model Parameters
You can modify the model behavior by editing the API call in the chat interface:

```javascript
// In ai-chat.html, modify the request body:
body: JSON.stringify({
  model: 'gemma3:270m',
  prompt: message,
  stream: false,
  options: {
    temperature: 0.7,  // Adjust creativity (0.0-1.0)
    top_p: 0.9,        // Nucleus sampling
    top_k: 40          // Top-k sampling
  }
})
```

### Running on Different Port
If you need to run Ollama on a different port, modify the API calls in `ai-chat.html`:

```javascript
// Change all instances of localhost:11434 to your custom port
const response = await fetch('http://localhost:YOUR_PORT/api/tags', {
  // ... rest of the code
});
```
