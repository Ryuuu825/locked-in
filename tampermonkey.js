// ==UserScript==
// @name         Block Instagram Reels & YouTube Shorts
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Block Instagram Reels and YouTube Shorts with confirmation page
// @author       You
// @match        https://www.instagram.com/*
// @match        https://instagram.com/*
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACw=
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
            } else if (
                window.location.hostname === "www.instagram.com" ||
                window.location.hostname === "instagram.com"
            ) {
                // block all a hrefs containing /reels
                document.addEventListener(
                    "click",
                    (e) => {
                        const target = e.target.closest("a");
                        if (target && target.href.includes("/reels/")) {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Reels navigation blocked");
                        }
                    },
                    true,
                );
            } else if (
                window.location.hostname === "www.youtube.com" ||
                window.location.hostname === "youtube.com"
            ) {
                // remove the a tags containing /shorts in the href
                let removeReelsDiv = () => {
                    let links = document.getElementsByTagName("a");
                    for (let i = links.length - 1; i >= 0; i--) {
                        if (links[i].href.includes("/shorts/")) {
                            links[i].parentElement.removeChild(links[i]);
                        }
                    }
                };

                // see if there any more shorts, if not, stop the interval
                let checkForMoreShorts = () => {
                    let links = document.getElementsByTagName("a");
                    for (let i = 0; i < links.length; i++) {
                        if (links[i].href.includes("/shorts/")) {
                            return true;
                        }
                    }
                    return false;
                };

                setInterval(() => {
                    if (!checkForMoreShorts()) {
                        clearInterval();
                    } else {
                        removeReelsDiv();
                    }
                }, 1000);
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

    console.log("✅ Reels & Shorts Blocker loaded");
})();
