
// DU EEE OBE System
// Main application JavaScript

document.addEventListener("DOMContentLoaded", function () {

    // ----------------------------------------
    // 1. Page navigation
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
    // 2. Course form and table elements
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

    const storageKey = "du-eee-obe-courses";
    const migrationKey = "du-eee-obe-prototype-migrated";

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
    // 3. Course storage
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
    // 4. Dashboard updates
    // ----------------------------------------

    function updateDashboard() {

        const courseCount = document.getElementById("course-count");

        if (courseCount) {

            courseCount.textContent = storageAvailable
                ? courses.length
                : "—";

        }

        const prototypeCard = document.querySelector(".prototype-card");

        if (!prototypeCard) {
            return;
        }

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
    // 5. Course form helpers
    // ----------------------------------------

    function resetForm() {

        courseCode.value = "";
        courseTitle.value = "";
        courseCredits.value = "";
        contactHours.value = "";
renderCourseProgramOptions();
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
    // 6. Display courses
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

        updateDashboard();

    }


    // ----------------------------------------
    // 7. Edit a course
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

      renderCourseProgramOptions(course.program);
        courseType.value = course.type;

        editingIndex = index;

        if (formHeading) {
            formHeading.textContent = "Edit Course";
        }

        saveCourseButton.textContent = "Update Course";

        openForm();

    }


    // ----------------------------------------
    // 8. Delete a course
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
    // 9. Program Management
    // ----------------------------------------

    const programTableBody = document.getElementById("program-table-body");

    const addProgramBtn = document.getElementById("add-program-btn");

    const programFormContainer = document.getElementById(
        "program-form-container"
    );

    const programForm = document.getElementById("program-form");

    const cancelProgramBtn = document.getElementById("cancel-program-btn");

    const programCodeInput = document.getElementById("program-code");
    const programNameInput = document.getElementById("program-name");

    const programDepartmentInput = document.getElementById(
        "program-department"
    );

    const programUniversityInput = document.getElementById(
        "program-university"
    );

    const programStatusInput = document.getElementById("program-status");


    const programStorageKey = "du-eee-obe-programs";

    let programs = [];

    let programStorageAvailable = true;


    // ----------------------------------------
    // 9.1 Load saved programs
    // ----------------------------------------

    const defaultProgram = {
        code: "BSC-EEE",
        name: "B.Sc. in EEE",
        department: "Electrical and Electronic Engineering",
        university: "University of Dhaka",
        status: "Active"
    };


    try {

        const savedPrograms = localStorage.getItem(programStorageKey);

        if (savedPrograms === null) {

            programs = [defaultProgram];

            localStorage.setItem(
                programStorageKey,
                JSON.stringify(programs)
            );

        } else {

            programs = JSON.parse(savedPrograms);

            if (!Array.isArray(programs)) {
                throw new Error("Saved program data is not a list.");
            }

        }

    } catch (error) {

        programStorageAvailable = false;

        console.error("Could not load programs:", error);

        alert(
            "Program data could not be loaded. " +
            "Program changes are disabled to protect existing data."
        );

    }


    // ----------------------------------------
    // 9.2 Save programs
    // ----------------------------------------

    function savePrograms() {

        if (!programStorageAvailable) {
            return false;
        }

        try {

            localStorage.setItem(
                programStorageKey,
                JSON.stringify(programs)
            );

            return true;

        } catch (error) {

            console.error("Could not save programs:", error);

            alert("The program could not be saved in this browser.");

            return false;

        }

    }


    // ----------------------------------------
    // 9.3 Display programs
    // ----------------------------------------

    function renderPrograms() {

        if (!programTableBody) {
            return;
        }

        programTableBody.textContent = "";

        programs.forEach(function (program, index) {

            const row = document.createElement("tr");

            const values = [
                program.code,
                program.name,
                program.department,
                program.university,
                program.status
            ];

            values.forEach(function (value) {

                const cell = document.createElement("td");

                cell.textContent = value;

                row.appendChild(cell);

            });


            const actionsCell = document.createElement("td");

            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-program-btn";

            deleteButton.dataset.index = index;

            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);

            programTableBody.appendChild(row);

        });

    }


    // Update Course Master program dropdown
    function renderCourseProgramOptions(selectedProgram = "") {

        courseProgram.innerHTML = "";

        const activePrograms = programs.filter(function (program) {
            return program.status === "Active";
        });

        activePrograms.forEach(function (program) {

            const option = document.createElement("option");

            option.value = program.name;
            option.textContent = program.name;

            courseProgram.appendChild(option);

        });

        // Preserve an existing course's program when editing,
        // even if that program is now inactive or deleted.
        if (
            selectedProgram &&
            !activePrograms.some(function (program) {
                return program.name === selectedProgram;
            })
        ) {

            const oldOption = document.createElement("option");

            oldOption.value = selectedProgram;
            oldOption.textContent = selectedProgram +
                " (Inactive or deleted)";

            courseProgram.appendChild(oldOption);

        }

        if (selectedProgram) {
            courseProgram.value = selectedProgram;
        }

    }

    // ----------------------------------------
    // 9.4 Open the program form
    // ----------------------------------------

    if (
        programTableBody &&
        addProgramBtn &&
        programFormContainer &&
        programForm &&
        cancelProgramBtn &&
        programCodeInput &&
        programNameInput &&
        programDepartmentInput &&
        programUniversityInput &&
        programStatusInput
    ) {

        addProgramBtn.addEventListener("click", function () {

            if (!programStorageAvailable) {
                alert("Program storage is unavailable.");
                return;
            }

            programForm.reset();

            programDepartmentInput.value =
                "Electrical and Electronic Engineering";

            programUniversityInput.value =
                "University of Dhaka";

            programFormContainer.style.display = "block";

            programFormContainer.scrollIntoView({
                behavior: "smooth"
            });

        });


        // ----------------------------------------
        // 9.5 Cancel program form
        // ----------------------------------------

        cancelProgramBtn.addEventListener("click", function () {

            programForm.reset();

            programFormContainer.style.display = "none";

        });


        // ----------------------------------------
        // 9.6 Save a new program
        // ----------------------------------------

        programForm.addEventListener("submit", function (event) {

            event.preventDefault();

            if (!programStorageAvailable) {
                alert("Program storage is unavailable.");
                return;
            }

            const newProgram = {

                code: programCodeInput.value.trim().toUpperCase(),

                name: programNameInput.value.trim(),

                department: programDepartmentInput.value.trim(),

                university: programUniversityInput.value.trim(),

                status: programStatusInput.value

            };


            if (
                !newProgram.code ||
                !newProgram.name ||
                !newProgram.department ||
                !newProgram.university
            ) {

                alert("Please complete all program fields.");

                return;

            }


            const duplicate = programs.some(function (program) {

                return String(program.code).trim().toUpperCase() ===
                    newProgram.code;

            });


            if (duplicate) {

                alert("A program with this code already exists.");

                programCodeInput.focus();

                return;

            }


            programs.push(newProgram);

            if (savePrograms()) {

                renderPrograms();
        renderCourseProgramOptions();
                programForm.reset();

                programFormContainer.style.display = "none";

                alert("Program saved successfully.");

            } else {

                programs.pop();

            }

        });


        // ----------------------------------------
        // 9.7 Delete a program
        // ----------------------------------------

        programTableBody.addEventListener("click", function (event) {

            if (!event.target.classList.contains("delete-program-btn")) {
                return;
            }

            if (!programStorageAvailable) {
                alert("Program storage is unavailable.");
                return;
            }

            const index = Number(event.target.dataset.index);

            if (!Number.isInteger(index) || index < 0 ||
                index >= programs.length) {
                return;
            }

            const program = programs[index];

            const confirmed = confirm(
                "Are you sure you want to delete " +
                program.code + " — " + program.name + "?"
            );

            if (!confirmed) {
                return;
            }

            const deletedProgram = programs.splice(index, 1)[0];

            if (savePrograms()) {

                renderPrograms();
                renderCourseProgramOptions();

            } else {

                programs.splice(index, 0, deletedProgram);

            }

        });


        // Display saved programs when the application opens.
        renderPrograms();

    } else {

        console.warn(
            "Program Management could not start: an HTML element is missing."
        );

    }


    // ----------------------------------------
    // 10. Add or update a course
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
    // 11. Export and import courses
    // ----------------------------------------

    const exportCoursesButton = document.getElementById(
        "export-courses-btn"
    );

    const importCoursesButton = document.getElementById(
        "import-courses-btn"
    );

    const importCoursesFile = document.getElementById(
        "import-courses-file"
    );


    function cleanText(value) {

        return value === null || value === undefined
            ? ""
            : String(value).trim();

    }


    function validateImportedCourses(data) {

        const list = Array.isArray(data)
            ? data
            : data && data.courses;

        if (!Array.isArray(list)) {
            throw new Error("The file does not contain a course list.");
        }

        if (list.length === 0) {
            throw new Error("The file contains no courses.");
        }


        const allowedPrograms = Array.from(courseProgram.options).map(
            function (option) {
                return option.value;
            }
        );


        const allowedTypes = Array.from(courseType.options).map(
            function (option) {
                return option.value;
            }
        );


        const seenCodes = new Set();


        return list.map(function (item, i) {

            const label = "Course " + (i + 1);

            if (!item || typeof item !== "object") {
                throw new Error(label + " is not valid.");
            }


            const course = {

                code: cleanText(item.code),
                title: cleanText(item.title),
                credits: cleanText(item.credits),
                hours: cleanText(item.hours),
                program: cleanText(item.program),
                type: cleanText(item.type)

            };


            if (
                !course.code || !course.title || !course.credits ||
                !course.hours || !course.program || !course.type
            ) {

                throw new Error(label + " has a missing field.");

            }


            if (
                !Number.isFinite(Number(course.credits)) ||
                Number(course.credits) <= 0 ||
                !Number.isFinite(Number(course.hours)) ||
                Number(course.hours) <= 0
            ) {

                throw new Error(
                    label + " (" + course.code +
                    ") has invalid credits or contact hours."
                );

            }


            if (!allowedPrograms.includes(course.program)) {

                throw new Error(
                    label + " (" + course.code +
                    ") has an unknown program: " + course.program
                );

            }


            if (!allowedTypes.includes(course.type)) {

                throw new Error(
                    label + " (" + course.code +
                    ") has an unknown course type: " + course.type
                );

            }


            const codeKey = course.code.toLowerCase();

            if (seenCodes.has(codeKey)) {

                throw new Error(
                    "Duplicate course code in file: " + course.code
                );

            }

            seenCodes.add(codeKey);

            return course;

        });

    }


    // ----------------------------------------
    // 11.1 Export courses
    // ----------------------------------------

    if (exportCoursesButton) {

        exportCoursesButton.addEventListener("click", function () {

            if (!storageAvailable) {
                alert("Course storage is unavailable.");
                return;
            }

            if (courses.length === 0) {
                alert("There are no courses to export.");
                return;
            }


            const backup = {

                system: "DU EEE OBE System",
                dataType: "courses",
                version: 1,
                exportedAt: new Date().toISOString(),
                courses: courses

            };


            const blob = new Blob(
                [JSON.stringify(backup, null, 2)],
                { type: "application/json" }
            );


            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            const today = new Date().toISOString().slice(0, 10);

            link.href = url;

            link.download =
                "du-eee-obe-courses-" + today + ".json";


            document.body.appendChild(link);

            link.click();

            link.remove();


            setTimeout(function () {

                URL.revokeObjectURL(url);

            }, 1000);

        });

    }


    // ----------------------------------------
    // 11.2 Import courses
    // ----------------------------------------

    if (importCoursesButton && importCoursesFile) {

        importCoursesButton.addEventListener("click", function () {

            if (!storageAvailable) {
                alert("Course storage is unavailable.");
                return;
            }

            importCoursesFile.click();

        });


        importCoursesFile.addEventListener("change", function () {

            const file = importCoursesFile.files[0];

            importCoursesFile.value = "";

            if (!file) {
                return;
            }

            if (file.size > 1024 * 1024) {

                alert("The file is too large for a course backup.");

                return;

            }


            file.text().then(function (text) {

                let importedCourses;

                try {

                    importedCourses = validateImportedCourses(
                        JSON.parse(text)
                    );

                } catch (error) {

                    console.error("Import failed:", error);

                    alert(
                        "Import failed: " + error.message +
                        "\n\nYour current courses have not been changed."
                    );

                    return;

                }


                const confirmed = confirm(

                    "Replace your current " + courses.length +
                    " course(s) with " + importedCourses.length +
                    " course(s) from \"" + file.name + "\"?" +

                    "\n\nTip: Export your current courses first " +
                    "if you may need them."

                );


                if (!confirmed) {
                    return;
                }


                if (saveCourses(importedCourses)) {

                    resetForm();

                    addCourseForm.classList.remove("active");

                    renderCourses();

                    alert(
                        importedCourses.length +
                        " course(s) imported successfully."
                    );

                }

            }).catch(function (error) {

                console.error("Could not read file:", error);

                alert("The file could not be read.");

            });

        });

    }


    // ----------------------------------------
    // 12. Initial display
    // ----------------------------------------

    renderCourses();
renderCourseProgramOptions();
    console.log("DU EEE OBE System loaded successfully.");

});
