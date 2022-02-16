const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "help",
    description: "Show a help menu",
    usage: "j!help",
    aliases: ["p"],
    async execute(client, message, args) {
        const commandFile = JSON.parse(fs.readFileSync(`${__dirname}/../commands.json`, 'utf8'));

        const jimi = await client.users.fetch('538414949140267008').catch(console.error);

        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Help Menu')
            .setDescription('Here is a list of the avaiable commands, if you need additional help, please click one of the links below.')
            .setTimestamp(Date.now())
            .setFooter({iconURL: jimi.avatarURL(), text: `Developed by ${jimi.tag}`})

        for (const command of commandFile) {
            const field = 'Usage: `' + command.usage + '`\nAliases: ' + command.aliases + '\n*' + command.description + '*';
            embed.addField(`${command.name}`, field, true);
        }

        const row1 = new Discord.MessageActionRow()
            .setComponents(
                new Discord.MessageButton()
                    .setLabel('Website')
                    .setStyle('LINK')
                    .setEmoji('🌐')
                    .setURL('https://jimbot.xyz'),
                new Discord.MessageButton()
                    .setLabel('Docs')
                    .setStyle('LINK')
                    .setEmoji('📝')
                    .setURL('https://docs.jimbot.xyz'),
                new Discord.MessageButton()
                    .setLabel('Submit Feedback')
                    .setStyle('LINK')
                    .setEmoji('💬')
                    .setURL('https://jimbot.xyz/feedback')
            )
        
        const row2 = new Discord.MessageActionRow()
                .setComponents(
                    new Discord.MessageButton()
                        .setLabel('Invite link')
                        .setStyle('LINK')
                        .setEmoji('🔗')
                        .setURL('https://jimbot.xyz/invite'),
                    new Discord.MessageButton()
                        .setLabel('Support server')
                        .setStyle('LINK')
                        .setEmoji('⁉')
                        .setURL('https://jimbot.xyz/server')
                )


        message.reply({embeds: [embed], components: [row1, row2]});
    }
}