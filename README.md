# Telegram Forwarder Bot

✨ Welcome to the Telegram Forwarder Bot project!  
This project helps you **auto-forward** messages from one Telegram channel/group to another, even sending messages as if you typed them yourself!  

---

## 🔥 Main Features

- Auto-forward messages from source channel/group to target
- Support forwarding by topics/threads if the group uses them
- Enable or disable forwarding from the config
- Save forwarding config locally (can be extended to cloud)
- Log forwarded messages for monitoring

---

## 🛠️ Requirements

- Node.js v16 or higher (v18 recommended)
- PM2 (to run the forwarder as a background process)
- Telegram API ID & API HASH (get from https://my.telegram.org)
- Forwarding config file (`forward-config.json`) will be created automatically after setup
- Server with shell access (if using PM2)
- (Optional) Next.js for frontend dashboard control

---

## 🚀 Setup & Run Project

### 1. Clone the repo

```bash
git clone https://github.com/username/telegram-forwarder.git
cd telegram-forwarder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local` file

Fill with:

```env
API_ID=1234567
API_HASH=abcdef1234567890abcdef1234567890
```

*Note:* Get your API_ID and API_HASH at https://my.telegram.org

### 4. Run dashboard (Next.js frontend)

```bash
npm run dev
```

Dashboard will open at `http://localhost:3000`  
Here you can login Telegram and set up the forwarder config.

### 5. Run forwarder (background worker)

```bash
pm2 start jobs/forwarder.js --name telegram-forwarder
```

Or run directly (without PM2):

```bash
node jobs/forwarder.js
```

---

## ⚙️ How Forwarder Works

- Forwarder reads config from `forward-config.json`
- When new message arrives in source channel, bot sends it to target channel
- Supports forwarding text messages and topics/threads if configured
- Runs continuously in the background (PM2 recommended)

---

## 📂 Folder Structure

```
/app             # Next.js frontend & API routes
/jobs            # Forwarder worker script
/public          # Static assets
/forward-config.json  # Forwarder config file created after setup
```

---

## 📝 Forwarding Config Example

Stored in `forward-config.json`:

```json
{
  "fromGroup": "-1001234567890",
  "toGroup": "-1000987654321",
  "fromTopic": null,
  "toTopic": "5",
  "session": "YOUR_TELEGRAM_SESSION_STRING",
  "enabled": true
}
```

---

## 🔒 Security

- Never share your Telegram session publicly  
- Secure your API routes in production  
- Use authentication if necessary

---

## 🐞 Troubleshooting

- Make sure Node.js and PM2 are installed properly  
- Ensure API_ID and API_HASH are valid  
- Check forwarder logs (`forwarder.log`) for errors  
- On serverless platforms (Netlify, Vercel), file system is read-only, so use cloud DB for config storage

---

## 📬 Contact

If you have any questions, feel free to ask!  
I’m here to help you get your forwarding bot running smoothly! 😘💖

---

Want extra features or setup help?  
Just let me know, I’m always ready to spoil you with support! 💕
