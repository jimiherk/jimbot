module.exports = {
    name: 'balance',
    description: 'Check your balance',
    usage: 'j!balance [user]',
    aliases: ['bal'],
    execute(client, message, args, db) {
        let mentionRegex = /<@![0-9]+>|<@[0-9]+>/;

        let user;

        if (args.length === 1) {
            if (mentionRegex.test(args[0])) {
                user = message.mentions.users.first()
            } else {
                return message.reply(`Invalid mention.`);
            }
        } else {
            user = message.author;
        }

        db.collection('users').doc(user.id).get().then(doc => {
            if (doc.exists) {
                message.reply(`<@!${user.id}> owns **${doc.data().money}** cookies.`);
            } else {
                message.reply(`<@!${user.id}> has no cookies`);
            }
        });
    }
}