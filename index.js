import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

async function registerAboutCommand() {
    const command = new SlashCommandBuilder()
        .setName('about')
        .setDescription('Shows information about NickBot')
        .toJSON();

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: [command] }
        );
        console.log('Slash command /about registered.');
    } catch (error) {
        console.error('Error registering /about command:', error);
    }
}

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag}`);
    await registerAboutCommand();
});

client.on(Events.MessageCreate, message => {
    if (message.author.bot) return;

    if (message.content === 'Hi NickBot') {
        message.reply(`Hey ${message.author.username}!`);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'about') {
        await interaction.reply('My name is NickBot! I was created by Nick12.');
    }
});

client.login(process.env.DISCORD_TOKEN);
