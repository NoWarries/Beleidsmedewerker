import { SlashCommandBuilder } from "@discordjs/builders";
import moment from "moment";
import "moment-duration-format";
import { EmbedBuilder } from "discord.js";
import * as config from "../../../config/common.js";

let data = new SlashCommandBuilder()
    .setName("ping") 
    .setDescription("Send a ping to the bot");

async function execute(interaction) {
    const { client } = await import("../../main.js");
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const originalEmbed = new EmbedBuilder()
        .setTimestamp()
        .setTitle(`${config.guild.shorthand} - Ping`)
        .setColor(config.colors.default)
        .setThumbnail(interaction.guild.iconURL())
        .setDescription("Pinging...");

    const newEmbed = new EmbedBuilder()
        .setTimestamp()
        .setTitle(`${config.guild.shorthand} - Ping`)
        .setColor(config.colors.default)
        .setThumbnail(interaction.guild.iconURL());
    newEmbed.addFields(
        {
            name: "⏱️ Ping data",
            value: "Time " + Math.round(Date.now() - interaction.createdTimestamp) + "ms \n Heartbeat: " + Math.round(client.ws.ping) + "ms",
            inline: false
        },
        {
            name: "👁️‍🗨️ Uptime",
            value: duration,
            inline: false
        }
    );


    await interaction.reply({ embeds: [originalEmbed] });
    await interaction.editReply({ embeds: [newEmbed] });
}


export { data, execute };
