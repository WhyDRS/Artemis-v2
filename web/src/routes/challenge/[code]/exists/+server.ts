import { db } from "$lib/prisma"
import { text } from "@sveltejs/kit"
export async function GET(data) {
    let i = await db.verificationPg.findFirst( {
        where: {
            id: data.params.code
        }
    })
    if (i) {return text("true")} else {return text("false")}
}