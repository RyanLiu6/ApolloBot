// Testing for PM
exports.run = (client, message, args) => {
    message.author.send("testing").catch(console.error);

    let user = client.users.find(user => user.username == client.config.owner);
    user.send("does this work?");
}
