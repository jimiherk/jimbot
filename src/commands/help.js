const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "help",
    description: "Show a help menu",
    usage: "j!help [command]",
    aliases: ["commands", "command", "cmd", "cmds"],
    async execute(client, message, args, db) {
        const commandFile = JSON.parse(fs.readFileSync(`${__dirname}/../../commands.json`, 'utf8'));
        const jimi = await client.users.fetch('538414949140267008').catch(console.error);

        if (args.length === 0) {
            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Help Menu')
                .setDescription('Here is a list of the avaiable commands, if you need additional help, please click one of the links below.\n\n**Command arguments**: <> = required, [] = optional')
                .setTimestamp(Date.now())
                .setFooter({iconURL: jimi.avatarURL(), text: `Developed by ${jimi.tag}`})

            for (const command of commandFile) {
                const field = 'Usage: `' + command.usage + '`\nAliases: ' + command.aliases + '\n*' + command.description + '*';
                embed.addFields({name: command.name, value: field, inline: true})
            }

            const row1 = new Discord.MessageActionRow()
                .setComponents(
                    new Discord.MessageButton()
                        .setLabel('Website')
                        .setStyle('LINK')
                        .setEmoji('🌐')
                        .setURL('https://bot.jimi.sexy'),
                    new Discord.MessageButton()
                        .setLabel('Docs')
                        .setStyle('LINK')
                        .setEmoji('📝')
                        .setURL('https://docs.jimbot.xyz'),
                    new Discord.MessageButton()
                        .setLabel('Submit Feedback')
                        .setStyle('LINK')
                        .setEmoji('💬')
                        .setURL('https://bot.jimi.sexy/feedback')
                )
            
            const row2 = new Discord.MessageActionRow()
                    .setComponents(
                        new Discord.MessageButton()
                            .setLabel('Invite link')
                            .setStyle('LINK')
                            .setEmoji('🔗')
                            .setURL('https://bot.jimi.sexy/invite'),
                        new Discord.MessageButton()
                            .setLabel('Support server')
                            .setStyle('LINK')
                            .setEmoji('⁉')
                            .setURL('https://bot.jimi.sexy/server')
                    )
            message.reply({embeds: [embed], components: [row1, row2]});
        } else {
            const command = args[0];
            const cmd = commandFile.find(c => c.name === command);
            if (cmd) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(`Help for ${command}`)
                    .setDescription(`**Description:** *${cmd.description}*\n**Usage:** \`${cmd.usage}\`\n**Aliases:** ${cmd.aliases}`)
                    .setTimestamp(Date.now())
                    .setFooter({iconURL: jimi.avatarURL(), text: `Developed by ${jimi.tag}`})
                message.reply({embeds: [embed]});
            } else {
                message.reply('That command does not exist. Please try again.');
            }
        }
    }
}