import Discord, { Client, Intents } from "discord.js";
import fs from "fs";
import mysql from "mysql";

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_BANS],
    partials: ["MESSAGE", "CHANNEL"],
});

import dotenv from "dotenv";
dotenv.config();

global.con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: process.env.DB_NAME,
});

global.con.connect((err) => {
    if (err) throw err;
    console.log("Successfully Conncted to database");
});

global.Games = {};
client.slashcommands = new Discord.Collection();
client.rawSlashCommands = [];

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(async (file) => {
        const event = await import(`./events/${file}`);

        let eventName = file.split(".")[0];
        client.on(eventName, event.default.bind(null, client));
    });
});

fs.readdir("./commands/", (err, files) => {
    files.forEach(async (file) => {
        const imported = await import(`./commands/${file}`);
        const cmd = imported.default;

        if (["USER", "MESSAGE"].includes(cmd.type)) {
            cmd.description = "";
            delete cmd.options;
        }
        if (cmd.userPermissions) cmd.defaultPermission = false;

        client.rawSlashCommands.push(cmd);
        client.slashcommands.set(cmd.name, cmd);
    });
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

client.login(process.env.TOKEN);
