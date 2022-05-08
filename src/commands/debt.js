module.exports = {
    name: 'debt',
    description: 'Shows your debt',
    usage: 'j!debt',
    aliases: ['d'],
    execute(client, message, args, db) {
        db.collection('users').doc(message.author.id).get().then(doc => {
            if (!doc.exists || !doc.data().debt) {
                return message.reply('You do not have any debt!');
            }

            message.reply(`You have a debt of ${doc.data().debt}🍪.`);
        });
    }
}