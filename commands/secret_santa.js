// Secret Santa
exports.run = (client, message, args) => {
    console.log("yeet");
    console.log(args);
    // console.log(message.mentions.users);

    /* Secret Santa Algorithm:
     * Use two arrays:
     * 1. Keep track of users that have been accounted for already
     * 2. Keep track of users that have not yet been accounted for
     *
     * In order to create a perfect cycle, users that are being considered
     * must not be paired with users that have already been accounted for.
     */
    let index = 0;
    let randUser = null;
    let num = args.length;
    let haveAccounted = [];

    // First create the array of not yet accounted for users
    let notAccounted = JSON.parse(JSON.stringify(args));

    while (notAccounted.length > 0) {
        randUser = Math.floor(Math.random() * (num - 1));
        console.log(randUser);
        haveAccounted.push(notAccounted[randUser].id);
        notAccounted.splice(randUser, 1);
        num = notAccounted.length;
    }
    console.log(haveAccounted);
    console.log(notAccounted);
}
