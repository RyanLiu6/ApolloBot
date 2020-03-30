// Basic requirements
const fs = require("fs");
const Enmap = require("enmap");
const snoowrap = require("snoowrap");
const Discord = require("discord.js");
const turnips = require("./hooks/turnips.js");

// Set up for local only
const dotenv = require('dotenv');
dotenv.config();

// Discord client
const client = new Discord.Client();

// Reddit client
const config = {
    userAgent: "Discord Bot",
    clientId: process.env.REDDIT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH
}

const reddit = new snoowrap(config);

// Attaching config and prefix to client for global availability
client.prefix = process.env.PREFIX;

const discord_init = async () => {
    fs.readdir("./events/", (err, files) => {
        if (err) {
            return console.error(err);
        }

        files.forEach(file => {
            const event = require(`./events/${file}`);
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
        });
    });

    client.commands = new Enmap();

    fs.readdir("./commands/", (err, files) => {
        if (err) {
            return console.error(err);
        }

        files.forEach(file => {
            if (!file.endsWith(".js")) {
                return;
            }

            let props = require(`./commands/${file}`);
            let commandName = file.split(".")[0];
            console.log(`Attempting to load command ${commandName}`);
            client.commands.set(commandName, props);
        });
    });

    // Here we login the client.
    await client.login(process.env.TOKEN);

    setInterval(function() {
        turnips.check(client, reddit)
    } , 3000);
};

discord_init();
