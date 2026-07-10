const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { load } = require("../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bumpstats")
        .setDescription("View another user's bump statistics.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The user to check.")
                .setRequired(true)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user");

        const data = load();

        const guild = data[interaction.guild.id];

        if (!guild || !guild.users[target.id]) {
            return interaction.reply({
                content: "That user hasn't bumped this server yet.",
                ephemeral: true
            });
        }

        const profile = guild.users[target.id];

        const users = Object.values(guild.users)
            .sort((a, b) => b.bumps - a.bumps);

        const rank = users.findIndex(u => u.id === target.id) + 1;

        const lastBump = profile.lastBump
            ? `<t:${Math.floor(profile.lastBump / 1000)}:R>`
            : "Never";

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setAuthor({
                name: `${target.username}'s Bump Stats`,
                iconURL: target.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                {
                    name: "🏆 Rank",
                    value: `#${rank}`,
                    inline: true
                },
                {
                    name: "📈 Total Bumps",
                    value: `${profile.bumps}`,
                    inline: true
                },
                {
                    name: "🔥 Current Streak",
                    value: `${profile.currentStreak}`,
                    inline: true
                },
                {
                    name: "⭐ Best Streak",
                    value: `${profile.bestStreak}`,
                    inline: true
                },
                {
                    name: "🕒 Last Bump",
                    value: lastBump
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};