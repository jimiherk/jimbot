module.exports = {
    name: 'pay',
    description: 'Give cookies to someone',
    usage: 'j!pay <user> <amount>',
    aliases: ['give', 'p'],
    execute(client, message, args, db) {
        if (args.length != 2) return message.reply('You need to specify a user and an amount.');

        let user = message.mentions.users.first();
        let amount = parseFloat(args[1]);

        if (!user) return message.reply('You need to specify a user.');
        if (isNaN(amount) || amount < 0) return message.reply('The amount has to be a positive number.');

        db.collection('users').doc(message.author.id).get().then(authorDoc => {

            if // If the author does not have enough money
            (!authorDoc.exists || !authorDoc.data().money || authorDoc.data().money < amount) {
                return message.reply('You do not have enough money.');
            }

            db.collection('users').doc(user.id).get().then(userDoc => {
                if (!userDoc.exists) {
                    db.collection('users').doc(user.id).set({
                        money: amount,
                        debt: 0
                    });
                } else {
                    db.collection('users').doc(user.id).update({
                        money: userDoc.data().money + amount
                    });
                }

                db.collection('users').doc(message.author.id).update({
                    money: authorDoc.data().money - amount
                });

                message.reply(`You gave <@!${user.id}> **${amount}** cookies.`);
            });
        });
    }
}