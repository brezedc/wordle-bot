import config from "../config.json" assert { type: "json" };
import wordList from "../data/words.json" assert { type: "json" };
import { updateStats } from "../functions/main.js";

export default {
    type: 1,
    options: [],
    name: "startgame",
    description: "Starts a new game.",

    run: async (client, interaction) => {
        if (global.Games[interaction.channel.id]) return interaction.channel.send("There is already a game running in this channel.");

        let word = wordList[Math.floor(Math.random() * wordList.length)];

        interaction
            .reply({
                embeds: [
                    {
                        title: "Game Started",
                        description: `Guess the **5** letter word!\n You have **${config.attempts}** attempts and **${config.timeout}mins** to guess the word.`,
                        color: config.embeds.colors.primary,
                        author: {
                            name: interaction.user.tag,
                            icon_url: interaction.user.avatarURL(),
                        },
                        thumbnail: {
                            url: config.embeds.logo,
                        },
                        footer: {
                            text: config.embeds.footer,
                        },
                    },
                ],
                fetchReply: true,
            })
            .then((msg) => {
                global.Games[interaction.channel.id] = { word: word, guesses: [], player: interaction.user.id, message: msg.id, started: Date.now() };
            });

        setTimeout(() => {
            if (global.Games[interaction.channel.id]) {
                interaction.channel.send(`You didn't guess the word in time. The word was: **${word}**`);
                delete global.Games[interaction.channel.id];

                updateStats(interaction.user.id, {});
            }
        }, config.timeout * 60 * 1000);
    },
};
