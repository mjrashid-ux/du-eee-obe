// DU EEE OBE System
// Main application JavaScript

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".nav-link");

    const pages = {
        "dashboard": "dashboard-page",
        "obe-setup": "obe-setup-page",
        "courses": "courses-page",
        "assessment": "assessment-page",
        "obe-analysis": "obe-analysis-page",
        "reports": "reports-page"
    };


    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const pageName = this.dataset.page;

            // Hide all pages
            Object.values(pages).forEach(function (pageId) {

                const page = document.getElementById(pageId);

                if (page) {
                    page.classList.remove("active");
                }

            });


            // Show selected page
            const selectedPage = document.getElementById(pages[pageName]);

            if (selectedPage) {
                selectedPage.classList.add("active");
            }


            // Update active menu item
            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");

        });

    });


    console.log("DU EEE OBE System loaded successfully.");

});
