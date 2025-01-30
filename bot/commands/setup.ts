import { Declare, Command, type CommandContext, Embed, ActionRow, Button, ButtonInteraction } from 'seyfert';
import { db } from '../components/prisma';
import { ButtonStyle, MessageFlags, PermissionFlagsBits } from 'seyfert/lib/types';
import { Options, createRoleOption, createChannelOption, createStringOption, createIntegerOption } from 'seyfert';
import logger from '../components/logger';
import { Colors } from '../components/colors';
import { en } from '../../lang';

const options = {
  verifyrole: createRoleOption({
    description: 'Role to assign upon verification',
    required: true
  }),
  logchannel: createChannelOption({
    description: 'Channel to log verification events',
    required: true
  }),
  // why the hell did i never implement this lol
  actiononfail: createStringOption({
    description: 'Action to take when verification fails',
    choices: [
      { name: 'Do Nothing (recommended, default)', value: 'nothing' },
      { name: 'Mute 60s', value: 'mute1' },
      { name: 'Mute 5m', value: 'mute5' },
      { name: 'Mute 15m', value: 'mute15' },
      { name: 'Kick', value: 'kick' },
      { name: 'Ban', value: 'ban' }
    ],
    required: false
  }),
  minage: createIntegerOption({
    description: 'Minimum account age to verify in hours (max 8766, min 1, default 24)',
    max_value: 8766,
    min_value: 1,
    required: false
  }),
  veriftimeout: createIntegerOption({
    description: 'Verification timeout in seconds (min 60, max 3600, default 120)',
    max_value: 3600,
    min_value: 60,
    required: false
  })
};


@Declare({
  name: 'setup',
  description: 'Setup Artemis'
})
@Options(options)
export default class SetupCommand extends Command {
  async run(ctx: CommandContext<typeof options>) {
    if (!ctx.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return ctx.editOrReply({
        embeds: [
          new Embed({
            color: Colors.Red,
            description: en.errors.noperms("Manage Server",false)
          })
        ],
        flags: MessageFlags.Ephemeral
      });
    }

    let existingConf = await db.server.findFirst({
      where: {
        discordId: ctx.guildId || ""
    },
    select: {
        discordId: true
    }
    })
    if (existingConf) {
        let em = new Embed({
            title: en.question.title,
            color: Colors.Mauve,
            description:
              en.question.overwrite,
          });
          // buttons
          const confirm = new Button()
            .setCustomId("confirm")
            .setStyle(ButtonStyle.Danger)
            .setLabel(en.question.options.y);
          const cancel = new Button()
            .setCustomId("cancel")
            .setStyle(ButtonStyle.Secondary)
            .setLabel(en.question.options.n);
          const row = new ActionRow<Button>().setComponents([cancel, confirm]);
    
          let m = await ctx.editOrReply({ embeds: [em], components: [row] }, true);
          // @ts-ignore
          const collector = m.createComponentCollector();
          collector.run("confirm", async (i: ButtonInteraction) => {
            if (!i.isButton()) {
              return;
            }
            if (i.user.id != ctx.author.id) {
              return await i.write({
                content: en.general.mybtn,
                flags: MessageFlags.Ephemeral,
              });
            }
    
            try {
              await db.server.upsert({
                where: {
                  discordId: ctx.guildId || "",
                },
                update: {
                  verifyRole: ctx.options.verifyrole.id,
                  loggingChannel: ctx.options.logchannel.id,
                  actionOnFail: ctx.options.actiononfail,
                  minAge: ctx.options.minage,
                  verifTimeout: ctx.options.veriftimeout,
                },
                create: {
                  discordId: ctx.guildId || "",
                  verifyRole: ctx.options.verifyrole.id,
                  loggingChannel: ctx.options.logchannel.id,
                  actionOnFail: ctx.options.actiononfail,
                  minAge: ctx.options.minage,
                  verifTimeout: ctx.options.veriftimeout,
                },
              });
        
              logger.debug(`Server configuration updated successfully for guild: ${ctx.guildId}`);
        
              await ctx.editOrReply({
                embeds: [
                  new Embed({
                    color: Colors.Green,
                    description: en.success.updatedconf
                  })
                ],
                components: [],
              });
            } catch (error) {
              logger.error("Error updating server configuration:", error);
              await ctx.editOrReply({
                embeds: [
                  new Embed({
                    color: Colors.Red,
                    description: en.errors.conf
                  })
                ],
                components: [],
                flags: MessageFlags.Ephemeral
              });
            }
            
          });
          collector.run("cancel", async (i: ButtonInteraction) => {
            if (!i.isButton()) {
              return;
            }
            if (i.user.id != ctx.author.id) {
              return await i.write({
                content: en.general.mybtn,
                flags: MessageFlags.Ephemeral,
              });
            }
    
            await ctx.editOrReply({
              content: en.general.cancel,
              flags: MessageFlags.Ephemeral,
              embeds: [],
              components: [],
            });
          });
          
    } else {
    try {
      await db.server.upsert({
        where: {
          discordId: ctx.guildId || "",
        },
        update: {
          verifyRole: ctx.options.verifyrole.id,
          loggingChannel: ctx.options.logchannel.id,
          actionOnFail: ctx.options.actiononfail,
          minAge: ctx.options.minage,
          verifTimeout: ctx.options.veriftimeout,
        },
        create: {
          discordId: ctx.guildId || "",
          verifyRole: ctx.options.verifyrole.id,
          loggingChannel: ctx.options.logchannel.id,
          actionOnFail: ctx.options.actiononfail,
          minAge: ctx.options.minage,
          verifTimeout: ctx.options.veriftimeout,
        },
      });

      logger.debug(`Server configuration updated successfully for guild: ${ctx.guildId}`);

      await ctx.editOrReply({
        embeds: [
          new Embed({
            color: Colors.Green,
            description: en.success.updatedconf
          })
        ],
        components: [],
      });
    } catch (error) {
      logger.error("Error updating server configuration:", error);
      await ctx.editOrReply({
        embeds: [
          new Embed({
            color: Colors.Red,
            description: en.errors.conf
          })
        ],
        components: [],
        flags: MessageFlags.Ephemeral
      });
    }}
  }
}
