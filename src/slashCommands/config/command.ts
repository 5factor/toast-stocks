import SlashCommand from "../../util/classes/SlashCommand";
import ToastClient from "../../util/classes/ToastClient";
import { CommandInteraction } from "discord.js";

export default class extends SlashCommand {
    public constructor(client: ToastClient) {
        super(client, {
            name: "command",
            description: "Enable/disable a command.",
            permissionLevel: 3,
            category: "config",
            options: [
            {
                "type": 3,
                "name": "command",
                "description": "Full name of command",
                "required": true
            },
            {
                "type": 5,
                "name": "enable",
                "description": "Enable or disable",
                "required": true
            }
        ]
        });
    }

    public async run(client: ToastClient, interaction: CommandInteraction) {
        const [command, bool] = interaction.options.map(v => v.value);

        const cmd = client.slashCommands.get(<string>command);
        if (!cmd) return interaction.reply(`<:no:811763209237037058> The command provided does not exist.`, { ephemeral: true });
        if (cmd.conf.restricted) return interaction.reply(`<:no:811763209237037058> This command cannot be edited.`, { ephemeral: true });

        await client.db.guilds.toggleCommand(interaction.guild.id, <string>command, <boolean>bool)
            .catch(e => {
                return interaction.reply(`<:no:811763209237037058> The following error occurred while attempting to toggle the command:\n\`\`\`${e}\`\`\``, { ephemeral: true });
            });

        return interaction.reply(`<:check:811763193453477889> The \`${command}\` command has successfully been set to ${bool}.`);
    }
}