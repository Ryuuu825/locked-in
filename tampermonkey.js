// ==UserScript==
// @name         Block Instagram Reels & YouTube Shorts
// @namespace    http://tampermonkey.net/
// @version      21.0
// @description  Block Instagram Reels and YouTube Shorts
// @author       Ryu
// @match        https://www.instagram.com/*
// @match        https://instagram.com/*
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    "use strict";

    // ===== CONFIRMATION PAGE =====
    function hidePage() {
        try {
            document.body.style.display = "none";
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";

            // Block all audio/video
            const blockMedia = () => {
                const mediaElements = document.querySelectorAll("video, audio");
                mediaElements.forEach((el) => {
                    el.muted = true;
                    el.volume = 0;
                    el.pause();
                });
            };

            blockMedia();

            // Keep blocking media every 100ms
            setInterval(blockMedia, 100);

            // Also block via mutationObserver for dynamically loaded media
            const mediaObserver = new MutationObserver(() => {
                blockMedia();
            });

            mediaObserver.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
        } catch (e) {
            console.error("Error blocking media:", e);
        }
    }

    // ===== INITIALIZE =====
    function init() {
        try {
            if (
                // start with /shorts or /reels
                window.location.pathname.startsWith("/shorts") ||
                window.location.pathname.startsWith("/reels")
            ) {
                hidePage();
            }
        } catch (e) {
            console.error("Error initializing blocker:", e);
        }
    }

    // Run on page load
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    console.log("Reels & Shorts Blocker loaded");
})();
