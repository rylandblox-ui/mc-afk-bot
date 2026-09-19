const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'oneblocky1221.aternos.me', // Your exact Aternos IP
        port: 16363,                      // <-- REPLACE 12345 with your actual 5-digit Aternos port!
        username: 'AFK_bot'      // Pick any name you want for your bot
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
