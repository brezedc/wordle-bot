const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_BANS],
    partials: ["MESSAGE", "CHANNEL"],
});

const fs = require("fs");
require("dotenv").config();

global.Games = {};
client.slashcommands = new Discord.Collection();
client.rawSlashCommands = [];

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

fs.readdir("./commands/", (err, files) => {
    files.forEach((file) => {
        const cmd = require(`./commands/${file}`);
        cmd.description = cmd.desc;
        delete cmd.desc;

        if (["USER", "MESSAGE"].includes(cmd.type)) {
            cmd.description = "";
            delete cmd.options;
        }
        if (cmd.userPermissions) cmd.defaultPermission = false;

        client.rawSlashCommands.push(cmd);
        client.slashcommands.set(cmd.name, require(`./commands/${file}`));
    });
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

client.login(process.env.TOKEN);
