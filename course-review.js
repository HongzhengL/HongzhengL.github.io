const defaultDisplayCount = 5;

function getLanguageAwareAssetPath(path) {
    if (!path) {
        return path;
    }

    const isExternal = /^(https?:)?\/\//.test(path);
    if (isExternal) {
        return path;
    }

    const isChinese = document.documentElement.lang
        ? document.documentElement.lang.toLowerCase().startsWith("zh")
        : false;
    const prefix = isChinese ? "../" : "";

    if (path.startsWith("./")) {
        return prefix + path.slice(2);
    }

    return prefix + path;
}

function decorateMarkdownContent(container) {
    if (!container) {
        return;
    }

    container.querySelectorAll("p").forEach((p) => {
        p.classList.add("text-base", "leading-relaxed", "text-slate-200");
    });

    container.querySelectorAll("em").forEach((em) => {
        em.classList.add("text-slate-100");
    });

    container.querySelectorAll("strong").forEach((strong) => {
        strong.classList.add("text-white");
    });

    container.querySelectorAll("ul").forEach((ul) => {
        ul.classList.add(
            "my-3",
            "space-y-2",
            "rounded-2xl",
            "border",
            "border-white/10",
            "bg-white/5",
            "p-4",
            "text-slate-200",
        );
    });

    container.querySelectorAll("li").forEach((li) => {
        li.classList.add("relative", "pl-5");

        if (!li.querySelector(".bullet-dot")) {
            const bullet = document.createElement("span");
            bullet.className =
                "bullet-dot absolute left-0 top-2 h-2 w-2 rounded-full bg-primary/70";
            li.prepend(bullet);
        }
    });

    container.querySelectorAll("a").forEach((anchor) => {
        anchor.classList.add(
            "font-semibold",
            "text-primary-100",
            "underline",
            "decoration-dotted",
            "underline-offset-4",
            "transition",
            "hover:text-primary-50",
        );
        const href = anchor.getAttribute("href");
        if (href && href.startsWith("./assets")) {
            anchor.setAttribute("href", getLanguageAwareAssetPath(href));
        }
    });
}

function courseToNode(course, index) {
    const courseNode = document.createElement("article");
    courseNode.className =
        "grid gap-6 rounded-3xl border border-white/8 bg-slate-900/65 p-6 shadow-2xl shadow-black/20 transition hover:border-white/20 md:grid-cols-[minmax(0,1fr)_1.4fr]";
    courseNode.id = `course-${index}`;

    const imageWrapper = document.createElement("div");
    imageWrapper.className =
        "relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50";
    imageWrapper.style.minHeight = "220px";

    const courseImage = document.createElement("img");
    courseImage.src = getLanguageAwareAssetPath(course.image);
    courseImage.className = "h-full w-full object-cover object-center";
    courseImage.loading = "lazy";
    courseImage.alt = course.course_code;
    imageWrapper.appendChild(courseImage);

    const contentNode = document.createElement("div");
    contentNode.className = "space-y-4";

    const courseTitle = document.createElement("h2");
    courseTitle.className = "text-2xl font-semibold text-white md:text-3xl";
    courseTitle.textContent = course.course_code;
    contentNode.appendChild(courseTitle);

    const badgeContainer = document.createElement("div");
    badgeContainer.className = "flex flex-wrap gap-2";

    const badges = [];
    if (course.semester) {
        badges.push(course.semester);
    }
    if (course.hours) {
        badges.push(
            typeof course.hours === "number"
                ? `Hours ~${course.hours}`
                : `Hours ${course.hours}`,
        );
    }
    if (course.instructor) {
        badges.push(`Instructor: ${course.instructor}`);
    }

    badges.forEach((badgeText) => {
        const badge = document.createElement("span");
        badge.className =
            "inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200";
        badge.textContent = badgeText;
        badgeContainer.appendChild(badge);
    });

    contentNode.appendChild(badgeContainer);

    if (Array.isArray(course.review)) {
        course.review.forEach((reviewText) => {
            const reviewElem = document.createElement("div");
            reviewElem.className = "space-y-3 text-base text-slate-200";
            reviewElem.innerHTML = window.marked
                ? window.marked.parse(reviewText)
                : reviewText;
            decorateMarkdownContent(reviewElem);
            contentNode.appendChild(reviewElem);
        });
    }

    courseNode.appendChild(imageWrapper);
    courseNode.appendChild(contentNode);

    return courseNode;
}

function createPaginationButton(pageNumber, currentPage) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = pageNumber;
    const isActive = pageNumber === currentPage;

    button.className = [
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        isActive
            ? "border border-primary/60 bg-primary/20 text-white"
            : "border border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10",
    ].join(" ");

    return button;
}

function createCourseTable(courses) {
    const langAttr = (document.documentElement.lang || "").toLowerCase();
    const isChinese = langAttr.startsWith("zh");

    const tableSection = document.createElement("div");
    tableSection.className =
        "rounded-3xl border border-white/10 bg-slate-900/65 p-6 shadow-2xl shadow-black/20";

    const selectorWrapper = document.createElement("div");
    selectorWrapper.className =
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between";

    const selectorLabel = document.createElement("label");
    selectorLabel.className = "text-sm font-medium text-slate-300";
    selectorLabel.textContent = isChinese ? "每页显示：" : "Show entries:";

    const selector = document.createElement("select");
    selector.className =
        "w-full max-w-[8rem] rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-sm font-medium text-white transition focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60";

    [5, 10, 15, 20, "All"].forEach((value) => {
        const option = document.createElement("option");
        option.value = value === "All" ? courses.length : value;
        option.textContent = value;
        if (value === defaultDisplayCount) {
            option.selected = true;
        }
        selector.appendChild(option);
    });

    selectorWrapper.appendChild(selectorLabel);
    selectorWrapper.appendChild(selector);
    tableSection.appendChild(selectorWrapper);

    const tableOuter = document.createElement("div");
    tableOuter.className = "mt-4 overflow-hidden rounded-2xl border border-white/5";
    const table = document.createElement("table");
    table.className =
        "w-full border-separate border-spacing-y-2 text-left text-sm text-slate-200";

    const thead = document.createElement("thead");
    thead.className = "bg-white/5 text-xs uppercase tracking-widest text-slate-400";
    const headerRow = document.createElement("tr");

    ["Course", "Semester"].forEach((headerText) => {
        const th = document.createElement("th");
        th.scope = "col";
        th.className = "px-4 py-3 font-semibold";
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.className = "divide-y divide-white/5";
    table.appendChild(tbody);
    tableOuter.appendChild(table);
    tableSection.appendChild(tableOuter);

    const paginationContainer = document.createElement("div");
    paginationContainer.className =
        "mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between";

    const pageInfo = document.createElement("div");
    pageInfo.className = "text-sm text-slate-300";

    const pagination = document.createElement("div");
    pagination.className = "flex flex-wrap items-center gap-2";

    paginationContainer.appendChild(pageInfo);
    paginationContainer.appendChild(pagination);

    tableSection.appendChild(paginationContainer);

    let currentPage = 1;
    let currentPageSize = defaultDisplayCount;

    function highlightCourseRow(index) {
        const courseElement = document.getElementById(`course-${index}`);
        if (!courseElement) {
            return;
        }

        courseElement.classList.add(
            "ring-2",
            "ring-primary/70",
            "ring-offset-2",
            "ring-offset-slate-950",
        );

        setTimeout(() => {
            courseElement.classList.remove(
                "ring-2",
                "ring-primary/70",
                "ring-offset-2",
                "ring-offset-slate-950",
            );
        }, 1800);
    }

    function updateTable(entriesPerPage, requestedPage = 1) {
        currentPageSize = entriesPerPage;
        currentPage = requestedPage;

        tbody.innerHTML = "";

        const totalCourses = courses.length;
        const totalPages =
            entriesPerPage >= totalCourses
                ? 1
                : Math.ceil(totalCourses / entriesPerPage);
        const safePage = Math.min(Math.max(requestedPage, 1), totalPages);

        const start = entriesPerPage >= totalCourses ? 0 : (safePage - 1) * entriesPerPage;
        const end =
            entriesPerPage >= totalCourses
                ? totalCourses
                : Math.min(start + entriesPerPage, totalCourses);

        pageInfo.textContent =
            entriesPerPage >= totalCourses
                ? isChinese
                    ? `显示全部 ${totalCourses} 条记录`
                    : `Showing all ${totalCourses} entries`
                : isChinese
                    ? `当前显示第 ${start + 1} 至 ${end} 条，共 ${totalCourses} 条`
                    : `Showing ${start + 1} to ${end} of ${totalCourses} entries`;

        for (let i = start; i < end; i += 1) {
            const course = courses[i];
            const row = document.createElement("tr");
            row.className =
                "group cursor-pointer rounded-2xl transition hover:bg-white/8";

            row.addEventListener("click", () => {
                document.getElementById(`course-${i}`).scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
                highlightCourseRow(i);
            });

            const codeCell = document.createElement("td");
            codeCell.className = "px-4 py-3 text-base font-semibold text-white";
            codeCell.textContent = course.course_code;
            row.appendChild(codeCell);

            const semesterCell = document.createElement("td");
            semesterCell.className = "px-4 py-3 text-sm text-slate-300";
            semesterCell.textContent = course.semester || "—";
            row.appendChild(semesterCell);

            tbody.appendChild(row);
        }

        pagination.innerHTML = "";

        if (totalPages > 1) {
            for (let page = 1; page <= totalPages; page += 1) {
                const button = createPaginationButton(page, safePage);
                button.addEventListener("click", () => {
                    updateTable(entriesPerPage, page);
                });
                pagination.appendChild(button);
            }
        }
    }

    selector.addEventListener("change", (event) => {
        const nextValue = Number(event.target.value);
        updateTable(nextValue, 1);
    });

    updateTable(defaultDisplayCount, 1);

    return tableSection;
}

function hydrateCourseReviewPage() {
    fetch("courses.json")
        .then((response) => response.json())
        .then((data) => {
            const tableNode = createCourseTable(data.courses);
            const tableContainer = document.getElementById("course-table");
            if (tableContainer) {
                tableContainer.innerHTML = "";
                tableContainer.appendChild(tableNode);
            }

            const reviewSection = document.getElementById(
                "course-review-section",
            );
            if (reviewSection) {
                reviewSection.innerHTML = "";
                data.courses.forEach((course, index) => {
                    const courseNode = courseToNode(course, index);
                    reviewSection.appendChild(courseNode);
                });
            }
        })
        .catch((error) => {
            console.error("Unable to load courses:", error);
        });
}

document.addEventListener("DOMContentLoaded", hydrateCourseReviewPage);
