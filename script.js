/* =============================================================================
   Enterprise Linux Health Dashboard - Product Website Interactive Script
   Author: Prathap S (prathaps8675@gmail.com)
   ============================================================================= */

// Supademo Interactive Product Demo Configuration
const SUPERDEMO_EMBED_URL = "https://app.supademo.com/embed/cmt9seajv0pwsqmeblrkxbgje?embed_v=2";
const SUPERDEMO_SHARE_URL = "https://app.supademo.com/demo/cmt9seajv0pwsqmeblrkxbgje";

// Mobile Navigation Toggle
function toggleMobileNav() {
    const navLinks = document.querySelector(".nav-links");
    if (navLinks) {
        navLinks.classList.toggle("mobile-open");
    }
}

// Interactive Superdemo Launcher with Safe Loading & Fallback
function launchSuperdemo(event) {
    if (event) event.preventDefault();

    const launcher = document.getElementById("demo-launcher");
    const player = document.getElementById("demo-player");
    const iframe = document.getElementById("superdemo-iframe");
    const loader = document.getElementById("demo-loader");
    const demoSection = document.getElementById("demo");

    if (launcher && player) {
        launcher.style.display = "none";
        player.style.display = "block";
    }

    if (iframe) {
        // Load iframe src only on demand to prevent slow initial page load and blank screens
        if (!iframe.src || iframe.src === "about:blank") {
            if (loader) loader.style.display = "flex";
            iframe.src = SUPERDEMO_EMBED_URL;

            iframe.onload = function () {
                if (loader) {
                    loader.style.opacity = "0";
                    setTimeout(() => { loader.style.display = "none"; }, 400);
                }
            };

            // Fallback timeout in case adblocker / network blocks iframe
            setTimeout(() => {
                if (loader && loader.style.display !== "none") {
                    loader.style.opacity = "0";
                    setTimeout(() => { loader.style.display = "none"; }, 400);
                }
            }, 6000);
        }
    }

    if (demoSection) {
        const yOffset = -90;
        const y = demoSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
    }
}

function closeSuperdemo(event) {
    if (event) event.preventDefault();
    const launcher = document.getElementById("demo-launcher");
    const player = document.getElementById("demo-player");
    if (launcher && player) {
        player.style.display = "none";
        launcher.style.display = "block";
    }
}

function reloadSuperdemo(event) {
    if (event) event.preventDefault();
    const iframe = document.getElementById("superdemo-iframe");
    const loader = document.getElementById("demo-loader");
    if (iframe) {
        if (loader) {
            loader.style.display = "flex";
            loader.style.opacity = "1";
        }
        iframe.src = SUPERDEMO_EMBED_URL + "&r=" + Date.now();
    }
}

// =============================================================================
// Corporate License Request Engine (Direct Email & Template Helper)
// =============================================================================

function getTierDetails(tier) {
    switch (tier) {
        case "pro": return { name: "Professional / MSP (50 Servers)", price: "$49 / Year" };
        case "enterprise": return { name: "Enterprise Edition (250 Servers)", price: "$149 / Year" };
        case "custom": return { name: "Custom / Government Cluster (500+ Servers)", price: "Custom Quote" };
        default: return { name: "Enterprise Edition (250 Servers)", price: "$149 / Year" };
    }
}

function getEmailData(tier = "enterprise") {
    const tierInfo = getTierDetails(tier);
    const subject = `Commercial License Request — ${tierInfo.name}`;
    const body = `Hello InfraSightOps Enterprise Licensing Team,

I would like to request a signed commercial license key for our organization:

1. Client / Organization Name : [Your Organization / Company Name]
2. Project / Environment Scope : [e.g. Payment Gateway / Production / All Projects]
3. License Plan & Node Limit  : ${tierInfo.name} (${tierInfo.price})
4. Master Hardware Machine ID  : [Run 'cat /etc/machine-id' on master server or leave blank for ANY]
5. PO / Reference Number (Opt) : [e.g. PO-2026-001]
6. Billing Address / Tax ID    : [Optional]

Please issue the signed cryptographic license key file (license.key) along with payment / wire invoice details.

Thank you!`;

    return { subject, body };
}

function sendLicenseRequest(tier) {
    sendViaGmail(tier);
}

function sendViaGmail(tier = "enterprise") {
    const { subject, body } = getEmailData(tier);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=prathaps8675@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
}

function sendViaOutlook(tier = "enterprise") {
    const { subject, body } = getEmailData(tier);
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=prathaps8675@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(outlookUrl, "_blank", "noopener,noreferrer");
}

function sendViaDefaultMail(tier = "enterprise") {
    const { subject, body } = getEmailData(tier);
    window.location.href = `mailto:prathaps8675@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function copyLicenseTemplate(tier = "enterprise") {
    const { body } = getEmailData(tier);
    navigator.clipboard.writeText(body).then(() => {
        alert("✅ License request template copied to clipboard!");
    }).catch(() => {
        prompt("Copy request manually:", body);
    });
}

// =============================================================================
// DOM Initialization & Event Listeners
// =============================================================================

document.addEventListener("DOMContentLoaded", function () {
    if (window.lucide) {
        lucide.createIcons();
    }

    // Attach Superdemo handlers to all trigger buttons
    const demoTriggers = document.querySelectorAll(".superdemo-trigger");
    demoTriggers.forEach((btn) => {
        btn.addEventListener("click", launchSuperdemo);
    });

    // Close mobile nav when clicking any nav link & handle navbar scroll offset
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const menu = document.querySelector(".nav-links");
            if (menu) menu.classList.remove("mobile-open");

            const targetId = link.getAttribute("href");
            if (targetId && targetId.startsWith("#") && targetId !== "#") {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const yOffset = -90;
                    const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: "smooth" });
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        location.hash = targetId;
                    }
                }
            }
        });
    });

    // Close modal on background click
    const modal = document.getElementById("license-modal");
    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) closeLicenseModal();
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        if (question) {
            question.addEventListener("click", () => {
                const isActive = item.classList.contains("active");
                faqItems.forEach((i) => i.classList.remove("active"));
                if (!isActive) {
                    item.classList.add("active");
                }
            });
        }
    });

    // Installation Tabs
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-tab");

            tabBtns.forEach((b) => b.classList.remove("active"));
            tabContents.forEach((c) => (c.style.display = "none"));

            btn.classList.add("active");
            const activeContent = document.getElementById(targetId);
            if (activeContent) {
                activeContent.style.display = "block";
            }
        });
    });

    // Code Copy Buttons
    const copyBtns = document.querySelectorAll(".copy-btn");
    copyBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const codeBlock = btn.parentElement.querySelector("code");
            if (codeBlock) {
                const textToCopy = codeBlock.innerText.trim();
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = btn.innerText;
                    btn.innerText = "✓ Copied!";
                    btn.style.background = "#10B981";
                    btn.style.color = "#ffffff";
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = "";
                        btn.style.color = "";
                    }, 2000);
                });
            }
        });
    });
});
