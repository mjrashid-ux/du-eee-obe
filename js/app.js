
// DU EEE OBE System
// Main application JavaScript

document.addEventListener("DOMContentLoaded", function () {

    // Page Navigation
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

            const selectedPage = document.getElementById(pageId);

            if (!selectedPage) {
                console.log("Page not created yet:", pageName);
                return;
            }

            Object.values(pages).forEach(function (id) {

                const page = document.getElementById(id);

                if (page) {
                    page.classList.remove("active");
                }

            });

            selectedPage.classList.add("active");

            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            this.classList.add("active");

        });

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


    // Cancel: Close Form
    const cancelCourseButton = document.querySelector(".cancel-course-btn");

    if (cancelCourseButton && addCourseForm) {

        cancelCourseButton.addEventListener("click", function () {

            addCourseForm.classList.remove("active");

        });

    }


    console.log("DU EEE OBE System loaded successfully.");

});
