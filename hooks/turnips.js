let timestamp = -1
let time_label = "created_utc";
let subreddit = "acturnips"

let buy_regex = new RegExp("buy.*", "i");
let sell_regex = new RegExp("sell.*", "i");

exports.check = async (discord, reddit) => {
  // if timestamp is -1, we need to run setup
  if (timestamp == -1) {
    await setup(reddit);
    return;
  }

  // Not the first time we are run, can just process
  let new_posts = await reddit.getNew(subreddit);

  // First store newest timestamp
  new_time = new_posts[0][time_label];

  // Then iterate and post
  for (let iter in new_posts) {
    item = new_posts[iter];

    if (item === null || !item.hasOwnProperty(time_label)) {
      continue;
    }

    current_time = item[time_label];

    if (current_time > timestamp) {
      // Construct message and send to discord
      let channel = discord.channels.cache.get(process.env.DISCORD_CHANNEL);

      // Get correct details
      let title = item["title"];
      let subreddit = item["subreddit_name_prefixed"];
      let content = item["selftext"];
      let link = item["url"];

      // Match title with regex
      if (buy_regex.test(title) || sell_regex.test(title)) {
        console.log(title);
        const message = {
          color: 0x0099ff,
          title: title,
          url: link,
          author: {
            name: `New Post from ${subreddit}`,
            url: link
          },
          description: content,
          timestamp: new Date()
        }

        channel.send({ embed: message });
      }
    }
  }

  timestamp = new_time;
}

let setup = async (reddit) => {
  // At start up, first poll new posts and store created UTC
  // Subsequent calls to check will iterate through results and post to discord until we hit our in-memory timestamp
  // Afterwards, we update the timestamp
  let new_posts = await reddit.getNew(subreddit)
  first = new_posts[0];
  timestamp = first[time_label];
}
