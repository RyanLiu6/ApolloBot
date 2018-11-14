exports.run = (client, message, args) => {
    if (!args || args.size < 1) {
        return message.reply("Must provide a command name to reload");
    }

    const commandName = args[0];

    if (!client.commands.has(commandName)) {
        return message.reply("Invalid command name");
    }

    // Delete it from our current cache and client
    delete require.cache[require.resolve(`./${commandName}.js`)];
    client.commands.delete(commandName);

    // Add it back in
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.reply(`Command ${commandName} has been reloaded`);
}
