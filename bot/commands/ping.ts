import { Declare, Command, type CommandContext, Embed } from 'seyfert';
import { Colors } from '../components/colors';
import { MessageFlags } from 'seyfert/lib/types';

@Declare({
  name: 'ping',
  description: 'Show the ping with discord'
})
export default class PingCommand extends Command {

  async run(ctx: CommandContext) {
    // average latency between shards
    const ping = ctx.client.gateway.latency;

    await ctx.write({
      embeds: [
        new Embed({
          color: Colors.Blue,
          description: `Pong! \`${ping}\`ms`
        })
      ],
      flags: MessageFlags.Ephemeral
    });
  }
}
