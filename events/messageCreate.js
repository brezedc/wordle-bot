const { MessageActionRow, Permissions, MessageEmbed, MessageButton } = require("discord.js");
const { type } = require("../commands/startgame");

module.exports = async (client, message) => {
    if (!global.Games?.[message.channel.id]) return console.log("No game running in this channel.");

    let Game = global.Games[message.channel.id];
    let Guess = message.content.toLowerCase();

    if (Game.player !== message.author.id) return;

    if (Guess.length !== 5) return message.reply({ content: "Your guess must be **5** characters long." });
    if (Game.guesses.includes(Guess)) return message.reply({ content: "You already guessed that word." });

    if (Game.word === Guess) {
        delete Game;

        message.channel.send({
            embeds: [
                {
                    title: "You Won!",
                    description: "You guessed the word!\nThe game has ended.",
                    color: config.embeds.colors.success,
                },
            ],
        });
    } else {
        Game.guesses.push(Guess);

        if (Game.guesses.length === 5) {
            delete Game;

            message.channel.send({
                embeds: [
                    {
                        title: "You Lost!",
                        description: "You ran out of guesses!\nThe game has ended.",
                        color: config.embeds.colors.error,
                    },
                ],
            });
        } else {
            const msg = await message.channel.messages.fetch(Game.message);

            const buttons = new MessageActionRow().addComponents(
                Guess.split("").forEach((letter) => {
                    new MessageButton().setLabel(letter);
                })
            );

            //add buttons on the message
        }
    }
};
