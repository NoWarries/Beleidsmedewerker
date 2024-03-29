import "dotenv/config";
import { Client, GatewayIntentBits, Collection, Options, Partials } from "discord.js";
import { readdirSync } from "fs";
import { extractFilesRecursively } from "./handlers/reader.js";

const client = new Client(
    {
        makeCache: Options.cacheWithLimits({
            ReactionManager: 200,
        }),
        partials: [Partials.Message, Partials.Channel, Partials.Reaction],
        intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessageReactions
        ]
    });

/**
 * Event handlers
 * Handles loading in event and listening to their occurrences
 */
const events = readdirSync("./src/events").filter((file) => file.endsWith(".js"));
try {
    (async () => {
        for (let event of events) {
            console.log(`[ 🎫 ] Preparing ${event}`);
            const eventFile = await import(`./events/${event}`);
            if (eventFile.once)
                client.once(eventFile.name, (...args) => {
                    eventFile.execute(...args);
                });
            else
                client.on(eventFile.name, (...args) => {
                    eventFile.execute(...args);
                });
        }
        console.log(`[ 🎫 ] ${events.length} Event(s) loaded successfully`);
        console.table(events);
    })();
} catch (err) {
    console.log(`[❌] Something went terrible : ${err.message}`);
}

/**
 * Load in cogs
 * Import / Execute on javascript execution
 */
const gears = readdirSync("./src/cogs").filter((file) => file.endsWith(".js"));
for (let gear of gears) {
    console.log(`[ ⚙️ ] Preparing ${gear}`);
    import(`./cogs/${gear}`);
}
console.log(`[ ⚙️ ] ${gears.length} Gear(s) loaded successfully`);
console.table(gears);

/**
 * Command handlers
 * Loads in commands
 */
client.commands = new Collection();
const commandFiles = await extractFilesRecursively("./src/commands");
(async () => {
    for (const file of commandFiles) {
        console.log(`[ 🤖 ] Preparing ${file}`);
        const command = await import(`../${file}`);
        client.commands.set(command.data.name, command);
    }
    console.log(`[ 🤖 ] ${commandFiles.length} Command(s) loaded successfully`);
    console.table(commandFiles);
})();
client.on("interactionCreate", async interaction => {
    if(interaction.isAutocomplete()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.autocomplete(interaction);
        } catch (error) {
            console.error(error);
        }
    } else if (!interaction.isCommand()) { return; } else {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(
                interaction,
                client
            );
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
});

client.login(process.env.TOKEN);

export {
    client
};

