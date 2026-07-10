const { addBump } = require("../utils/database");

module.exports = {
    name: "messageCreate",

    async execute(message) {
        if (!message.guild) return;

        if (message.author.id !== "302050872383242240") return;

        if (!message.embeds.length) return;

        const embed = message.embeds[0];

        if (!embed.description) return;

        if (!embed.description.toLowerCase().includes("bump done")) return;

        const user =
            message.interactionMetadata?.user ||
            message.interaction?.user;

        if (!user) return;

        addBump(message.guild.id, user);

        console.log(`${user.username} bumped ${message.guild.name}`);
    }
};