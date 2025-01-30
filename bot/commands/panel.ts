import {
    Declare,
    Command,
    type CommandContext,
    Embed,
    Button,
    ActionRow,
  } from "seyfert";
  import { Colors } from '../components/colors';
  import { en } from "../../lang";
  import { MessageFlags, ButtonStyle } from "seyfert/lib/types";
  import { ButtonInteraction } from "seyfert";
  import { db } from "../components/prisma";
  @Declare({
    name: "panel",
    description: "Show the verification panel",
  })
  // 99% of this came from artemis v1
  export default class PanelCommand extends Command {
    async run(ctx: CommandContext) {
      if (
        !ctx.member?.permissions.has(
          ctx.member?.permissions.Flags.ModerateMembers,
        )
      ) {
        await ctx.editOrReply({
          content:
            "You need the `Moderate Members` permission to use this command.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
      const serverConfig = await db.server.findUnique({
        where: {
          discordId: ctx.guildId || "",
        }
      });
      if (!serverConfig) {
        return ctx.editOrReply({
          embeds: [
            new Embed({
              color: Colors.Red,
              description: en.errors.noconf
            })
          ]
        });
      }
      let em = new Embed({
        title: "",
        color: Colors.Mauve,
        description: "Click the button below to verify.",
      });
      // buttons
      const v = new Button()
        .setCustomId("verify")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Verify");
      const row = new ActionRow<Button>().setComponents([v]);
  
      let m = await ctx.client.messages.write(ctx.channelId, {
        embeds: [em],
        components: [row],
      });
  
      await ctx.editOrReply({
        content: "Sent",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
  