const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { load } = require("../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View the server bump leaderboard."),

    async execute(interaction) {

        const data = load();

        const guild = data[interaction.guild.id];

        if (!guild || !Object.keys(guild.users).length) {
            return interaction.reply({
                content: "No bumps have been recorded yet."
            });
        }

        const users = Object.values(guild.users)
            .sort((a, b) => b.bumps - a.bumps)
            .slice(0, 10);

        const description = users
            .map((user, index) => {
                const medal =
                    index === 0 ? "🥇" :
                    index === 1 ? "🥈" :
                    index === 2 ? "🥉" :
                    `**${index + 1}.**`;

                return `${medal} <@${user.id}> • **${user.bumps}** bumps`;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🏆 Bump Leaderboard")
            .setDescription(description)
            .setTimestamp();

        interaction.reply({
            embeds: [embed]
        });

    }
};