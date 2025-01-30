<script>
    import { commit } from "$lib";
</script>
<div class="w-full h-screen grid place-items-center bg-mantle text-text">
    <div class="p-6 rounded-lg bg-base w-[480px]">
        <h1 class="flex flex-row justify-center items-center text-3xl font-bold">
            <img src="/artemis.svg" class="w-[1.5em] h-[1.5em] mr-4" alt=""> Artemis 
        </h1>
        <br>
        This is the frontend of an Artemis v2 instance, made using SvelteKit and TailwindCSS.
        <br>
        <span class="py-2 inline-block">
            Git commit: 
            <a class="text-blue hover:underline" href={commit[1]} ><code class="p-1 bg-crust font-mono rounded">{commit[0].substring(0,16)}</code></a>
            <span class="ml-2 rounded-full {commit[2] == "true" ? "bg-green" : "bg-red"} p-1 px-3 font-bold">
                {@html commit[2] == "true" ? `<span class="text-base">Instance matches origin!</span>` : `<span class="text-base">Instance doesn't match origin!</span>`}
            </span>
        </span>
        <br><br>
        Did you mean to:
        <li>
            <a class="text-blue hover:underline" href="https://artemis-bot.com">Go to Artemis's website?</a>
        </li>
        <li>
            <a class="text-blue hover:underline" href="/invite">Invite Artemis?</a>
        </li>
        <li>
            <a class="text-blue hover:underline" href="https://gitlab.com/uhidontkno/artemis-v2">View Artemis's source code?</a>
        </li>
    </div>
</div>