import { text } from "@sveltejs/kit";
import { getIPAddr } from "$lib";
export function GET(data) {
    return text(getIPAddr(data))
}