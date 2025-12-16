// ==================== GLOBAL VARIABLES ====================
let currentDepartment = '';
let editingStudentId = null;

// ==================== SAMPLE DATA WITH SECTIONS ====================
async function fetchStudentsFromJSON() {
    try {
        const response = await fetch('../students.json');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('📋 Using fallback data...');
        return [
        ]
    }
}

// ==================== INITIALIZE LOCAL STORAGE ====================
async function initializeLocalStorage() {
    const existingData = localStorage.getItem('students');
    
    if (!existingData || existingData === 'undefined' || existingData === 'null') {
        console.log('🔄 Initializing localStorage...');
        try {
            const sampleStudents = await fetchStudentsFromJSON();
            localStorage.setItem('students', JSON.stringify(sampleStudents));
            console.log('✅ Initialized with', sampleStudents.length, 'students');
        } catch (error) {
            console.error('❌ Failed to initialize:', error);
            }    } else {
        console.log('✅ localStorage ready');
    }
}

// ==================== GET STUDENTS ====================
function getStudents() {
    const studentsData = localStorage.getItem('students');
    
    if (!studentsData || studentsData === 'undefined' || studentsData === 'null') {
        console.warn('⚠️ No data found');
        return [];
    }
    
    try {
        const students = JSON.parse(studentsData);
        return Array.isArray(students) ? students : [];
    } catch (error) {
        console.error('❌ Error parsing data:', error);
        return [];
    }
}

// ==================== SAVE STUDENTS ====================
function saveStudents(students) {
    try {
        localStorage.setItem('students', JSON.stringify(students));
        console.log('💾 Saved', students.length, 'records');
    } catch (error) {
        console.error('❌ Error saving:', error);
    }
}

// ==================== DELETE STUDENT ====================
function deleteStudent(studentId) {
    if (confirm('Delete this student record?')) {
        let students = getStudents();
        const student = students.find(s => s.id === studentId);
        
        students = students.filter(s => s.id !== studentId);
        saveStudents(students);
        
        if (currentDepartment) {
            loadStudentRecords(currentDepartment);
        }
        
        alert(`${student ? student.name : 'Student'} deleted!`);
    }
}

// ==================== EDIT STUDENT ====================
function editStudent(studentId) {
    const students = getStudents();
    const student = students.find(s => s.id === studentId);
    
    if (!student) {
        alert('Student not found!');
        return;
    }
    
    console.log('✏️ Editing:', student);
    
    sessionStorage.setItem('editingStudent', JSON.stringify(student));
    sessionStorage.setItem('returnDepartment', currentDepartment);
    
    window.location.href = 'add-student.html';
}

// ==================== LOAD EDITING STUDENT ====================
function loadEditingStudentData() {
    const editingStudent = sessionStorage.getItem('editingStudent');
    
    if (editingStudent) {
        const student = JSON.parse(editingStudent);
        editingStudentId = student.id;
        
        console.log('📝 Loading for edit:', student);
        
        document.getElementById('studentId').value = student.id;
        document.getElementById('studentId').readOnly = true;
        document.getElementById('studentName').value = student.name;
        document.getElementById('studentClass').value = student.class;
        document.getElementById('studentSection').value = student.section || '';
        document.getElementById('studentDepartment').value = student.department;
        document.getElementById('studentContact').value = student.contact;
        document.getElementById('studentEmail').value = student.email;
        document.getElementById('studentPercentage').value = student.percentage;
        document.getElementById('studentGrade').value = student.grade;
        document.getElementById('studentPhoto').value = student.photo || '';
        document.getElementById('studentAddress').value = student.address || '';
        
        if (student.photo && student.photo !== '#' && typeof loadExistingImage === 'function') {
            loadExistingImage(student.photo);
        }
        
        document.querySelector('.page-title').textContent = 'Edit Student';
        document.querySelector('.page-subtitle').textContent = 'Update student information';
        document.querySelector('.btn-primary').textContent = '✓ Update Student';
        
        sessionStorage.removeItem('editingStudent');
    }
}