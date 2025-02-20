import { ComponentCommand, type ComponentContext } from "seyfert";
import VerifyCommand from "../commands/verify";
import { MessageFlags } from "seyfert/lib/types";
// 200% of this came from artemis v1
export default class VerifyButton extends ComponentCommand {
  componentType = "Button" as const;

  filter(ctx: ComponentContext<typeof this.componentType>) {
    return ctx.customId === "verify";
  }

  async run(ctx: ComponentContext<typeof this.componentType>) {
    //@ts-expect-error
    return await new VerifyCommand().run(ctx);
  }
}

