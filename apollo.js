// Basic requirements
const Discord = require("discord.js");
const client = new Discord.Client();

// Requirement for Discord Token - Not pushed
const configJson = require("./config.json");

// Prefix for messages
const prefix = configJson.prefix;

// On load
client.on("ready", () => {
    console.log("I am ready!");
});

// On message
client.on("message", (message) => {
    // Check if prefix exists
    if (!(message.content.startsWith(prefix)) || message.author.bot) {
        return;
    }

    if (message.content.startsWith(prefix + "ping")) {
        message.channel.send("pong!");
    }
});

// Log in
client.login(configJson.token);
