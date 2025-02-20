import { en } from "../../../../../lang"
async function fail(obj: {failed: true | false, reason: string, signal: string},code:string) {
    await fetch(`/challenge/${code}/fail/${obj.signal}`)
    // @ts-expect-error
    obj.signal = undefined;
    return obj
}
export default async function v(code: string) {
    let e = await (await fetch(`/challenge/${code}/exists`)).text()
    if (e == "false") {
        return {
            failed: true,
            reason: en.errors.invalid
        }
    }
    let ipaddr;
    const ipmirror = ["/api/ip","https://checkip.amazonaws.com/",
        "https://api.ipify.org/","https://myexternalip.com/raw","https://ipinfo.io/ip" // these last 3 should NEVER be used 
    ]
    for (let i = 0; i < ipmirror.length; i++) {
        try {
        let res = await fetch(ipmirror[i],{ signal: AbortSignal.timeout(5000) })
        if (!res.ok) {continue}
        ipaddr = await res.text(); 
        if (ipaddr == "::1" || ipaddr == "127.0.0.1" || ipaddr == "localhost" || ipaddr == "::ffff:127.0.0.1") {ipaddr = undefined;continue;} // /api/ip probably gave us a loopback address
        break
        } catch {continue}
    }
    if (await (await fetch(`/api/isvpn`)).text() == "true" || await (await fetch(`/api/isvpn/${ipaddr}`)).text() == "true") {
        return await fail({
            failed: true,
            reason: en.errors.vpn,
            signal: "failed vpn"
        },code)
    }
    return await(await fetch(`/challenge/${code}/finish`)).json()
    
}
