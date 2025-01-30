import type { CommandContext } from "seyfert"
import type { User } from "@prisma/client"
import { Client } from "seyfert"
const c = new Client()
export const enb = {
    errors: {
        bot: {
            log: {
                badpermsrole: "You have not configured your server properly! Make sure the \"Artemis\" role is **above** the role you want to give to your users __AND__ I have the `Manage Roles` permission.",
                alt: async (ctx:CommandContext,offender:string)=>{
                    let ou = await ctx.client.users.fetch(offender,true)
                    let om = await ctx.client.members.fetch(ctx.guildId!,offender,true)
                    return `<@${ctx.author.id}> (\`${ctx.author.username}\`, \`${ctx.author.id}\`) has **failed** verification because they were on \`${ou.username}\` (\`${offender}\`)'s IP address
* Account created: <t:${Math.floor(ctx.author.createdAt.getTime()/1000)}:R>   (<t:${Math.floor(ctx.author.createdAt.getTime()/1000)}>)
* Account joined:  <t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}:R> (<t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}>)
* Linked account created: <t:${Math.floor(ou.createdAt.getTime()/1000)}:R>    (<t:${Math.floor(ou.createdAt.getTime()/1000)}>)
* Linked account joined:  <t:${Math.floor(om.joinedTimestamp! / 1000)}:R>     (<t:${Math.floor(om.joinedTimestamp! / 1000)}>)
`
                },
                vpn: (ctx:CommandContext) => {
                    return `<@${ctx.author.id}> (\`${ctx.author.username}\`, \`${ctx.author.id}\`) has **failed** verification because they were on a VPN.
* Account created: <t:${Math.floor(ctx.author.createdAt.getTime()/1000)}:R>   (<t:${Math.floor(ctx.author.createdAt.getTime()/1000)}>)
* Account joined:  <t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}:R> (<t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}>)
`
                },
                timeout: (ctx:CommandContext) => {
                    return `<@${ctx.author.id}> (\`${ctx.author.username}\`, \`${ctx.author.id}\`) has **failed** verification because they took too long.
* Account created: <t:${Math.floor(ctx.author.createdAt.getTime()/1000)}:R>   (<t:${Math.floor(ctx.author.createdAt.getTime()/1000)}>)
* Account joined:  <t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}:R> (<t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}>)
`
                },
                generic: (ctx:CommandContext) => {
                    return `<@${ctx.author.id}> (\`${ctx.author.username}\`, \`${ctx.author.id}\`) has **failed** verification.
* Account created: <t:${Math.floor(ctx.author.createdAt.getTime()/1000)}:R>   (<t:${Math.floor(ctx.author.createdAt.getTime()/1000)}>)
* Account joined:  <t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}:R> (<t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}>)
`
                }
            }
        }
    },
    success: {
        verifyBotlog: (ctx:CommandContext) => {
            return `<@${ctx.author.id}> (\`${ctx.author.username}\`) has **passed** verification!
* Account created:            <t:${Math.floor(ctx.author.createdAt.getTime()/1000)}:R>         (<t:${Math.floor(ctx.author.createdAt.getTime()/1000)}>)
* Account joined:             <t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}:R>       (<t:${Math.floor((ctx.member!.joinedTimestamp!) / 1000)}>)
`
        }
    }
} 