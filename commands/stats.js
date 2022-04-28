import config from "../config.json" assert { type: "json" };
import { getStats } from "../functions/main.js";

export default {
    type: 1,
    options: [
        {
            name: "user",
            description: "The user you want the stats from.",
            type: 6,
            required: false,
        },
    ],
    name: "stats",
    description: "Returns the stats from the prompted user / you.",

    run: async (client, interaction) => {
        let user = interaction.options.resolved.users?.first() ?? interaction.user;

        getStats(user.id).then((stats) => {
            if (stats) {
                interaction.reply({
                    embeds: [
                        {
                            title: "Stats",
                            description: `**${user.tag}**'s stats.\n\n**Wins:** ${stats.wins}\n**Rounds played:** ${stats.attempts}\n**Win Rate:** ${Math.floor((stats.wins / stats.attempts) * 100)}%\n**Record:** ${stats.record ? (stats.record > 60 ? `${Math.floor(stats.record / 60)}m ${Math.floor(stats.record % 60)}s` : `${stats.record}s`) : "None"}`,
                            color: config.embeds.colors.primary,
                            thumbnail: {
                                url: user.avatarURL(),
                            },
                            author: {
                                name: interaction.user.tag,
                                icon_url: interaction.user.avatarURL(),
                            },
                            footer: {
                                text: config.embeds.footer,
                            },
                        },
                    ],
                });
            } else {
                interaction.reply({
                    embeds: [
                        {
                            title: "Stats",
                            description: `**${user.tag}** has no stats.`,
                            color: config.embeds.colors.error,
                            thumbnail: {
                                url: user.avatarURL(),
                            },
                            author: {
                                name: interaction.user.tag,
                                icon_url: interaction.user.avatarURL(),
                            },
                            footer: {
                                text: config.embeds.footer,
                            },
                        },
                    ],
                });
            }
        });
    },
};
