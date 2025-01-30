import { Declare, Command, type CommandContext, Embed } from 'seyfert';
import { MessageFlags } from 'seyfert/lib/types';
import { db } from '../components/prisma';
import { Options, createUserOption } from 'seyfert';
import logger from '../components/logger';
import { ChannelType } from 'seyfert/lib/types';
import { Colors } from '../components/colors';
import { PermissionFlagsBits } from 'seyfert/lib/types';
import { en } from '../../lang';

const options = {
  user: createUserOption({
    description: 'The user to manually verify',
    required: true
  })
};

@Declare({
  name: 'manualverify',
  description: 'Manually verify a user'
})
@Options(options)
export default class ManualVerifyCommand extends Command {
  async run(ctx: CommandContext<typeof options>) {
    // Check if the user has the Manage Guild permission
    if (!ctx.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return ctx.editOrReply({
        embeds: [
          new Embed({
            color: Colors.Red,
            description: "You need the 'Manage Server' permission to use this command."
          })
        ],
        flags: MessageFlags.Ephemeral
      });
    }

    const targetUser = ctx.options.user;

    try {
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

      const member = await ctx.guild()?.members.fetch(targetUser.id);
      
      if (!member) {
        return ctx.editOrReply({
          embeds: [
            new Embed({
              color: Colors.Red,
              description: en.errors.nouser
            })
          ]
        });
      }
      const memberRoles = await member.roles.list();
      const hasVerifyRole = memberRoles.some(role => role.id === serverConfig.verifyRole);
      
      if (hasVerifyRole) {
        return ctx.editOrReply({
          embeds: [
            new Embed({
              color: Colors.Red,
              description: `${targetUser.toString()} already has the verification role.`
            })
          ]
        });
      }

      await member.roles.add(serverConfig.verifyRole);
      
      await ctx.editOrReply({
        embeds: [
          new Embed({
            color: Colors.Green,
            description: `Successfully verified ${targetUser.toString()}.`
          })
        ]
      });
      if (serverConfig.loggingChannel) {
        const logChannel = await ctx.guild()?.channels.fetch(serverConfig.loggingChannel);
        if (logChannel?.type === ChannelType.GuildText) {
          await ctx.client.messages.write(serverConfig.loggingChannel, {
            embeds: [
              new Embed({
                color: Colors.Mauve,
                description: `${ctx.author} manually verified ${targetUser.toString()}.`
              })
            ]
          });
        }
      }
    } catch (error) {
      logger.error("Error in manual verification:", error);
      await ctx.editOrReply({
        embeds: [
          new Embed({
            color: Colors.Red,
            description: en.errors.verify
          })
        ],
        flags: MessageFlags.Ephemeral
      });
    }
  }
}
