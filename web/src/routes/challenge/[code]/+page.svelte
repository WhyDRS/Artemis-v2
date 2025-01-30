<script lang="ts">
    import v from "./verify"
    import { page } from '$app/stores'
	import { onMount } from "svelte";
    import { en } from "../../../../../lang";
    // @ts-ignore
    let status: {failed: true | false, waiting?: true | false, reason?: string | undefined} = {failed: false, waiting: true, reason: undefined};
    setTimeout(async ()=>{
        document.querySelector(".artemis-logo")!.innerHTML = await (await fetch("/artemis-animated.svg")).text()
    },20)
    onMount(async ()=>{
    setTimeout(async()=>{
        
    let res = await v($page.params.code)
    status = res
    let reason = status.reason!.split(". ")
    // @ts-expect-error
    document.querySelector(".status")!.innerText = reason[0]
    // @ts-expect-error
    document.querySelector(".subStatus")!.innerText = reason[1] || "" 
    colorSvg(!(status.failed || false))
    },500)
    })

    function colorSvg(success:boolean) {
        let b = document.querySelectorAll(".artemis-logo svg *")
        for (let i = 0; i < b.length; i++) {
            if (b[i].style.fill && b[i].style.fill != "none") {
            b[i].style.fill = success ? "#a6e3a1" : "#f38ba8"
            }
            if (b[i].style.stroke) {
            b[i].style.stroke = success ? "#a6e3a1" : "#f38ba8"
            }
            b[i].style.animationDelay = "0ms"
            b[i].style.animationIterationCount = "1"
            b[i].style.animationTimingFunction = "ease"
        }
    }
</script>
<div class="w-full h-screen grid place-items-center bg-mantle text-text">
    <div class="p-6 rounded-lg bg-base min-w-[480px] w-fit max-w-[640px]">
        <span class="flex flex-row justify-evenly items-center ">
        <div class="artemis-logo" style="transform:scale(1.3)">
            <img src="artemis-smol.svg" alt="">
        </div>
        <div class="flex flex-col justify-center items-center">
        <h1 class="font-bold text-2xl status">Verifying...</h1>
        <h2 class="text-xl subStatus">Please wait...</h2>
    </div>
    </span>
    </div>
    <span class="absolute bottom-8 opacity-75">{en.general.footer}</span>
</div>