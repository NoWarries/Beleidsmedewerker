import { SlashCommandBuilder } from "@discordjs/builders";
import moment from "moment";
import "moment-duration-format";
import { MessageEmbed } from "discord.js";
import { client } from "../main.js";

let data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Send a ping to the bot");

async function execute(interaction) {
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

    const originalEmbed = new MessageEmbed()
        .setTimestamp()
        .setTitle("VHG - Ping")
        .setColor("#ff6961")
        .setThumbnail(interaction.guild.iconURL())
        .setDescription("Pinging...");

    const newEmbed = new MessageEmbed()
        .setTimestamp()
        .setTitle("VHG - Ping")
        .setColor("#ff6961")
        .setThumbnail(interaction.guild.iconURL())
        .addField("⏱️ Ping data", "Time " + Math.round(Date.now() - interaction.createdTimestamp) + "ms \n Heartbeat: " + Math.round(client.ws.ping) + "ms")
        .addField("👁️‍🗨️ Uptime", duration);

    let fulfilledEmbed = await interaction.channel.send({ embeds: [originalEmbed] });
    fulfilledEmbed.edit({ embeds: [newEmbed] });

}


export { data, execute };
