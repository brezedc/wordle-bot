import config from "../config.json" assert { type: "json" };
import { getLeaderboard } from "../functions/main.js";

export default {
    type: 1,
    options: [
        {
            name: "sorting",
            description: "Sort by fastest time or most wins.",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Most Wins",
                    value: "wins",
                },
                {
                    name: "Fastest Time",
                    value: "record",
                },
            ],
        },
    ],
    name: "leaderboard",
    description: "Returns the statistical leaderboard.",

    run: async (client, interaction) => {
        let choices = { wins: "Most Wins", record: "Fastest Time" };
        let choice = interaction.options.data[0].value;

        getLeaderboard(choice).then(async (leaderboard) => {
            let stats = await Promise.all(
                leaderboard.map(async (data, index) => {
                    let user = await client.users.fetch(data.id);
                    return `**${index + 1}.** ${user.tag} - ${choice === "wins" ? data.wins : data.record > 60 ? `${Math.floor(data.record / 60)}m ${Math.floor(data.record % 60)}s` : `${data.record}s`} ${choice === "wins" ? "wins" : ""}\n`;
                })
            );

            interaction.reply({
                embeds: [
                    {
                        title: `${choices[choice]} Leaderboard`,
                        description: await stats.map((stat) => stat).join(""),
                        color: config.embeds.colors.primary,
                        thumbnail: {
                            url: config.embeds.logo,
                        },
                        footer: {
                            text: config.embeds.footer,
                        },
                    },
                ],
            });
        });
    },
};
