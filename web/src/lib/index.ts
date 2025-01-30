import type { RequestEvent } from "@sveltejs/kit";
import fs from 'node:fs/promises';
import cidrmatcher from "cidr-matcher"
export let vlist = (await file("src/lib/vpnlist.txt")).split("\n") // assuming cwd is /web; this is just a wrapper for node's api
export let cm = new cidrmatcher()
import { createHash } from "node:crypto"
for (let i = 0; i < vlist.length; i++) {
    try {
        cm.addNetworkClass(vlist[i])
    }
    catch {console.log(vlist[i])}
}
export async function file(uri: string) {
    return await fs.readFile(uri, 'utf-8');
}


export function getIPAddr(data: RequestEvent): string {
    let headers = ["x-forwarded-for","forwarded","x-real-ip","cf-connecting-ip","x-forwarded","fastly-client-ip","x-client-ip","x-cluster-client-ip","forwarded-for","appengine-user-ip","true-client-ip","cf-pseudo-ipv4"]
    for (const [hk, hv] of data.request.headers) {
        console.log(hk,hv)
        if (headers.includes(hk)) {
            return hv;
        }
    }
    return data.getClientAddress()
}

export let commit = (await file("../.commit")).split("\n")
setInterval(async ()=>{
    commit = (await file("../.commit")).split("\n")
},3600000)

export function hash(input:string) {
    return createHash('sha256').update(input).digest('base64');
}