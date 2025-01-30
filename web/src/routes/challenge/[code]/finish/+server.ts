import { db } from "$lib/prisma"
import { text,json } from "@sveltejs/kit"
import { getIPAddr, cm, hash } from "$lib"
import { en } from "../../../../../../lang"

export async function GET(data) {
    let pg = await db.verificationPg.findFirst( {
        where: {
            id: data.params.code
        }
    })
    if (!pg) {
        return json(
            {
                failed: true,
                reason: en.errors.invalid
            }
            )
    }
    let vpn = cm.contains(getIPAddr(data)).toString()
    if (vpn == "true") {
        await db.verificationPg.update( {
            where: {
                id: data.params.code
            },
            data: {
                signal: "failed vpn"
            }
        }
        )
        return json(
        {
            failed: true,
            reason: en.errors.vpn 
        }
        )
    }
    let u = await db.user.findFirst( { // /verify created this beforehand
        where: {
            discordId: pg.discordId
        }
    }) 
    let i = await db.iPAddress.findFirst(
        {
            where: {
                ip: hash(getIPAddr(data))
            }
        }
    )

    if (i) {
        if (i.userDiscordId != u?.discordId) {
            await db.verificationPg.update( {
                where: {
                    id: data.params.code
                },
                data: {
                    signal: `failed badip ${i.userDiscordId}`
                }
            }
            )
            return json(
                {
                    failed: true,
                    reason: en.errors.alt
                }
            )
        } else {
            await db.verificationPg.update( {
                where: {
                    id: data.params.code
                },
                data: {
                    signal: "success"
                }
            }
            )
            return json(
                {
                    failed: false,
                    reason: en.success.verify
                }
            )
        }
    } else {
        await db.iPAddress.create( {
            data: {
                ip: hash(getIPAddr(data)),
                User: {
                    connect: {
                        discordId: pg.discordId 
                    }
                }
            }
        }
        );

        await db.verificationPg.update( {
            where: {
                id: data.params.code
            },
            data: {
                signal: "success"
            }
        }
        )
        return json(
            {
                failed: false,
                reason: en.success.verify
            }
        )
    }
}