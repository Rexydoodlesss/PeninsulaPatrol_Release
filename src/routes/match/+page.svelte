<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { matchKey } from '../../stores.js';
    let currentIndex = 0;
    let startX = 0;
    let username = ''
    let isOnline = false;
    import Auto from "$lib/components/Auto.svelte";
    import Tele from "$lib/components/Tele.svelte";
    import Endgame from "$lib/components/Endgame.svelte";
    let items = [Auto, Tele, Endgame];

    onMount(() => {
        if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
            username = sessionStorage.getItem('username');  
            isOnline = navigator.onLine;

            window.addEventListener('online', updateOnlineStatus);
            window.addEventListener('offline', updateOnlineStatus);
        }
    });

    function nextSlide() {
        if (currentIndex != 2) {
            currentIndex = (currentIndex + 1) % items.length;
        }
    }

    function prevSlide() {
        if (currentIndex != 0) {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
        }
    }

    function handleTouchStart(event: any) {
        startX = event.touches[0].clientX;
    }

    function handleTouchEnd(event: any) {
        const endX = event.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        }
    }
    function updateOnlineStatus() {
        if (typeof navigator !== 'undefined') {
            isOnline = navigator.onLine;
        }
    }
    function preventDefault(event: any) {
        event.preventDefault();
    }

    onMount(() => {
        document.addEventListener("touchmove", preventDefault, {
            passive: false,
        });
        document.addEventListener("submit", preventDefault);
        document.addEventListener("click", (event) => {
            if (event.target.tagName === "A") {
                event.preventDefault();
            }
        });

        return () => {
            document.removeEventListener("touchmove", preventDefault);
            document.removeEventListener("submit", preventDefault);
            document.removeEventListener("click", preventDefault);
        };
    });

    let dispatch = createEventDispatcher();
</script>

<div
    class="carousel-container"
    on:touchstart={handleTouchStart}
    on:touchend={handleTouchEnd}
>
    <div class="carousel" style="transform: translateX(-{currentIndex * 100}%)">
        <div class="carousel-item"><Auto /></div>
        <div class="carousel-item"><Tele /></div>
        <div class="carousel-item"><Endgame /></div>
    </div>
</div>

<style>
    .carousel-container {
        width: 100%;
        overflow: hidden;
        position: relative;
        height: 100%;
    }

    .carousel {
        display: flex;
        transition: transform 0.2s ease-in-out;
    }

    .carousel-item {
        min-width: 100%;
        box-sizing: border-box;
    }

    div {
        margin: 0rem;
        padding: 0;
        background-color: transparent;
    }
</style>
