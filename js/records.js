// ==================== PAGINATION STATE ====================
let currentPage = 1;
let recordsPerPage = 10;
let currentSortColumn = null;
let currentSortDirection = 'asc';
let currentData = [];

// ==================== DEPARTMENT NAVIGATION ====================
function showDepartmentRecords(department) {
    currentDepartment = department;
    currentPage = 1;
    
    document.getElementById('departmentSection').style.display = 'none';
    document.getElementById('recordsSection').style.display = 'block';
    
    const departmentNames = {
        'CSE': 'Computer Science (CSE)',
        'ECE': 'Electronics (ECE)',
        'MECH': 'Mechanical (MECH)',
        'CIVIL': 'Civil (CIVIL)',
        'EEE': 'Electrical (EEE)',
        'IT': 'Information Technology (IT)'
    };
    
    document.getElementById('departmentTitle').textContent = `${departmentNames[department] || department} Department Records`;
    
    loadStudentRecords(department);
    initializeSortableTable();
    setupLiveSearch();
}

function backToDepartments() {
    document.getElementById('departmentSection').style.display = 'block';
    document.getElementById('recordsSection').style.display = 'none';
    currentDepartment = '';
    currentPage = 1;
    currentSortColumn = null;
    currentSortDirection = 'asc';
}

function loadStudentRecords(department) {
    const students = getStudents();
    currentData = students.filter(student => student.department === department);
    
    displayWithPagination();
    displayTopPerformers(currentData);
}

// ==================== SEARCH SETUP (CLICK ONLY) ====================
function setupLiveSearch() {
    const searchInput = document.getElementById('searchInput');
    const gradeFilter = document.getElementById('filterGrade');
    
    // Remove live search - only filter on icon click or Enter key
    if (searchInput) {
        // Remove any existing event listeners by cloning and replacing
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        
        // Add Enter key support
        newSearchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                filterStudents();
            }
        });
    }
    
    // Keep the grade filter with change event
    if (gradeFilter) {
        const newGradeFilter = gradeFilter.cloneNode(true);
        gradeFilter.parentNode.replaceChild(newGradeFilter, gradeFilter);
        
        newGradeFilter.addEventListener('change', filterStudents);
    }
}

// ==================== PAGINATION FUNCTIONS ====================
function displayWithPagination() {
    const totalRecords = currentData.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);
    
    const pageData = currentData.slice(startIndex, endIndex);
    
    displayStudents(pageData);
    
    // Only show pagination if more than 10 records
    if (totalRecords > 10) {
        updatePaginationControls(totalRecords, totalPages, startIndex, endIndex);
    } else {
        removePaginationControls();
    }
}

function removePaginationControls() {
    const existingTop = document.getElementById('paginationTop');
    const existingBottom = document.getElementById('paginationBottom');
    if (existingTop) existingTop.remove();
    if (existingBottom) existingBottom.remove();
}

function updatePaginationControls(totalRecords, totalPages, startIndex, endIndex) {
    const tableContainer = document.querySelector('.table-container');
    
    const existingTop = document.getElementById('paginationTop');
    const existingBottom = document.getElementById('paginationBottom');
    if (existingTop) existingTop.remove();
    if (existingBottom) existingBottom.remove();
    
    // Create top pagination
    const topDiv = document.createElement('div');
    topDiv.id = 'paginationTop';
    topDiv.className = 'pagination-container';
    topDiv.innerHTML = `
        <div class="pagination-info">
            Showing ${startIndex + 1} to ${endIndex} of ${totalRecords} records
        </div>
        <div class="pagination-controls">
            <select class="pagination-select" title="Records per page">
                <option value="10" ${recordsPerPage === 10 ? 'selected' : ''}>10 per page</option>
                <option value="25" ${recordsPerPage === 25 ? 'selected' : ''}>25 per page</option>
                <option value="50" ${recordsPerPage === 50 ? 'selected' : ''}>50 per page</option>
                <option value="100" ${recordsPerPage === 100 ? 'selected' : ''}>100 per page</option>
                <option value="${totalRecords}" ${recordsPerPage >= totalRecords ? 'selected' : ''}>All</option>
            </select>
            <div class="pagination-buttons">
                <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} title="First page" data-page="1">
                    &laquo;
                </button>
                <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} title="Previous page" data-page="${currentPage - 1}">
                    &lsaquo;
                </button>
                ${generatePageButtonsHTML(totalPages)}
                <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} title="Next page" data-page="${currentPage + 1}">
                    &rsaquo;
                </button>
                <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} title="Last page" data-page="${totalPages}">
                    &raquo;
                </button>
            </div>
        </div>
    `;
    
    // Create bottom pagination
    const bottomDiv = document.createElement('div');
    bottomDiv.id = 'paginationBottom';
    bottomDiv.className = 'pagination-container';
    bottomDiv.innerHTML = topDiv.innerHTML;
    
    // Insert pagination
    tableContainer.parentNode.insertBefore(topDiv, tableContainer);
    tableContainer.parentNode.insertBefore(bottomDiv, tableContainer.nextSibling);
    
    // Add event listeners
    attachPaginationListeners(topDiv);
    attachPaginationListeners(bottomDiv);
}

function attachPaginationListeners(container) {
    // Add listener for page buttons
    const pageButtons = container.querySelectorAll('.pagination-btn');
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                const page = parseInt(this.dataset.page);
                if (page) goToPage(page);
            }
        });
    });
    
    // Add listener for records per page select
    const select = container.querySelector('.pagination-select');
    if (select) {
        select.addEventListener('change', function() {
            changeRecordsPerPage(this.value);
        });
    }
}

function generatePageButtonsHTML(totalPages) {
    let buttons = '';
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        buttons += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    title="Page ${i}"
                    data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    return buttons;
}

function generatePageButtons(totalPages) {
    // This function is no longer used - replaced by generatePageButtonsHTML
    return '';
}

function goToPage(page) {
    const totalPages = Math.ceil(currentData.length / recordsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayWithPagination();
    
    document.querySelector('.table-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function changeRecordsPerPage(value) {
    recordsPerPage = parseInt(value);
    currentPage = 1;
    displayWithPagination();
}

// ==================== SORTABLE TABLE ====================
function initializeSortableTable() {
    const headers = document.querySelectorAll('.student-table th.sortable');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            sortTable(column);
        });
    });
}

function sortTable(column) {
    if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortDirection = 'asc';
    }
    
    currentData.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        if (column === 'percentage') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        } else {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
        }
        
        if (aVal < bVal) return currentSortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    updateSortIndicators(column);
    displayWithPagination();
}

function updateSortIndicators(column) {
    const headers = document.querySelectorAll('.student-table th.sortable');
    
    headers.forEach(header => {
        header.classList.remove('asc', 'desc');
        if (header.dataset.column === column) {
            header.classList.add(currentSortDirection);
        }
    });
}

// ==================== DISPLAY STUDENTS ====================
function displayStudents(students) {
    const tableBody = document.getElementById('studentTableBody');
    const noRecordsMsg = document.getElementById('noRecordsMessage');
    
    if (students.length === 0) {
        tableBody.innerHTML = '';
        noRecordsMsg.style.display = 'block';
        return;
    }
    
    noRecordsMsg.style.display = 'none';
    
    tableBody.innerHTML = students.map(student => `
        <tr>
            <td>
                <img src="${student.photo || 'https://via.placeholder.com/150'}" 
                     alt="${student.name}" 
                     class="student-photo"
                     title="${student.name}"
                     onerror="this.src='https://via.placeholder.com/150'">
            </td>
            <td title="${student.id}">${student.id}</td>
            <td title="${student.name}">${student.name}</td>
            <td title="${student.class}">${student.class}</td>
            <td title="${student.section || 'N/A'}">${student.section || 'N/A'}</td>
            <td title="${student.department}">${student.department}</td>
            <td title="${student.contact}">${student.contact}</td>
            <td title="${student.percentage}%">${student.percentage}%</td>
            <td title="${student.grade}"><strong>${student.grade}</strong></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" 
                            onclick="editStudent('${student.id}')" 
                            title="Edit ${student.name}">
                        &#9998; Edit
                    </button>
                    <button class="btn-action btn-delete" 
                            onclick="deleteStudent('${student.id}')" 
                            title="Delete ${student.name}">
                        &#128465; Del
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==================== TOP PERFORMERS ====================
function displayTopPerformers(students) {
    const topPerformers = students
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);
    
    const listElement = document.getElementById('topPerformersList');
    
    if (topPerformers.length === 0) {
        listElement.innerHTML = '<li style="list-style-type: none;">No students yet.</li>';
        return;
    }
    
    listElement.innerHTML = topPerformers.map(student => `
        <li title="${student.name} - ${student.percentage}%">
            ${student.name} - ${student.percentage}% (${student.grade})
        </li>
    `).join('');
}

// ==================== FILTER STUDENTS (FIXED - NO DUPLICATE TOAST) ====================
function filterStudents() {
    const searchInput = document.getElementById('searchInput');
    const gradeFilter = document.getElementById('filterGrade');
    
    if (!searchInput || !gradeFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const gradeFilterValue = gradeFilter.value;
    
    const students = getStudents();
    currentData = students.filter(student => student.department === currentDepartment);
    
    // Apply search filter
    if (searchTerm) {
        currentData = currentData.filter(student =>
            student.name.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm) ||
            student.class.toLowerCase().includes(searchTerm) ||
            (student.section && student.section.toLowerCase().includes(searchTerm)) ||
            student.contact.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply grade filter
    if (gradeFilterValue) {
        currentData = currentData.filter(student => student.grade === gradeFilterValue);
    }
    
    currentPage = 1;
    displayWithPagination();
    
    // Show toast ONLY when search button is clicked or Enter is pressed
    // NOT when typing in search box
    if (searchTerm || gradeFilterValue) {
        const resultText = currentData.length === 1 ? 'student' : 'students';
        showInfo(`Found ${currentData.length} ${resultText}`);
    }
}

// ==================== FORM SUBMIT ====================
function submitStudentForm() {
    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const studentClass = document.getElementById('studentClass').value;
    const studentSection = document.getElementById('studentSection').value;
    const studentDepartment = document.getElementById('studentDepartment').value;
    const studentContact = document.getElementById('studentContact').value.trim();
    const studentEmail = document.getElementById('studentEmail').value.trim();
    const studentPercentage = parseFloat(document.getElementById('studentPercentage').value);
    const studentGrade = document.getElementById('studentGrade').value;
    const studentAddress = document.getElementById('studentAddress').value.trim();
    
    let studentPhoto = document.getElementById('studentPhoto').value.trim();
    const studentPhotoUrl = document.getElementById('studentPhotoUrl')?.value.trim() || '';
    
    if (!studentPhoto && studentPhotoUrl) {
        studentPhoto = studentPhotoUrl;
    } else if (!studentPhoto) {
        studentPhoto = 'https://via.placeholder.com/150';
    }
    
    if (!studentId || !studentName || !studentClass || !studentDepartment || 
        !studentContact || !studentEmail || isNaN(studentPercentage) || !studentGrade) {
        showFormMessage('error', 'Please fill in all required fields.');
        showError('Please fill in all required fields');
        return;
    }
    
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(studentName)) {
        showFormMessage('error', 'Name must contain only letters and spaces.');
        showError('Name must contain only letters and spaces');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(studentEmail)) {
        showFormMessage('error', 'Please enter a valid email address.');
        showError('Please enter a valid email address');
        return;
    }
    
    const phonePattern = /^\+?\d[\d\s-]{8,}$/;
    if (!phonePattern.test(studentContact)) {
        showFormMessage('error', 'Please enter a valid phone number.');
        showError('Please enter a valid phone number');
        return;
    }
    
    if (studentPercentage < 0 || studentPercentage > 100) {
        showFormMessage('error', 'Percentage must be between 0 and 100.');
        showError('Percentage must be between 0 and 100');
        return;
    }
    
    let students = getStudents();
    const returnDepartment = sessionStorage.getItem('returnDepartment');
    
    if (editingStudentId) {
        const index = students.findIndex(s => s.id === editingStudentId);
        
        if (index !== -1) {
            students[index] = {
                id: studentId,
                name: studentName,
                class: studentClass,
                section: studentSection,
                department: studentDepartment,
                contact: studentContact,
                email: studentEmail,
                percentage: studentPercentage,
                grade: studentGrade,
                photo: studentPhoto,
                address: studentAddress
            };
            
            saveStudents(students);
            showFormMessage('success', 'Student updated successfully!');
            showSuccess(`${studentName} updated successfully!`);
            
            editingStudentId = null;
            document.getElementById('studentId').readOnly = false;
            document.querySelector('.page-title').textContent = 'Add New Student';
            document.querySelector('.btn-primary').textContent = '\u2713 Add Student';
            
            if (returnDepartment) {
                sessionStorage.removeItem('returnDepartment');
                setTimeout(() => {
                    window.location.href = `records.html?dept=${returnDepartment}`;
                }, 1500);
                return;
            }
        }
    } else {
        if (students.some(s => s.id === studentId)) {
            showFormMessage('error', 'Student ID already exists.');
            showError('Student ID already exists');
            return;
        }
        
        const newStudent = {
            id: studentId,
            name: studentName,
            class: studentClass,
            section: studentSection,
            department: studentDepartment,
            contact: studentContact,
            email: studentEmail,
            percentage: studentPercentage,
            grade: studentGrade,
            photo: studentPhoto,
            address: studentAddress
        };
        
        students.push(newStudent);
        saveStudents(students);
        
        showFormMessage('success', 'Student added successfully!');
        showSuccess(`${studentName} added successfully!`);
        
        setTimeout(() => {
            window.location.href = `records.html?dept=${studentDepartment}`;
        }, 1500);
    }
    
    resetStudentForm();
    loadRecentStudents();
}

// ==================== DELETE STUDENT WITH TOAST ====================
function deleteStudent(studentId) {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        showError('Student not found');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
        const updatedStudents = students.filter(s => s.id !== studentId);
        saveStudents(updatedStudents);
        
        showSuccess(`${student.name} deleted successfully`);
        
        if (currentDepartment) {
            loadStudentRecords(currentDepartment);
        }
    }
}

// ==================== OTHER FUNCTIONS ====================
function resetStudentForm() {
    document.getElementById('studentId').value = '';
    document.getElementById('studentId').readOnly = false;
    document.getElementById('studentName').value = '';
    document.getElementById('studentClass').value = '';
    document.getElementById('studentSection').value = '';
    document.getElementById('studentDepartment').value = '';
    document.getElementById('studentContact').value = '';
    document.getElementById('studentEmail').value = '';
    document.getElementById('studentPercentage').value = '';
    document.getElementById('studentGrade').value = '';
    document.getElementById('studentAddress').value = '';
    
    const photoFile = document.getElementById('studentPhotoFile');
    const photoUrl = document.getElementById('studentPhotoUrl');
    const photo = document.getElementById('studentPhoto');
    
    if (photoFile) photoFile.value = '';
    if (photoUrl) photoUrl.value = '';
    if (photo) photo.value = '';
    
    if (typeof removeUploadedImage === 'function') {
        removeUploadedImage();
    }
    
    editingStudentId = null;
    sessionStorage.removeItem('returnDepartment');
}

function showFormMessage(type, message) {
    const messageDiv = document.getElementById('formMessage');
    if (!messageDiv) return;
    
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function loadRecentStudents() {
    const students = getStudents();
    const recentStudents = students.slice(-5).reverse();
    
    const listElement = document.getElementById('recentStudentsList');
    if (!listElement) return;
    
    if (recentStudents.length === 0) {
        listElement.innerHTML = '<p>No students added yet.</p>';
        return;
    }
    
    listElement.innerHTML = recentStudents.map(student => `
        <div class="recent-student-card">
            <img src="${student.photo || 'https://via.placeholder.com/150'}" 
                 alt="${student.name}" 
                 style="width: 45px; height: 45px; border-radius: 50%; margin-right: 10px; vertical-align: middle;"
                 onerror="this.src='https://via.placeholder.com/150'">
            <div style="display: inline-block; vertical-align: middle;">
                <strong>${student.name}</strong><br>
                <small>${student.id} | ${student.department} | ${student.grade}</small>
            </div>
        </div>
    `).join('');
}

// ==================== EDIT STUDENT WITH TOAST ====================
function editStudent(studentId) {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        showError('Student not found');
        return;
    }
    
    console.log('✏️ Editing:', student);
    showInfo(`Editing ${student.name}`);
    
    sessionStorage.setItem('editingStudent', JSON.stringify(student));
    sessionStorage.setItem('returnDepartment', currentDepartment);
    
    window.location.href = 'add-student.html';
}

// ==================== AUTO-CALCULATE GRADE ====================
document.addEventListener('DOMContentLoaded', function() {
    const percentageInput = document.getElementById('studentPercentage');
    const gradeSelect = document.getElementById('studentGrade');
    
    if (percentageInput && gradeSelect) {
        percentageInput.addEventListener('input', function() {
            const percentage = parseFloat(this.value);
            
            if (!isNaN(percentage)) {
                let grade = '';
                if (percentage >= 90) grade = 'A+';
                else if (percentage >= 80) grade = 'A';
                else if (percentage >= 70) grade = 'B+';
                else if (percentage >= 60) grade = 'B';
                else if (percentage >= 50) grade = 'C';
                else if (percentage >= 40) grade = 'D';
                else grade = 'F';
                
                gradeSelect.value = grade;
            }
        });
    }
    
    if (window.location.pathname.includes('add-student.html')) {
        loadRecentStudents();
        if (typeof loadEditingStudentData === 'function') {
            loadEditingStudentData();
        }
    }
});

// ==================== HANDLE DEPARTMENT REDIRECT ====================
window.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('records.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const dept = urlParams.get('dept');
        
        if (dept) {
            setTimeout(() => {
                showDepartmentRecords(dept);
            }, 100);
        }
    }
});