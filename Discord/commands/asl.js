exports.run = (client, message, args) => {
    let [age, sex, location] = args;
    message.reply(`Hello ${message.member.displayName}, I see you're a ${age} year old ${sex} from ${location}. Wanna date?`);
}
