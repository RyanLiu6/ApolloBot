// Basic requirements
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");

// Discord client
const client = new Discord.Client();

// Attaching config and prefix to client for global availability
client.config = require("./config.json");;
client.prefix = client.config.prefix;

const init = async () => {
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
    client.login(client.config.token);
};

init();
