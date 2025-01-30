import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'
dayjs.extend(relativeTime);
dayjs.extend(duration);
export const en = {
    errors: {
        title: "Error",
        invalid: "This code is invalid.",
        alt: "The IP you are trying to verify on belongs to someone else.",
        vpn: "Please disable your VPN to verify. If this is not possible, contact a server admin to manually verify you.",
        auto: "Verification has been closed for this server. Please try again later.",
        noconf: "Server configuration not found. Please run the setup command first.",
        alreadyverified: "You already have the verified role.",
        noperms: (permission:string,me:true | false = false)=> {
            return `${me ? "I" : "You"} need the '${permission}' permission ${!me ? "to do this." : ""}.`
        },
        conf: "An error occurred while updating the server configuration. Please try again later.",
        nouser: "Unable to find the specified user in this server.",
        verify: "An error occurred while trying to verify the user. Please try again later.",
        tooyoung: (hours:number)=>{
            return `You have failed verification because your account is too young. This server requires that your account is at least \`${dayjs.duration({hours: hours}).humanize()}\`.`
        },
        bot: {
            alt: "You have failed verification because the IP you are trying to verify on belongs to someone else.",
            vpn: "You have failed verification because you are on a VPN. Turn off your VPN and try again. If this is not possible, contact a server admin to manually verify you.",
            timeout: "You have failed verification because you took too long.",
            generic: "You have failed verification.",
            log: {
                
            },
            badperms: "This server has not been configured properly. I can't verify you :("
        }
    },
    wait: {
        linkgen: "Creating verification link... should take only a second",
        verify: "Verifying..."
    },
    success: {
        title: "Success",
        verify: "You have successfully verified. You may go back to Discord.",
        verifyBot: "You have successfully verified. Enjoy the server!",
        linkgen: (link:string)=>{ // functions are used for string templates, instead of just using .replace a bunch
            let hn = new URL(link || "http://unknown.link").hostname;
            let allowedHosts = ["artemis-bot.com", "www.artemis-bot.com"];
            let isOfficialLink = allowedHosts.includes(hn);
            return `**This server is protected by Artemis, a FOSS server protection bot. You must verify to continue.** Don't worry, this is 100% automatic.\n\n[Click here to verify! (\`${hn}\`${isOfficialLink ? ", official Artemis link!" : ""})](${link})`
        },
        updatedconf: "Server configuration has been updated successfully.",
        auto: "You have verified.",
    },
    general: {
        footer: "Verifying with Artemis; Discord's best FOSS server protection bot.",
        cancel: "Cancelled.",
        mybtn: "This is **not** your button."
    },
    question: {
        title: "Question",
        overwrite: "A configuration for this server already exists. Overwrite it?",
        options: {y: "Yes", n: "No"}
    }
} 