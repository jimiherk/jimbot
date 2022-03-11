module.exports = {
    name: 'gamble',
    description: 'Gamble some cookies',
    usage: 'j!gamble <amount> [mode]',
    aliases: ['g'],
    execute(client, message, args, db) {
        if (!args[0] || isNaN(args[0]) || parseFloat(args[0]) < 1) return message.channel.send('You must specify a valid amount of cookies to gamble!');

        let amount = parseFloat(args[0]);
        let random;
        if (!args[1] || isNaN(args[1]) || parseFloat(args[1]) === 2) random = Math.floor(Math.random() * 2);
        else if (parseFloat(args[1]) < 2) return message.channel.send('You must specify a valid mode!');
        else random = Math.floor(Math.random() * parseFloat(args[1]));

        db.collection('users').doc(message.author.id).get().then(doc => {
            if (!doc.exists || !doc.data().money || doc.data().money < amount) return message.reply('You do not have enough cookies!');
            if (random === 0) {
                db.collection('users').doc(message.author.id).update({
                    money: doc.data().money + amount
                });
                message.channel.send(`You won **${amount}** cookies!`);
            } else {
                db.collection('users').doc(message.author.id).update({
                    money: doc.data().money - amount
                });
                message.channel.send(`You lost **${amount}** cookies!`);
            }
        });
    }
}