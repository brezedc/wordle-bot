import config from "../config.json" assert { type: "json" };

export default async (client) => {
    setTimeout(() => {
        client.user.setActivity(`/help | ${client.guilds.cache.size} servers`, { type: "WATCHING" });
    }, 60 * 1000);

    if (config.devMode) {
        let guild = client.guilds.cache.get(config.devGuild);

        if (!guild) return console.log("Could not find the guild in config.json.");
        await guild.commands.set(client.rawSlashCommands).then((cmd) => {
            const getRoles = (commandName) => {
                const permissions = client.rawSlashCommands.find((x) => x.name === commandName).userPermissions;

                if (!permissions) return null;
                return guild.roles.cache.filter((x) => x.permissions.has(permissions) && !x.managed);
            };

            const fullPermissions = cmd.reduce((accumulator, x) => {
                const roles = getRoles(x.name);
                if (!roles) return accumulator;

                const permissions = roles.reduce((a, v) => {
                    return [
                        ...a,
                        {
                            id: v.id,
                            type: "ROLE",
                            permission: true,
                        },
                    ];
                }, []);

                return [
                    ...accumulator,
                    {
                        id: x.id,
                        permissions,
                    },
                ];
            }, []);

            guild.commands.permissions.set({ fullPermissions });
            console.log("[DEV-MODE] Successfully refreshed application (/) application");
        });
    } else {
        console.log("Started refreshing application (/) commands.");
        await client.application.commands.set(client.rawSlashCommands);
        console.log("Successfully refreshed application (/) application");
    }
};
