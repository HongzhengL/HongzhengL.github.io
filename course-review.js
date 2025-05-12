fetch("courses.json")
    .then(response => response.json())
    .then(data => {
        // Create and add the navigation table
        const tableNode = createCourseTable(data.courses);
        document.getElementById("course-table").appendChild(tableNode);
        
        // Add course reviews
        data.courses.forEach((course, index) => {
            const courseNode = courseToNode(course, index);
            document.getElementById("course-review-section").appendChild(courseNode);
        });
    });

const defaultDisplayCount = 5;

function courseToNode(course, index) {
    const courseNode = document.createElement('div');
    courseNode.className = "row align-items-start project mb-4";
    courseNode.id = `course-${index}`;

    // Create image column (left side)
    const courseImageNode = document.createElement('div');
    courseImageNode.className = "col-md-4 col-sm-12 mb-3";
    
    // Create image wrapper for aspect ratio
    const imageWrapper = document.createElement('div');
    imageWrapper.className = "position-relative h-100 w-100";
    imageWrapper.style.minHeight = "200px";
    
    const courseImage = document.createElement('img');
    courseImage.src = course.image;
    courseImage.className = "img-fluid rounded w-100 h-100 object-fit-cover";
    courseImage.style.position = "relative";
    courseImage.alt = course.course_code;
    
    imageWrapper.appendChild(courseImage);
    courseImageNode.appendChild(imageWrapper);
    
    // Create content column (right side)
    const contentNode = document.createElement('div');
    contentNode.className = "col-md-8 col-sm-12";
    
    const courseTitle = document.createElement('h2');
    courseTitle.textContent = course.course_code;
    contentNode.appendChild(courseTitle);

    const newBadgesDivNode = document.createElement("div");
    newBadgesDivNode.className = "d-flex flex-wrap gap-2 mb-3";
    
    const courseSemester = document.createElement('p');
    courseSemester.className = "badge text-bg-secondary m-0";
    courseSemester.innerText = course.semester;
    newBadgesDivNode.appendChild(courseSemester);

    const courseHours = document.createElement('p');
    courseHours.className = "badge text-bg-secondary m-0";
    courseHours.innerText = "Hours: ~" + course.hours + "h";
    newBadgesDivNode.appendChild(courseHours);

    const courseInstructor = document.createElement('p');
    courseInstructor.className = "badge text-bg-secondary m-0";
    courseInstructor.innerText = "Instructor: " + course.instructor;
    newBadgesDivNode.appendChild(courseInstructor);
    contentNode.appendChild(newBadgesDivNode);

    // Render reviews as markdown
    if (Array.isArray(course.review)) {
        course.review.forEach(reviewText => {
            const reviewElem = document.createElement('div');
            reviewElem.innerHTML = window.marked ? marked.parse(reviewText) : reviewText;
            contentNode.appendChild(reviewElem);
        });
    }

    courseNode.appendChild(courseImageNode);
    courseNode.appendChild(contentNode);

    return courseNode;
}


function createCourseTable(courses) {
    const tableSection = document.createElement('div');
    tableSection.className = 'container mb-4';

    // Create entries per page selector
    const selectorWrapper = document.createElement('div');
    selectorWrapper.className = 'd-flex align-items-center mb-3 gap-2';
    
    const selectorLabel = document.createElement('label');
    selectorLabel.textContent = 'Show entries: ';
    
    // In the createCourseTable function, when creating the selector:
    const selector = document.createElement('select');
    selector.className = 'form-select w-auto';
    [5, 10, 15, 20, 'All'].forEach(value => {
        const option = document.createElement('option');
        option.value = value === 'All' ? courses.length : value;
        option.textContent = value;
        // Set the default selected option to 5
        if (value === defaultDisplayCount) {
            option.selected = true;
        }
        selector.appendChild(option);
    });
    
    selectorWrapper.appendChild(selectorLabel);
    selectorWrapper.appendChild(selector);
    tableSection.appendChild(selectorWrapper);

    // Create table
    const table = document.createElement('table');
    table.className = 'table table-hover';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.className = 'table-light';
    const headerRow = document.createElement('tr');
    ['Course Code', 'Semester'].forEach(headerText => {
        const th = document.createElement('th');
        th.scope = 'col';
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tableSection.appendChild(table);

    // Create pagination container
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'd-flex justify-content-between align-items-center mt-3';
    
    const pageInfo = document.createElement('div');
    paginationContainer.appendChild(pageInfo);
    
    const pagination = document.createElement('ul');
    pagination.className = 'pagination mb-0';
    paginationContainer.appendChild(pagination);
    
    tableSection.appendChild(paginationContainer);

    // Function to update table content
    function updateTable(entriesPerPage, currentPage = 1) {
        // Clear existing tbody
        tbody.innerHTML = '';
        
        // Calculate start and end indices
        const start = (currentPage - 1) * entriesPerPage;
        const end = Math.min(start + entriesPerPage, courses.length);
        
        // Update page info text
        pageInfo.textContent = `Showing ${start + 1} to ${end} of ${courses.length} entries`;
        
        // Add rows for current page
        for (let i = start; i < end; i++) {
            const course = courses[i];
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            
            row.addEventListener('click', () => {
                document.getElementById(`course-${i}`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                const courseElement = document.getElementById(`course-${i}`);
                courseElement.style.transition = 'background-color 0.5s';
                courseElement.style.backgroundColor = '#fff3cd';
                setTimeout(() => {
                    courseElement.style.backgroundColor = '';
                }, 1500);
            });
            
            const codeCell = document.createElement('td');
            codeCell.textContent = course.course_code;
            row.appendChild(codeCell);
            
            const semesterCell = document.createElement('td');
            semesterCell.textContent = course.semester;
            row.appendChild(semesterCell);
            
            tbody.appendChild(row);
        }

        // Update pagination
        pagination.innerHTML = '';
        const totalPages = Math.ceil(courses.length / entriesPerPage);
        
        if (totalPages > 1) {
            // Previous button
            const prevLi = document.createElement('li');
            prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
            const prevLink = document.createElement('a');
            prevLink.className = 'page-link';
            prevLink.href = '#';
            prevLink.textContent = 'Previous';
            prevLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    updateTable(entriesPerPage, currentPage - 1);
                }
            });
            prevLi.appendChild(prevLink);
            pagination.appendChild(prevLi);

            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.className = `page-item ${i === currentPage ? 'active' : ''}`;
                const link = document.createElement('a');
                link.className = 'page-link';
                link.href = '#';
                link.textContent = i;
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    updateTable(entriesPerPage, i);
                });
                li.appendChild(link);
                pagination.appendChild(li);
            }

            // Next button
            const nextLi = document.createElement('li');
            nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
            const nextLink = document.createElement('a');
            nextLink.className = 'page-link';
            nextLink.href = '#';
            nextLink.textContent = 'Next';
            nextLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                    updateTable(entriesPerPage, currentPage + 1);
                }
            });
            nextLi.appendChild(nextLink);
            pagination.appendChild(nextLi);
        }
    }

    // Add event listener for entries per page selector
    selector.addEventListener('change', (e) => {
        updateTable(parseInt(e.target.value));
    });

    // Initialize table with default 10 entries per page
    updateTable(defaultDisplayCount);
    
    return tableSection;
}
