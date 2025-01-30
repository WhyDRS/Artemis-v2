import { $ } from "bun";
import { init } from '@paralleldrive/cuid2';
import { loggingLevels } from "./bot/components/logger";
import logger from "./bot/components/logger";
import os from "node:os"
import { db } from "./bot/components/prisma";
let fp = `[${os.hostname()}-${os.arch()}-${os.platform()},${Number.MAX_SAFE_INTEGER},${Date.now()},${process.env.INSTANCE},${Math.random().toString(16).replace(".","4")}]`
const secure = init({
  random: Math.random,
  length: 32,
  fingerprint: fp,
});

function keygen() {
    let key = secure()
    let kh = new Bun.CryptoHasher("sha256").update(key).digest("hex");
    let fpr = Math.random().toString(16).replace(".","c")
    return `###################################################################
# THIS IS ARTEMIS'S ENCRYPTION KEY!                               #
# DO NOT MODIFY THIS FILE!!!                                      #
# YOU WILL NEED A COMPLETE DATABASE RESET IF YOU CHANGE THIS KEY  #
###################################################################
secure_;v2$${key};${kh};${fpr};${Date.now()}
`
}

if (!await Bun.file(".key").exists()) {
    logger.info("There is no encryption key for Artemis to use. Generating one.");
    //console.log(keygen())
    logger.info("Artemis's key is stored in the .key file. Keep it safe!\n")
    logger.warn("If you lose this file or tamper with it, any encrypted data will be INACCESSIBLE PERMANENTLY\n         and you will need a COMPLETE DATABASE RESET to not cause issues.\n\n")
    await Bun.write(".key",keygen())

}

let d = await db.$connect();
async function dotCommit() {
let clean = (await $`git diff --quiet && git diff --cached --quiet`.throws(false)).exitCode == 0
Bun.write(".commit",`${(await $`git rev-parse HEAD`.quiet()).text()}${(await $`git config --get remote.origin.url`.quiet()).text()}${clean}`);
}

await dotCommit();setInterval(async ()=>{await dotCommit()},3600000);

(async()=>{
    await $`bun run bot/index.ts`
})();
(async()=>{
    await $`cd web; bunx vite dev --port 8085 --host 0.0.0.0"`
})();