// Import the required modules
const fs = require('fs');
const Discord = require('discord.js');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Import the required files
const config = require('../config.json');
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js'));

// Define clients, etc.
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGES", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"]});
const app = express();
admin.initializeApp({
    credential: admin.credential.cert(require('../firebaseServiceAccountKey.json'))
});
const db = admin.firestore();

// Enable CORS for the http server
app.use(cors());

// Define some required variables
const prefix = config.prefix;
const commandArray = [];
const PORT = process.env.PORT || 5000;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    commandArray.push(command);
}
fs.writeFileSync('./commands.json', JSON.stringify(commandArray));

app.get('/commands', (req, res) => {
    res.status(200).send(JSON.stringify(commandArray));
});

app.get('/info', (req, res) => {
    res.status(200).send(JSON.stringify({
        clientInfo: client.user,
        guilds: client.guilds.cache.size,
        users: client.guilds.cache.reduce((a, b) => a + b.memberCount, 0),
        channels: client.guilds.cache.reduce((a, b) => a + b.channels.cache.size, 0),
    }));
});

/*
app.post('/donation', (req, res) => {
    req.on('data', (data) => {
        data = JSON.parse(data);
        data = data.data;

        if (data.verification_token !== config.kofi-key) return res.status(403).send(JSON.stringify({error: 'Invalid verification token'}));

        const donation = {
            amount: data.amount,
            currency: data.currency,
            at: data.timestamp,
            type: data.type,
            url: data.url,
            from: {
                name: data.from_name,
                email: data.email,
                message: data.message
            }
        };
    })
});
*/

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('messageCreate', message => {
	if (message.content.includes(`<@${client.user.id}>`) || message.content.includes(`<@!${client.user.id}>`)) return message.reply(`Hey there! My prefix is \`${prefix}\`! To see what I can do, type \`${prefix}help\`.`);
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    for (cmd of commandArray) {
        if (cmd.name === command || cmd.aliases.includes(command)) {
            cmd.execute(client, message, args, db);
        }
    }
});

app.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
});

client.login(config.token);