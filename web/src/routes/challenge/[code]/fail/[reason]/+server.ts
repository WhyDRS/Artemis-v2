import { db } from "$lib/prisma"
import { text } from "@sveltejs/kit"
export async function GET(data) {
    let i = await db.verificationPg.findFirst( {
        where: {
            id: data.params.code
        }
    })
    if (!i) {return text("code doesn't exist", {status:404})}
    if (i.signal && i.signal != "pending") {
        return text("signal can't be updated", {status:400});
    }
    if (!["failed","failed vpn", "failed timeout","failed alt"].includes(data.params.reason)) {
        return text("bad signal", {status:400})
    }
    await db.verificationPg.update(
        { where: {
            id: data.params.code
        },
        data: {
            signal: data.params.reason
        }
    }
    )
    return text("ok")
}