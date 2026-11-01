document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    // Must match the collapsed-navigation breakpoint in css/style.css
    const mobileNav = window.matchMedia('(max-width: 1180px)');

    const closeDropdowns = () => {
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove('active');
            const trigger = dropdown.querySelector(':scope > a');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    };

    const setMenu = (open) => {
        if (!hamburger || !navLinks) return;
        hamburger.classList.toggle('active', open);
        navLinks.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        if (!open) closeDropdowns();
    };

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            setMenu(!navLinks.classList.contains('active'));
        });

        // Close when clicking outside the menu
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                setMenu(false);
            }
        });

        // Close after choosing a destination (covers same-page anchors like #about)
        navLinks.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            const isDropdownTrigger = link.parentElement.classList.contains('nav-dropdown');
            if (isDropdownTrigger && mobileNav.matches) return;
            setMenu(false);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                setMenu(false);
                hamburger.focus();
            }
        });
    }

    // "For Authors" submenu: tap to expand on collapsed navigation
    dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector(':scope > a');
        if (!trigger) return;
        trigger.addEventListener('click', (e) => {
            if (!mobileNav.matches) return;
            e.preventDefault();
            const open = dropdown.classList.toggle('active');
            trigger.setAttribute('aria-expanded', String(open));
        });
    });

    // Reset menu state when resizing back to the desktop layout
    const onBreakpointChange = (e) => {
        if (!e.matches) setMenu(false);
    };
    if (mobileNav.addEventListener) {
        mobileNav.addEventListener('change', onBreakpointChange);
    } else if (mobileNav.addListener) {
        mobileNav.addListener(onBreakpointChange);
    }

    // Subtle shadow once the page is scrolled
    if (header) {
        const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }
});
