import { Client } from "seyfert"
import * as sqlite from "./components/sqlite"
import logger from "../../bot/components/logger";
import { PresenceUpdateStatus } from "seyfert/lib/types";
const c = require("colors")
import co from "colors"; // import types
import { decryptData } from "./components/helper";
// @ts-expect-error
console.log(`🦉 ${"Athena's announcement script for Artemis v1".bold.green} ${"——————————————————————————————".gray}`)
logger.info("Using message from stdin:");
let msg = await Bun.stdin.text()
console.log(msg)
const client = new Client();
await client.start();
await client.gateway.setPresence({
    activities: [],
    afk: true,
    since: Date.now(),
    status: PresenceUpdateStatus.Invisible,
  })

let db = sqlite.dbopen("./v1db.sql",true)
let guildList = sqlite.dbtablelen(db,"config")
logger.info(`Found ${(await client.guilds.list()).length} guilds, and ${guildList} configured servers`)
for (let i = 0; i < guildList; i++) {
    try {
    let guild = await client.guilds.fetch(sqlite.dbreadnameidx(db,"config",i+1).name,true)
    let config = JSON.parse(decryptData(sqlite.dbread(db,"config",guild.id).value,guild.id))
    let channel = await guild.channels.fetch(config.loggingchannel)
    await client.messages.write(channel.id, { content: msg })
    logger.info(`Sent message to ${guild.name}`)
    } catch  (e) {logger.error(e)}
}
process.exit(0); 