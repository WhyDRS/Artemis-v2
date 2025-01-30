import { getIPAddr, cm } from "$lib"
import { text } from "@sveltejs/kit"
export async function GET(data) {
    return text(cm.contains(data.params.ip).toString())
}