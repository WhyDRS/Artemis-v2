import { Client, type ParseClient, } from "seyfert";
import { LogLevels } from "seyfert/lib/common";
import logger from "./components/logger";

const c = require("colors")
import co from "colors";

const client = new Client();

// @ts-expect-error
console.log(`🚀 ${"Artemis v2".bold.blue} ${"——————————————————————————————".gray}`)

// Override Seyfert's default logger
client.logger.debug = logger.debug;
client.logger.info = logger.info;
client.logger.warn = logger.warn;
client.logger.error = logger.error;
client.logger.fatal = logger.error;

// This will start the connection with the gateway and load commands, events, components and langs
client.start().then(() => client.uploadCommands());

declare module 'seyfert' {
  interface UsingClient extends ParseClient<Client<true>> { }
}