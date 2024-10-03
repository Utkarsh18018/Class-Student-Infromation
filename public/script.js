document.addEventListener('DOMContentLoaded', ()=>{

const studentBtn = document.getElementById('studentBtn');
const teacherBtn = document.getElementById('teacherBtn');
const pinForm = document.getElementById('pinForm');
const studentForm = document.getElementById('studentForm');
const teacherActions = document.getElementById('teacherActions');
const closeStudentForm = document.getElementById('closeStudentForm');

// Define the unique 4-digit teacher PIN
const teacherPIN = '1234'; 

// Search functionality
const resetSearch = () => {
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('searchResultContainer').style.display = 'none';
};

// Event listener for student button
studentBtn.addEventListener('click', () => {
    studentForm.style.display = 'flex'; // Show student registration form
    pinForm.style.display = 'none'; // Hide teacher PIN input
    teacherActions.style.display = 'none'; // Hide teacher functionalities
    studentBtn.style.display = 'none'; // Hide student button
    teacherBtn.style.display = 'none'; // Hide teacher button
    closeStudentForm.style.display = 'block';
    closeStudentForm.setAttribute('data-role', 'student'); // Add a data attribute to track the form type
});

// Event listener for teacher button
teacherBtn.addEventListener('click', () => {
    pinForm.style.display = 'flex'; // Show teacher PIN input
    studentForm.style.display = 'none'; // Hide student registration form
    teacherActions.style.display = 'none'; // Hide teacher functionalities
    studentBtn.style.display = 'none'; // Hide student button
    teacherBtn.style.display = 'none'; // Hide teacher button
    closeStudentForm.style.display = 'block';
    closeStudentForm.setAttribute('data-role', 'teacher'); // Add a data attribute to track the form type

    resetSearch();
});



// Event listener for PIN submission
document.getElementById('submitPinBtn').addEventListener('click', () => {
    const enteredPIN = document.getElementById('pinInput').value;
    if (enteredPIN === teacherPIN) {
        teacherActions.style.display = 'block'; // Show teacher functionalities
        pinForm.style.display = 'none'; // Hide PIN form
        studentForm.style.display = 'none'; // Hide student registration form
    } else {
        alert('Incorrect PIN. Access denied.');
    }
});

// Add student functionality
document.getElementById('addStudentBtn').addEventListener('click', function () {
    studentForm.style.display = 'flex';
    document.getElementById('searchForm').style.display = 'none';
    resetSearch();
});

// Search student functionality
document.getElementById('searchStudentBtn').addEventListener('click', function () {
    document.getElementById('searchForm').style.display = 'flex';
    studentForm.style.display = 'none';
    resetSearch();
});

// Toggle student list visibility
document.getElementById('toggleStudentListBtn').addEventListener('click', function () {
    const studentListContainer = document.getElementById('studentListContainer');
    studentListContainer.style.display = studentListContainer.style.display === 'none' ? 'block' : 'none';
});

studentForm.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent page refresh
    const name = document.getElementById('name').value;
    const admission_number = document.getElementById('rollno').value;
    const section = document.getElementById('section').value;
    const gmail = document.getElementById('gmail').value;

    try {
        // Sending a POST request to register the student
        const response = await fetch('/registerStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, rollno: admission_number, section, gmail }),
        });

        const data = await response.json(); // Parse the JSON response once

        if (response.ok) {
            // If successful, update the student list
            const studentList = document.getElementById('studentList');
            const newStudent = document.createElement('li');
            newStudent.textContent = `${data.student.name} (Roll No: ${data.student.rollno}, Section: ${data.student.section}), Gmail: ${data.student.gmail}`;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.addEventListener('click', function () {
                studentList.removeChild(newStudent);
            });

            newStudent.appendChild(deleteBtn);
            studentList.appendChild(newStudent);
            alert(data.message); // Show success message
        } else {
            alert('Failed to register student: ' + data.message); // Provide feedback on failure
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error registering student'); // Alert on catch error
    }

    studentForm.reset(); // Clear the form
});










// Event listener for search button
document.getElementById('searchButton').addEventListener('click', async function () {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    try {
        const response = await fetch(`/searchStudents?name=${encodeURIComponent(searchTerm)}&timestamp=${new Date().getTime()}`);

        const results = await response.json();

        // Check if results contain an error field
        if (results.error) {
            throw new Error(results.error); // Throws an error with the message from the server
        }

        const searchResults = document.getElementById('studentList');
        searchResults.innerHTML = ''; // Clear previous results

        if (results.length > 0) {
            results.forEach(student => {
                const li = document.createElement('li');
                li.textContent = `${student.name} (Roll No: ${student.rollno}, Section: ${student.section}, Gmail: ${student.gmail})`;
                searchResults.appendChild(li);
            });
            document.getElementById('studentListContainer').style.display = 'block'; // Show search results container
        } else {
            // Show no results only if there are no results found
            document.getElementById('studentListContainer').style.display = 'none'; // Hide search results container
            alert('No results found.'); // Alert only when no results are found
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error searching students : ' + error.message);
    }
});

// Toggle student list visibility and fetch student data
document.getElementById('toggleStudentListBtn').addEventListener('click', async function () {
    const studentListContainer = document.getElementById('studentListContainer');
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = ''; // Clear previous results

    if (studentListContainer.style.display === 'none') {
        try {
            const response = await fetch('/students'); // Fetch all students
            const students = await response.json();

            // Check if students were retrieved successfully
            if (students.length > 0) {
                students.forEach(student => {
                    const li = document.createElement('li');
                    li.textContent = `${student.name} (Roll No: ${student.rollno}, Section: ${student.section}, Gmail: ${student.gmail})`;
                    studentList.appendChild(li);
                });
            } else {
                studentList.innerHTML = '<li>No students found.</li>';
            }

            studentListContainer.style.display = 'block'; // Show student list
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('Error fetching student list');
        }
    } else {
        studentListContainer.style.display = 'none'; // Hide student list if already displayed
    }
});


const resetStudentList = () => {
    const studentListContainer = document.getElementById('studentListContainer');
    const studentList = document.getElementById('studentList');
    
    // Clear the student list and hide the container
    studentList.innerHTML = '';
    studentListContainer.style.display = 'none'; // Hide the list
};


// Event listener for close button
closeStudentForm.addEventListener('click', function() {
    const role = closeStudentForm.getAttribute('data-role');

    if (role === 'student') {
        studentForm.reset(); // Reset student form
        studentForm.style.display = 'none';
    } else if (role === 'teacher') {
        pinForm.reset(); // Reset teacher PIN form
        pinForm.style.display = 'none';
        teacherActions.style.display = 'none'; // Hide teacher functionalities
        resetStudentList();
    }

    studentBtn.style.display = 'block'; // Show student button
    teacherBtn.style.display = 'block'; // Show teacher button
    closeStudentForm.style.display = 'none'; // Hide close button
});
});
