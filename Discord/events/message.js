// On message
module.exports = (client, message) => {
    // Check if the message is a bot
    if (message.author.bot) {
        return;
    }

    // Check if prefixed message
    if (message.content.indexOf(client.prefix) !== 0) {
        return;
    }

    // Get command and arguments
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const currCmd = client.commands.get(command);

    if (!currCmd) {
        return;
    }
    else {
        currCmd.run(client, message, args);
    }
};
