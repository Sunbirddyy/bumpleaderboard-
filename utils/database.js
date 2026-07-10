
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/bumps.json");

function load() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, "{}");
    }

    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function save(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

function getGuild(guildId) {
    const data = load();

    if (!data[guildId]) {
        data[guildId] = {
            users: {}
        };

        save(data);
    }

    return data[guildId];
}

function getUser(guildId, user) {
    const data = load();

    if (!data[guildId]) {
        data[guildId] = {
            users: {}
        };
    }

    if (!data[guildId].users[user.id]) {
        data[guildId].users[user.id] = {
            id: user.id,
            username: user.username,
            bumps: 0,
            lastBump: 0,
            currentStreak: 0,
            bestStreak: 0
        };

        save(data);
    }

    return data[guildId].users[user.id];
}

function addBump(guildId, user) {
    const data = load();

    if (!data[guildId]) {
        data[guildId] = {
            users: {}
        };
    }

    if (!data[guildId].users[user.id]) {
        data[guildId].users[user.id] = {
            id: user.id,
            username: user.username,
            bumps: 0,
            lastBump: 0,
            currentStreak: 0,
            bestStreak: 0
        };
    }

    const profile = data[guildId].users[user.id];

    const now = Date.now();
    const last = profile.lastBump;

    profile.username = user.username;
    profile.bumps++;

    if (!last) {
        profile.currentStreak = 1;
    } else {
        const diff = now - last;
        const hours = diff / (1000 * 60 * 60);

        if (hours <= 3) {
            profile.currentStreak++;
        } else {
            profile.currentStreak = 1;
        }
    }

    if (profile.currentStreak > profile.bestStreak) {
        profile.bestStreak = profile.currentStreak;
    }

    profile.lastBump = now;

    save(data);

    return profile;
}

module.exports = {
    load,
    save,
    getGuild,
    getUser,
    addBump
};