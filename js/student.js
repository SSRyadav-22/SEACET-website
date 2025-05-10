// Mock student data
const studentData = {
    "1SP22AI047": {
        marks: {
            ml: 85,
            bc: 78,
            pm: 90,
            nlp: 82,
            labs: 88
        },
        attendance: {
            ml: 92,
            bc: 85,
            pm: 95,
            nlp: 88,
            labs: 90
        }
    },
    "1SP22CS123": {
        marks: {
            ml: 80,
            bc: 75,
            pm: 85,
            nlp: 78,
            labs: 82
        },
        attendance: {
            ml: 90,
            bc: 82,
            pm: 93,
            nlp: 85,
            labs: 88
        }
    }
};

// Function to get student marks
function getStudentMarks(id) {
    return studentData[id]?.marks || { ml: 0, bc: 0, pm: 0, nlp: 0, labs: 0 };
}

// Function to get student attendance
function getStudentAttendance(id) {
    return studentData[id]?.attendance || { ml: 0, bc: 0, pm: 0, nlp: 0, labs: 0 };
}