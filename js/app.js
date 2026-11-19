
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
    // Save Course
    const saveCourseButton = document.getElementById("save-course-btn");
    const courseTableBody = document.getElementById("course-table-body");

    const courseCode = document.getElementById("course-code");
    const courseTitle = document.getElementById("course-title");
    const courseCredits = document.getElementById("course-credits");
    const contactHours = document.getElementById("contact-hours");
    const courseProgram = document.getElementById("course-program");
    const courseType = document.getElementById("course-type");

    const storageKey = "du-eee-obe-courses";

    function addCourseRow(course) {
        const row = document.createElement("tr");

        const values = [
            course.code,
            course.title,
            course.credits,
            course.hours + " hours/week",
            course.program,
            course.type,
            "Active"
        ];

        values.forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        courseTableBody.appendChild(row);
    }

    if (
        saveCourseButton && courseTableBody && addCourseForm &&
        courseCode && courseTitle && courseCredits && contactHours &&
        courseProgram && courseType
    ) {
        let courses = [];
        let storageAvailable = true;

        try {
            const savedData = localStorage.getItem(storageKey);

            if (savedData) {
                courses = JSON.parse(savedData);

                if (!Array.isArray(courses)) {
                    throw new Error("Saved course data is not a list.");
                }

                courses.forEach(addCourseRow);
            }
        } catch (error) {
            storageAvailable = false;
            console.error("Could not load saved courses:", error);
            alert("Saved courses could not be loaded. Saving is disabled.");
        }

        saveCourseButton.addEventListener("click", function () {
            if (!storageAvailable) {
                alert("Courses cannot be saved until the storage problem is resolved.");
                return;
            }

            const code = courseCode.value.trim();
            const title = courseTitle.value.trim();
            const credits = courseCredits.value.trim();
            const hours = contactHours.value.trim();
            const program = courseProgram.value;
            const type = courseType.value;

            if (!code || !title || !credits || !hours || !program || !type) {
                alert("Please complete all course fields.");
                return;
            }

            if (
                !Number.isFinite(Number(credits)) || Number(credits) <= 0 ||
                !Number.isFinite(Number(hours)) || Number(hours) <= 0
            ) {
                alert("Credits and contact hours must be positive numbers.");
                return;
            }

            const existingRows = courseTableBody.querySelectorAll("tr");
            const duplicate = Array.from(existingRows).some(function (row) {
                const firstCell = row.cells[0];

                return firstCell &&
                    firstCell.textContent.trim().toLowerCase() === code.toLowerCase();
            });

            if (duplicate) {
                alert("A course with this course code already exists.");
                courseCode.focus();
                return;
            }

            const newCourse = {
                code: code,
                title: title,
                credits: credits,
                hours: hours,
                program: program,
                type: type
            };

            const updatedCourses = courses.concat(newCourse);

            try {
                localStorage.setItem(storageKey, JSON.stringify(updatedCourses));
            } catch (error) {
                console.error("Could not save course:", error);
                alert("The course could not be saved in this browser.");
                return;
            }

            courses = updatedCourses;
            addCourseRow(newCourse);

            courseCode.value = "";
            courseTitle.value = "";
            courseCredits.value = "";
            contactHours.value = "";
            courseProgram.selectedIndex = 0;
            courseType.selectedIndex = 0;

            addCourseForm.classList.remove("active");
        });
    } else {
        console.error("Save Course could not start: a required HTML element is missing.");
    }


    console.log("DU EEE OBE System loaded successfully.");

});
