const mineflayer = require('mineflayer');
const http = require('http');
const url = require('url');

let globalBot = null;

// HTML Dashboard for your Render site
const htmlDashboard = `
<!DOCTYPE html>
<html>
<head>
    <title>Minecraft AFK Bot Controller</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: sans-serif; background: #121212; color: #fff; text-align: center; padding: 20px; }
        input { padding: 12px; width: 70%; max-width: 400px; border-radius: 4px; border: 1px solid #333; background: #222; color: #fff; margin-bottom: 10px; }
        button { padding: 12px 20px; border: none; border-radius: 4px; background: #4CAF50; color: white; cursor: pointer; font-weight: bold; }
        button:hover { background: #45a049; }
        .status { margin-bottom: 20px; font-size: 1.2em; color: #81C784; }
    </style>
</head>
<body>
    <h1>🤖 Bot Control Panel</h1>
    <div class="status">Bot Status: Online 24/7</div>
    
    <form action="/send" method="GET">
        <input type="text" name="msg" placeholder="Type a message or command (e.g. /spawn)..." required autocomplete="off">
        <br>
        <button type="submit">Send to Game</button>
    </form>
</body>
</html>
`;

// Create the web server
const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    
    // Endpoint to process commands sent from the webpage
    if (reqUrl.pathname === '/send') {
        const messageToSend = reqUrl.query.msg;
        if (globalBot && globalBot.entity && messageToSend) {
            globalBot.chat(messageToSend); // Makes the bot talk or execute a command in game
            console.log(`[Web Control] Sent message: ${messageToSend}`);
        }
        // Redirect back to the main page
        res.writeHead(302, { 'Location': '/' });
        return res.end();
    }
    
    // Default page: Show the dashboard
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlDashboard);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

function createBot() {
    const bot = mineflayer.createBot({
        host: 'oneblocky1221.aternos.me', 
        port: 16363,                      
        username: 'AFK_Bot_OneBlock'      
    });

    globalBot = bot; // Link the bot instance to the global variable so the website can use it

    bot.on('spawn', () => {
        console.log('Success! Your AFK bot has spawned into oneblocky1221.');
    });

    // Automatically jumps every 15 seconds to prevent Aternos idle kicks
    setInterval(() => {
        if (bot.entity) {
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
        }
    }, 15000);

    // Auto-reconnect if the server restarts
    bot.on('end', () => {
        console.log('Disconnected from Aternos. Retrying connection in 15 seconds...');
        setTimeout(createBot, 15000);
    });

    bot.on('error', (err) => console.log('Error encountered:', err));
}

createBot();
