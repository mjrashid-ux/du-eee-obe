// DU EEE OBE System
// Main application JavaScript

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll(".nav-item");

    const pages = {
        dashboard: "dashboard-page",
        "obe-setup": "obe-setup-page",
        courses: "courses-page",
        assessment: "assessment-page",
        "obe-analysis": "obe-analysis-page",
        reports: "reports-page"
    };


    navLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            const pageName = this.dataset.page;
            const pageId = pages[pageName];

            // Check whether the requested page exists
            const selectedPage = document.getElementById(pageId);

            if (!selectedPage) {
                console.log("Page not created yet:", pageName);
                return;
            }


            // Hide all existing pages
            Object.values(pages).forEach(function (id) {

                const page = document.getElementById(id);

                if (page) {
                    page.classList.remove("active");
                }

            });


            // Show selected page
            selectedPage.classList.add("active");


            // Update active menu item
            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");

        });

    });


    console.log("DU EEE OBE System loaded successfully.");

});
// Add New Course: Open Form

const addCourseButton = document.getElementById("add-course-btn");
const addCourseForm = document.getElementById("add-course-form");

if (addCourseButton && addCourseForm) {

    addCourseButton.addEventListener("click", function () {

        addCourseForm.classList.add("active");

        addCourseForm.scrollIntoView({
            behavior: "smooth"
        });

    });

}
// Cancel: Close Add New Course Form

const cancelCourseButton = document.querySelector(".cancel-course-btn");

if (cancelCourseButton && addCourseForm) {

    cancelCourseButton.addEventListener("click", function () {

        addCourseForm.classList.remove("active");

    });

}
