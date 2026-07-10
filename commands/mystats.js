const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { load } = require("../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mystats")
        .setDescription("View your bump statistics."),

    async execute(interaction) {

        const data = load();

        const guild = data[interaction.guild.id];

        if (!guild || !guild.users[interaction.user.id]) {
            return interaction.reply({
                content: "You haven't bumped this server yet.",
                ephemeral: true
            });
        }

        const user = guild.users[interaction.user.id];

        const users = Object.values(guild.users)
            .sort((a, b) => b.bumps - a.bumps);

        const rank = users.findIndex(u => u.id === interaction.user.id) + 1;

        const lastBump = user.lastBump
            ? `<t:${Math.floor(user.lastBump / 1000)}:R>`
            : "Never";

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setAuthor({
                name: `${interaction.user.username}'s Bump Stats`,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                {
                    name: "🏆 Rank",
                    value: `#${rank}`,
                    inline: true
                },
                {
                    name: "📈 Total Bumps",
                    value: `${user.bumps}`,
                    inline: true
                },
                {
                    name: "🔥 Current Streak",
                    value: `${user.currentStreak}`,
                    inline: true
                },
                {
                    name: "⭐ Best Streak",
                    value: `${user.bestStreak}`,
                    inline: true
                },
                {
                    name: "🕒 Last Bump",
                    value: lastBump,
                    inline: false
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};