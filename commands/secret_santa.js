// Secret Santa
exports.run = (client, message, args) => {
    // Check if the command was ran by the owner
    if (message.author.username != "Krvais") {
        return;
    }

    // Remove duplicates from args array
    let uniqueArgs = args.filter(function(item, pos) {
        return args.indexOf(item) == pos;
    });

    /* Secret Santa Algorithm:
     * Use two arrays:
     * 1. Keep track of users that have been accounted for already
     * 2. Keep track of users that have not yet been accounted for
     *
     * In order to create a perfect cycle, users that are being considered
     * must not be paired with users that have already been accounted for.
     */
    let giverMap = {};
    let randUser = null;
    let giftGiver = null;
    let giftReceiver = null;
    let num = uniqueArgs.length;
    let notAccounted = [];

    // First create the array of not yet accounted from arguments
    let currUsers = message.mentions.users;
    currUsers.forEach(function(value, key, map) {
        notAccounted.push(value.username);
    });

    // Create mapping dictionary from notAccounted
    for (var i = 0; i < num; i++) {
        giverMap[notAccounted[i]] = null;
    };

    console.log("Initial Mapping");
    console.log(giverMap);

    // Set initialUser for perfect cycle
    randUser = randInt(num);
    initialUser = notAccounted[randUser];

    // Main loop
    while (notAccounted.length > 1) {
        // First get the Gift Giver
        giftGiver = notAccounted[randUser];
        notAccounted.splice(randUser, 1);
        num--;

        // Roll to get Gift Receiver
        // Guaranteed to be difference since giftGiver was removed from the array
        randUser = randInt(num);
        giftReceiver = notAccounted[randUser];

        // Create Mapping
        giverMap[giftGiver] = giftReceiver;
    }

    // Lastly, set the mapping for the last person
    giverMap[giftReceiver] = initialUser;

    console.log(giverMap);

    sendDM(client, giverMap);
}

function randInt(num) {
    return Math.floor(Math.random() * (num - 1));
};

function sendDM(client, giverMap) {
    for (var key in giverMap) {
        let user = client.users.find(user => user.username == key);

        if (user.bot) {
            break;
        }

        let msg = "You are the Secret Santa to " + giverMap[key];
        user.send(msg);
    };
};
