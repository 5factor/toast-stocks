import SlashCommand from "../../util/classes/SlashCommand";
import ToastClient from "../../util/classes/ToastClient";
import { CommandInteraction } from "discord.js";

export default class extends SlashCommand {
    public constructor(client: ToastClient) {
        super(client, {
            name: "suggestions",
            description: "View or set the servers suggestion channel.",
            permissionLevel: 2,
            category: "config",
            options: [
                {
                    "type": 1,
                    "name": "viewchannel",
                    "description": "View the current suggestion channel",
                    "options": []
                },
                {
                    "type": 1,
                    "name": "disable",
                    "description": "Disable suggestions (re-enable by setting a suggestion channel)",
                    "options": []
                },
                {
                    "type": 1,
                    "name": "setchannel",
                    "description": "Set the suggestion channel",
                    "options": [
                        {
                            "type": 7,
                            "name": "channel",
                            "description": "Suggestion channel",
                            "required": true
                        }
                    ]
                }
            ]
        });
    }

    public async run(client: ToastClient, interaction: CommandInteraction) {
        let subCommand = interaction.options[0].name;
        const channel = interaction.options[0].options?.[0].value;

        let newChannel;
        if (channel) newChannel = await interaction.guild.channels.cache.get(channel.toString());

        switch (subCommand) {
            case "viewchannel":
                const suggestionChannel = interaction.guild.channels.cache.get(interaction.guild.data?.channels?.log);
                return interaction.reply(`The suggestion channel for this server${suggestionChannel ? ` is ${suggestionChannel}.` : " is not yet set up."}`);

            case "setchannel":
                await client.db.guilds.setSuggestionChannel(interaction.guild.id, newChannel.id)
                    .catch(e => {
                        return interaction.reply(`<:no:811763209237037058> The following error occurred while attempting to set the suggestion channel:\n\`\`\`${e}\`\`\``, { ephemeral: true });
                    });

                return interaction.reply(`<:check:811763193453477889> The suggestion channel for the server has successfully been set to ${newChannel}.`);

            case "disable":
                await client.db.guilds.setSuggestionChannel(interaction.guild.id, null)
                    .catch(e => {
                        return interaction.reply(`<:no:811763209237037058> The following error occurred while attempting to set the suggestion channel:\n\`\`\`${e}\`\`\``, { ephemeral: true });
                    });

                return interaction.reply("<:check:811763193453477889> The suggestions module has successfully been disabled for this server.");
        }
    }
}