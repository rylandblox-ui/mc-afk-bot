const mineflayer = require('mineflayer');
const http = require('http');

// This keeps Render happy so your service never turns off
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running online 24/7!\n');
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Web server listening on port ${PORT}`);
});

function createBot() {
    const bot = mineflayer.createBot({
        host: 'oneblocky1221.aternos.me', 
        port: 16363,                      // Your exact Aternos port!
        username: 'AFK_Bot_OneBlock'      
    });

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
