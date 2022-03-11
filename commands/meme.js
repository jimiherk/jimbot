const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name: "meme",
    description: "Sends a random meme",
    usage: "j!meme [subreddit]",
    aliases: [],

    async execute(client, message, args, db) {

        let subreddit;

        if (args[0]) {
            subreddit = args[0];
        } else {
            subreddit = "";
        }

        const request = await fetch(`https://meme-api.herokuapp.com/gimme/${subreddit}`, {
            method: 'GET'
        });

        if (request.status === 200) {
            const response = await request.json();

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(response.title)
                .setURL(response.postLink)
                .setImage(response.url)
                .setTimestamp(Date.now())
                .setAuthor({name: `Posted by u/${response.author} in r/${response.subreddit}`})
                .setFooter({text: `👍 ${response.ups}`})

            message.reply({embeds: [embed]});
        } else {
            message.reply(`There was an error: ${request.statusText}`);
        }
    }
}