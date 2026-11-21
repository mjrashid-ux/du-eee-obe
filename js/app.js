// DU EEE OBE System
// Main application JavaScript

document.addEventListener("DOMContentLoaded", function () {

    // ----------------------------------------
    // Page navigation
    // ----------------------------------------

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

            if (!pageId) {
                console.log("Page not configured:", pageName);
                return;
            }

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


    // ----------------------------------------
    // Course form and table elements
    // ----------------------------------------

    const addCourseButton = document.getElementById("add-course-btn");
    const addCourseForm = document.getElementById("add-course-form");
    const cancelCourseButton = document.querySelector(".cancel-course-btn");
    const saveCourseButton = document.getElementById("save-course-btn");
    const courseTableBody = document.getElementById("course-table-body");

    const courseCode = document.getElementById("course-code");
    const courseTitle = document.getElementById("course-title");
    const courseCredits = document.getElementById("course-credits");
    const contactHours = document.getElementById("contact-hours");
    const courseProgram = document.getElementById("course-program");
    const courseType = document.getElementById("course-type");

    if (
        !addCourseButton || !addCourseForm || !cancelCourseButton ||
        !saveCourseButton || !courseTableBody || !courseCode ||
        !courseTitle || !courseCredits || !contactHours ||
        !courseProgram || !courseType
    ) {
        console.error(
            "Course management could not start: an HTML element is missing."
        );
        return;
    }

    const formHeading = addCourseForm.querySelector("h3");

    // Keep these keys unchanged to preserve existing saved courses.
    const storageKey = "du-eee-obe-courses";
    const migrationKey = "du-eee-obe-prototype-migrated";

    // These are initial values only.
    // They do not overwrite an existing saved prototype course.
    const prototypeCourse = {
        code: "0533-PHY-1103",
        title: "Electricity and Magnetism",
        credits: "1.5",
        hours: "3",
        program: "B.Sc. in EEE",
        type: "Core"
    };

    let courses = [];
    let editingIndex = null;
    let storageAvailable = true;


    // ----------------------------------------
    // Storage
    // ----------------------------------------

    function readCourses() {
        const savedData = localStorage.getItem(storageKey);

        if (savedData === null) {
            return [];
        }

        const parsed = JSON.parse(savedData);

        if (!Array.isArray(parsed)) {
            throw new Error("Saved course data is not a list.");
        }

        return parsed;
    }

    function saveCourses(updatedCourses) {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(updatedCourses)
            );

            courses = updatedCourses;
            return true;
        } catch (error) {
            console.error("Could not save courses:", error);
            alert("The change could not be saved in this browser.");
            return false;
        }
    }

    try {
        courses = readCourses();

        // Add the prototype once without replacing existing saved data.
        if (localStorage.getItem(migrationKey) !== "done") {
            const prototypeExists = courses.some(function (course) {
                return String(course.code).trim().toLowerCase() ===
                    prototypeCourse.code.toLowerCase();
            });

            if (!prototypeExists) {
                const migratedCourses = [prototypeCourse].concat(courses);

                localStorage.setItem(
                    storageKey,
                    JSON.stringify(migratedCourses)
                );

                courses = migratedCourses;
            }

            localStorage.setItem(migrationKey, "done");
        }
    } catch (error) {
        storageAvailable = false;

        console.error("Could not load or migrate courses:", error);

        alert(
            "Courses could not be loaded. Changes are disabled " +
            "to avoid overwriting existing data."
        );
    }


    // ----------------------------------------
    // Dashboard updates
    // ----------------------------------------

    function updateDashboard() {
        // Update the course count.
        const courseCount = document.getElementById("course-count");

        if (courseCount) {
            courseCount.textContent = storageAvailable
                ? courses.length
                : "—";
        }

        // Update the prototype card.
        const prototypeCard = document.querySelector(".prototype-card");

        if (!prototypeCard) {
            return;
        }

        // Supports both the original and the updated card markup.
        const prototypeInfo = prototypeCard.querySelector(".course-info");

        if (!prototypeInfo) {
            return;
        }

        let prototypeMessage = prototypeCard.querySelector(
            "#prototype-message"
        );

        if (!prototypeMessage) {
            prototypeMessage = document.createElement("p");
            prototypeMessage.id = "prototype-message";
            prototypeCard.appendChild(prototypeMessage);
        }

        const prototype = courses.find(function (course) {
            return String(course.code).trim().toLowerCase() ===
                prototypeCourse.code.toLowerCase();
        });

        if (!storageAvailable || !prototype) {
            // Inline display avoids conflicts with .course-info's grid CSS.
            prototypeInfo.style.display = "none";
            prototypeMessage.hidden = false;

            prototypeMessage.textContent = storageAvailable
                ? "Course not found."
                : "Course data could not be loaded.";

            return;
        }

        prototypeInfo.hidden = false;
        prototypeInfo.style.display = "";

        prototypeMessage.hidden = true;
        prototypeMessage.textContent = "";

        const originalFields = prototypeInfo.querySelectorAll("strong");

        const fields = [
            {
                id: "prototype-code",
                value: prototype.code
            },
            {
                id: "prototype-title",
                value: prototype.title
            },
            {
                id: "prototype-credits",
                value: prototype.credits
            },
            {
                id: "prototype-hours",
                value: prototype.hours + " hours/week"
            }
        ];

        fields.forEach(function (field, index) {
            const element =
                prototypeInfo.querySelector("#" + field.id) ||
                originalFields[index];

            if (element) {
                element.textContent = field.value;
            }
        });
    }


    // ----------------------------------------
    // Form helpers
    // ----------------------------------------

    function resetForm() {
        courseCode.value = "";
        courseTitle.value = "";
        courseCredits.value = "";
        contactHours.value = "";

        courseProgram.selectedIndex = 0;
        courseType.selectedIndex = 0;

        editingIndex = null;

        if (formHeading) {
            formHeading.textContent = "Add New Course";
        }

        saveCourseButton.textContent = "Save Course";
    }

    function openForm() {
        addCourseForm.classList.add("active");

        addCourseForm.scrollIntoView({
            behavior: "smooth"
        });
    }

    addCourseButton.addEventListener("click", function () {
        if (!storageAvailable) {
            alert("Course storage is unavailable.");
            return;
        }

        resetForm();
        openForm();
    });

    cancelCourseButton.addEventListener("click", function () {
        resetForm();
        addCourseForm.classList.remove("active");
    });


    // ----------------------------------------
    // Display courses
    // ----------------------------------------

    function renderCourses() {
        courseTableBody.textContent = "";

        courses.forEach(function (course, index) {
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

            const actionsCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit";
            editButton.className = "edit-course-btn";

            editButton.addEventListener("click", function () {
                editCourse(index);
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-course-btn";

            deleteButton.addEventListener("click", function () {
                deleteCourse(index);
            });

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(document.createTextNode(" "));
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);
            courseTableBody.appendChild(row);
        });

        // Refresh the dashboard every time the course table changes.
        updateDashboard();
    }


    // ----------------------------------------
    // Edit a course
    // ----------------------------------------

    function editCourse(index) {
        if (!storageAvailable) {
            alert("Course storage is unavailable.");
            return;
        }

        const course = courses[index];

        courseCode.value = course.code;
        courseTitle.value = course.title;
        courseCredits.value = course.credits;
        contactHours.value = course.hours;
        courseProgram.value = course.program;
        courseType.value = course.type;

        editingIndex = index;

        if (formHeading) {
            formHeading.textContent = "Edit Course";
        }

        saveCourseButton.textContent = "Update Course";

        openForm();
    }


    // ----------------------------------------
    // Delete a course
    // ----------------------------------------

    function deleteCourse(index) {
        if (!storageAvailable) {
            alert("Course storage is unavailable.");
            return;
        }

        const course = courses[index];

        const confirmed = confirm(
            "Delete " + course.code + " — " + course.title + "?"
        );

        if (!confirmed) {
            return;
        }

        const updatedCourses = courses.filter(function (_, courseIndex) {
            return courseIndex !== index;
        });

        if (saveCourses(updatedCourses)) {
            resetForm();
            addCourseForm.classList.remove("active");
            renderCourses();
        }
    }


    // ----------------------------------------
    // Add or update a course
    // ----------------------------------------

    saveCourseButton.addEventListener("click", function () {
        if (!storageAvailable) {
            alert("Course storage is unavailable.");
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

        const duplicate = courses.some(function (course, index) {
            return index !== editingIndex &&
                String(course.code).trim().toLowerCase() ===
                code.toLowerCase();
        });

        if (duplicate) {
            alert("A course with this course code already exists.");
            courseCode.focus();
            return;
        }

        const updatedCourse = {
            code: code,
            title: title,
            credits: credits,
            hours: hours,
            program: program,
            type: type
        };

        const updatedCourses = courses.slice();

        if (editingIndex === null) {
            updatedCourses.push(updatedCourse);
        } else {
            updatedCourses[editingIndex] = updatedCourse;
        }

        if (saveCourses(updatedCourses)) {
            renderCourses();
            resetForm();
            addCourseForm.classList.remove("active");
        }
    });


    // ----------------------------------------
    // Initial display
    // ----------------------------------------

    renderCourses();

    console.log("DU EEE OBE System loaded successfully.");
});
