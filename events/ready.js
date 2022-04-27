const config = require("../config.json");

module.exports = async (client) => {
    client.user.setPresence({ activities: [{ name: "Status" }], status: "online" });

    if (config.devMode) {
        let guild = client.guilds.cache.get(config.guild);

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
            console.log("Successfully started bot");
        });
    }
};
