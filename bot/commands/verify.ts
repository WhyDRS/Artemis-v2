import { Declare, Command, type CommandContext, Embed } from 'seyfert';
import { Colors } from '../components/colors';
import { MessageFlags } from 'seyfert/lib/types';
import { en } from '../../lang';
import { enb } from "../../langbot"
import { db } from '../components/prisma';
import logger from '../components/logger';
import { hash } from '../../web/src/lib';
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Declare({
  name: 'verify',
  description: 'Verify yourself'
})
export default class VerifyCommand extends Command {

  async run(ctx: CommandContext) {
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
    if (ctx.member?.roles.keys.includes(serverConfig.verifyRole)) {
      let em = new Embed({
        color: Colors.Red,
        description: en.errors.alreadyverified,
        
      });
      await ctx.editOrReply({ embeds: [em],flags: MessageFlags.Ephemeral});
      return;
    }
    // retarded self few days ago forgot to use this variable
    let createdAgo =
    (Math.round(Date.now() / 1000) -
      // library likes `| undefined`
      Math.round(ctx.member!.createdTimestamp / 1000)) /
    3600;
    
    await ctx.write({
        embeds: [
          new Embed({
            color: Colors.Green,
            description: en.wait.linkgen
          })
        ]
        ,flags: MessageFlags.Ephemeral
      });
      let u = await db.user.findFirst( {
        where: {
            discordId: ctx.author.id
        }
    })
    if (!u) {
      u = await db.user.create( {
        data: {
            discordId: ctx.author.id
        }
    })
    }
    let pg = await db.verificationPg.create(
        {
            data: {
                discordId: ctx.author.id!, 
                serverDiscordId: ctx.guildId!
            }
        }
    )
    await ctx.editOrReply({
        embeds: [
          new Embed({
            color: Colors.Mauve,
            description: en.success.linkgen(`${process.env.INSTANCE}/challenge/`+pg.id)
          })
        ]
        ,flags: MessageFlags.Ephemeral
      });
    let time = 0
    while (time < serverConfig.verifTimeout*1000) {
      let pgu = await db.verificationPg.findFirst({
        where: {
          id: pg.id
      }
      })
      if (pgu!.signal != "pending" || time > serverConfig.verifTimeout*1000) {
        await sleep(100)
        break
      }
      await sleep(2000)
      time += 2000
    }
    let pgu = await db.verificationPg.findFirst({
      where: {
        id: pg.id
    }
    })
    let finalSignal = pgu!.signal
    await db.verificationPg.delete( {
      where: {
        id: pgu!.id
      }
    }
    )
    switch (finalSignal.split(" ")[0]) {
      case "failed":
        switch (finalSignal.split(" ")[1]) {
          case "badip": // not sure why this was alt
            await ctx.editOrReply({
              embeds: [
                new Embed({
                  color: Colors.Red,
                  description: en.errors.bot.alt
                })
              ]
              ,flags: MessageFlags.Ephemeral
            });
            await ctx.client.messages.write(serverConfig.loggingChannel, {content: await enb.errors.bot.log.alt(ctx,finalSignal.split(" ")[2])})
            break
          case "vpn":
            await ctx.editOrReply({
              embeds: [
                new Embed({
                  color: Colors.Red,
                  description: en.errors.bot.vpn
                })
              ]
              ,flags: MessageFlags.Ephemeral
            });
            await ctx.client.messages.write(serverConfig.loggingChannel, {content: enb.errors.bot.log.vpn(ctx)})
            break   
          case "timeout":
            await ctx.editOrReply({
              embeds: [
                new Embed({
                  color: Colors.Red,
                  description: en.errors.bot.timeout
                })
              ]
              ,flags: MessageFlags.Ephemeral
            });
            await ctx.client.messages.write(serverConfig.loggingChannel, {content: enb.errors.bot.log.timeout(ctx)})
            break     
          default:
            await ctx.editOrReply({
              embeds: [
                new Embed({
                  color: Colors.Red,
                  description: en.errors.bot.generic
                })
              ]
              ,flags: MessageFlags.Ephemeral
            });
            await ctx.client.messages.write(serverConfig.loggingChannel, {content: enb.errors.bot.log.generic(ctx)})
            break 
        }
        break
      case "success":
        await ctx.editOrReply({
          embeds: [
            new Embed({
              color: Colors.Green,
              description: en.success.verifyBot
            })
          ]
          ,flags: MessageFlags.Ephemeral
        });
        await ctx.client.messages.write(serverConfig.loggingChannel, {content: enb.success.verifyBotlog(ctx)})
        try {
        await ctx.member!.roles.add(serverConfig.verifyRole)
        } catch (e) {
          // likely the admin never let artemis give the role due to bad permissions

          let er = e instanceof Error ? e.message : String(e);
          logger.error(e)
          try {
            await ctx.editOrReply({
              embeds: [
                new Embed({
                  color: Colors.Red,
                  description: en.errors.bot.badperms
                })
              ],
              flags: MessageFlags.Ephemeral
            });
          await ctx.client.messages.write(serverConfig.loggingChannel, {content: `<@${ctx.guild()!.ownerId}> ${enb.errors.bot.log.badpermsrole}\n\n \`${er}\``})
        } catch {
          // bro i have no idea why i'm nesting try catches. yandere simulator dev fr
          // on a serious note we already logged the error to console so nothing to do
        }
        }
        break
      // dumbass never implemented the pending signal
      case "pending":
        await ctx.editOrReply({
          embeds: [
            new Embed({
              color: Colors.Red,
              description: en.errors.bot.timeout
            })
          ]
          ,flags: MessageFlags.Ephemeral
        });
        break
      default:
        await ctx.editOrReply({
          embeds: [
            new Embed({
              color: Colors.Green,
              description: `this shouldn't happen, contact bot owner or create a gitlab issue. (signal ${finalSignal} recieved)`
            })
          ],
          flags: MessageFlags.Ephemeral
        });break
    }
  }
}
