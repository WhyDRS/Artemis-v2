import { createEvent } from "seyfert";
import logger from "../components/logger";
import { ActivityType, PresenceUpdateStatus } from "seyfert/lib/types";
export default createEvent({
  // botReady executes when all shards and guilds are ready.
  data: { once: true, name: "botReady" },
  run(user, client) {
    logger.info(`${user.username} is ready`);
    client.gateway.setPresence({
      activities: [{
        name: `🚀`,
        type: ActivityType.Custom,
        state: `🚀 ${process.env.INSTANCE?.split("://")[1]}`,
      }],
      afk: false,
      since: Date.now(),
      status: PresenceUpdateStatus.DoNotDisturb,
    })
  }
})