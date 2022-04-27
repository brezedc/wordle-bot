import config from "../config.json" assert { type: "json" };
import { updateStats, getStats } from "../functions/main.js";

export default async (client, message) => {
    if (!global.Games) return;
    if (!global.Games[message.channel.id]) return;

    let Game = global.Games[message.channel.id];
    let Guess = message.content.toLowerCase();

    if (Game.player !== message.author.id) return;

    if (Guess.length !== 5) return message.reply({ content: "Your guess must be **5** characters long." });
    if (Game.guesses.includes(Guess)) return message.reply({ content: "You already guessed that word." });
    // if (!wordList.includes(Guess)) return message.reply({ content: `${Guess} is not a valid word.` });

    let Won = Game.word === Guess;

    if (Game.guesses.length < config.attempts - 1 || Won) {
        message.react("✅");
        Game.guesses.push(Guess);
        const msg = await message.channel.messages.fetch(Game.message);
        const components = [];

        if (msg.components.length > 0) {
            msg.components.map((rows) => {
                components.push({
                    type: 1,
                    components: [
                        ...rows.components.map((button) => {
                            return {
                                type: 2,
                                label: button.label,
                                customId: button.customId,
                                style: button.style,
                            };
                        }),
                    ],
                });
            });
        }

        components.push({
            type: 1,
            components: [
                ...Guess.split("").map((letter, index) => {
                    let style = 2;

                    if (Game.word.includes(letter)) {
                        let wordArray = Game.word.split("");

                        if (wordArray[index] == letter) {
                            style = 3;
                        } else {
                            style = 1;
                        }
                    }

                    return {
                        type: 2,
                        label: letter.toUpperCase(),
                        style: style,
                        custom_id: letter + Math.floor(Math.random(0, 1000) * 10000),
                    };
                }),
            ],
        });

        msg.edit({ components: components });

        if (Won) {
            delete global.Games[message.channel.id];

            message.channel
                .send({
                    embeds: [
                        {
                            title: "You Won!",
                            description: `You guessed the word!\n It took you **${Game.guesses.length}** attempts & **${Math.floor((Date.now() - Game.started) / 1000)}** seconds.`,
                            color: config.embeds.colors.success,
                        },
                    ],
                })
                .then(async () => {
                    let stats = await getStats(message.author.id);

                    updateStats(message.author.id, {
                        wins: true,
                        record: !stats.record || stats.record < Math.floor((Date.now() - Game.started) / 1000) ? Math.floor((Date.now() - Game.started) / 1000) : false,
                    });
                });
        }
    } else {
        delete global.Games[message.channel.id];

        message.channel
            .send({
                embeds: [
                    {
                        title: "You Lost!",
                        description: `You ran out of guesses!\nThe word was **${Game.word}**`,
                        color: config.embeds.colors.error,
                    },
                ],
            })
            .then(() => {
                updateStats(message.author.id, {});
            });
    }
};
