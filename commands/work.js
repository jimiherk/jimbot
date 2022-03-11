const fs = require('fs');

module.exports =  {
    name: 'work',
    description: 'Bake yourself some cookies',
    usage: 'j!work',
    aliases: ['w'],
    execute(client, message, args, db) {
        db.collection('users').doc(message.author.id).get().then(doc => {
            if (!doc.exists) {
                db.collection('users').doc(message.author.id).set({
                    money: 0,
                    lastWorked: Date.now()
                });
            } else {
                if (doc.data().lastWorked + 300000 > Date.now()) {
                    return message.reply(`Your oven is overheating! You have to wait ${Math.floor((doc.data().lastWorked + 300000 - Date.now()) / 1000)} more seconds until you can work again!`);
                } else {
                    let earned = Math.floor(Math.random() * (50 - 25)) + 25;
                    db.collection('users').doc(message.author.id).update({
                        money: doc.data().money + earned,
                        lastWorked: Date.now()
                    });
                    message.reply(`You earned ${earned} cookies!`);
                }
            }
        });
    }
};