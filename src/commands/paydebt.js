module.exports = {
    name: 'paydebt',
    description: 'Pay off your debt',
    usage: 'j!paydebt',
    aliases: ['pd'],
    execute(client, message, args, db) {
        db.collection('users').doc(message.author.id).get().then(doc => {
            if (!doc.exists || !doc.data().debt) {
                return message.reply('You do not have any debt!');
            }

            if (doc.data().money < doc.data().debt) {
                return message.reply('You do not have enough money to pay off your debt!');
            }

            db.collection('users').doc(message.author.id).update({
                money: doc.data().money - doc.data().debt,
                debt: 0
            });

            message.reply(`You have successfully paid off your debt of ${doc.data().debt}🍪.`);
        });
    }
}