module.exports = {
    name: 'bank',
    description: 'Manage your bank account',
    usage: 'j!bank <deposit/withdraw/balance> [amount]',
    aliases: [],
    execute(client, message, args, db) {
        if (args.length === 0) return message.reply('You need to specify a method. See `j!help bank` for more information.');
        
        db.collection('users').doc(message.author.id).get().then(doc => {
            if (!doc.exists) {
                db.collection('users').doc(message.author.id).set({
                    money: 0,
                    bank: 0
                });
                return message.reply('Please try again.');
            }

            const data = doc.data();

            if (args[0] === 'balance' || args[0] === 'bal') return message.reply(`You currently have ${data.bank} cookies in your bank account.`);

            if (!args[1] || isNaN(args[1]) || parseFloat(args[1]) < 0) return message.reply('The amount has to be a positive number.');

            let amount = parseFloat(args[1]);

            if (args[0] === 'deposit' || args[0] === 'dep') {
                if (data.money < amount) return message.reply('You don\'t have enough money to deposit this amount.');
                if (doc.data().debt) return message.reply('You can\'t deposit money while you have a debt. Pay off your debt first by running \`j!paydebt\`.');

                db.collection('users').doc(message.author.id).update({
                    money: data.money - amount,
                    bank: data.bank + amount
                });

                message.reply(`You have successfully deposited ${amount} to your bank account.`);
            } else if (args[0] === 'withdraw' || args[0] === 'wd') {
                if (data.bank < amount) return message.reply('You don\'t have enough money in your bank to withdraw this amount.');

                db.collection('users').doc(message.author.id).update({
                    money: data.money + amount,
                    bank: data.bank - amount
                });

                message.reply(`You have successfully withdrawn ${amount} from your bank account.`);
            } else {
                message.reply(`Invalid method! See \`j1help bank\` for more information.`); 
            }
        })
    }
}