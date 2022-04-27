const config = require("../config.json");

module.exports = {
    type: 1,
    options: [],
    name: "startgame",
    desc: "Starts a new game.",

    run: async (Discord, client, interaction) => {
        if (global.Games[interaction.channel.id]) return interaction.channel.send("There is already a game running in this channel.");

        //GENERATE RANDOM 5 LETTER WORD FROM A DICTONARY

        interaction.channel
            .send({
                embeds: [
                    {
                        title: "Game Started",
                        description: "The game has started!\n You have 5 attempts to guess the word.",
                        color: config.embeds.colors.primary,
                    },
                ],
            })
            .then((msg) => {
                // console.log(msg);
                global.Games[interaction.channel.id] = { word: "erase", guesses: [], player: interaction.user.id, message: msg.id };
            });
    },
};
