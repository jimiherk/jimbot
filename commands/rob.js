module.exports = {
    name: "rob",
    description: "Rob a user",
    usage: "rob <user>",
    aliases: [],
    execute(client, message, args, db) {
        let mentionRegex = /<@![0-9]+>|<@[0-9]+>/;
        if (!mentionRegex.test(args[0])) {
            return message.reply("You need to tag a user in order to rob them!");
        }
        const user = message.mentions.users.first();
        const random = Math.floor(Math.random() * 3);
        
        db.collection('users').doc(message.author.id).get().then(authorDoc => {
            db.collection('users').doc(user.id).get().then(userDoc => {
                if (authorDoc.exists && userDoc.exists) {
                    if (random === 0) {
                        db.collection('users').doc(message.author.id).update({
                            money: authorDoc.data().money + userDoc.data().money
                        });

                        db.collection('users').doc(user.id).update({
                            money: 0
                        });

                        message.reply(`You robbed <@!${user.id}> and stole ${userDoc.data().money}🍪!`);
                    } else {
                        let debt;
                        if (!authorDoc.data().debt) debt = 0;
                        else debt = authorDoc.data().debt;

                        if (authorDoc.data().money < 150) {
                            db.collection('users').doc(message.author.id).update({
                                money: 0,
                                debt: debt + (150 - authorDoc.data().money)
                            });
                        } else {
                            db.collection('users').doc(message.author.id).update({
                                money: authorDoc.data().money - 150
                            });
                        }

                        message.reply(`👮‍♂️You got caught while trying to rob <@!${user.id}> and lost 150🍪!`);
                    }
                } else {
                    return message.reply('Either you or the user you are trying to rob does not have any cookies!');
                }
            });
        });
    }
}