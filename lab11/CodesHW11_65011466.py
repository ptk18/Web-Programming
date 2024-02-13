import ZODB, ZODB.FileStorage
import persistent
import transaction
import BTrees.OOBTree

# Course class
class Course(persistent.Persistent):
    def __init__(self, ID, credit, name):
        self.ID = ID
        self.credit = credit
        self.name = name
        self.grading = [{"Grade" : "A", "min" : 80, "max" : 100},
                    {"Grade" : "B", "min" : 70, "max" : 79},
                    {"Grade" : "C", "min" : 60, "max" : 69},
                    {"Grade" : "D", "min" : 50, "max" : 59},
                    {"Grade" : "F", "min" : 0, "max" : 49}] 

    def __str__(self) -> str:
        return f"ID:    {self.ID}, Course: {self.name}, Credit {self.credit}"
    
    def getCredit(self):
        return self.credit
    
    def setName(self, name):
        self.name = name

    def printDetail(self):
        print(self.__str__())
        
    def scoreGrading(self, score):
        for grade_range in self.grading:
           if grade_range["min"] <= score <= grade_range["max"]:
                return grade_range["Grade"]
        return 'F'
    
    def setGradeScheme(self, scheme):
        # it check whether the scheme which is grading is in correct format or not. If it is so, set its gradeScheme to the input scheme
        if isinstance(scheme, list): # isinstance(object, type) returns True if the specified object is of the specified type, otherwise False.
            for entry in scheme:
                if (isinstance(entry, dict) and "Grade" in entry and "min" in entry and "max" in entry):
                    continue
                else:
                    print("Invalid grading scheme format. Grade, min, and max keys are required.")
                    return
            self.grading = scheme
        else:
            print("Invalid grading scheme format. The input should be a list of dictionaries.")
        

# Student class
class Student(persistent.Persistent):
    def __init__(self, ID, name, enrolls):
        self.ID = ID
        self.name = name
        self.enrolls = enrolls # list of enrollment objects

    def __str__(self) -> str:
        course_list = "\n".join([f"     Course: ID: {enroll.courseObject.ID}, Name: {enroll.courseObject.name}, Credit: {enroll.courseObject.credit}, Grade: {enroll.grade}" for enroll in self.enrolls])
        return f"Transcript \nID: {self.ID}, Name: {self.name}, Enrollments: {len(self.enrolls)}\n{course_list}"
  
    def enrollCourse(self, courseObject, Grade, score=None):
        enrollment = Enrollment(courseObject, Grade, self, score)
        self.enrolls.append(enrollment)
        return enrollment
    
    def getEnrollment(self, courseObject):
        for enrollment in self.enrolls:
            if enrollment.courseObject == courseObject:
                return enrollment
        return None  # Return None if the enrollment is not found
        
    def calculateGPA(self):
        total_credits = 0
        weighted_grade_sum = 0
        for enrollment in self.enrolls:
            total_credits += enrollment.courseObject.credit
            grade = enrollment.grade
            course_grading = enrollment.courseObject.grading  # Get the grading scheme from the course
            numeric_grade = 0.0  # Default to 0.0 for unknown grades
            for grade_range in course_grading:
                if grade_range["Grade"] == grade:
                    numeric_grade = (grade_range["min"] + grade_range["max"]) / 2
                    break
            weighted_grade_sum += numeric_grade * enrollment.courseObject.credit
        if total_credits == 0:
            return 0.0  # Avoid division by zero
        gpa = weighted_grade_sum / total_credits
        return gpa
    
    def printTranscript(self):
        gpa = self.calculateGPA()
        print(f"     Transcript\nID: {self.ID}, Name: {self.name}, Enrollments: {len(self.enrolls)}")
        print("Course list")
        for enrollment in self.enrolls:
            course = enrollment.courseObject
            print(f"     ID: {course.ID}, Name: {course.name}, Credit: {course.credit}, Score: {enrollment.score}, Grade: {enrollment.grade}")
        print(f"Total GPA is: {gpa:.2f}")
        return gpa


    def setName(self, name):
        self.name = name

# Enrollment class
class Enrollment(persistent.Persistent):
    def __init__(self, courseObject, grade, studentObject,score):
        self.courseObject = courseObject
        self.studentObject = studentObject
        self.grade = grade
        self.score = score

    def __str__(self) -> str:
        course_info = f"Course list: ID: {self.courseObject.ID}, Credit: {self.courseObject.credit}, Name: {self.courseObject.name}"
        student_info = f"Student: ID: {self.studentObject.ID}, Name: {self.studentObject.name}, Enrollments: {len(self.studentObject.enrolls)}"
        return f"Enrollment:\n{course_info}, Grade: {self.grade}, {student_info}"
    
    def getCourse(self):
        return self.courseObject

    def printDetail(self):
        print(self.__str__())
        
    def getGrade(self):
        return self.grade
        
    def getScore(self):
        return self.score

    def setScore(self, score):
        self.score = score


# storage, database, and connection

storage = ZODB.FileStorage.FileStorage('mydata.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root

# testing
# create objects examples to be saved in database, that can be retrieved and displayed with below test_case

root.courses = BTrees.OOBTree.BTree()
# Create Course objects
root.courses[101]= Course(101, 3, "Introduction to Computer Science")
root.courses[201] = Course(201, 4, "Data Structure and Algorithm")

root.student = BTrees.OOBTree.BTree()
# Create Student objects and enroll them in courses
root.student[1101] = Student("1101", "Mr. Christian De Neuvillette", [])
root.student[1101].enrollCourse(root.courses[101], "C", 65)
root.student[1101].enrollCourse(root.courses[201], "A",  88)

root.student[1102] = Student("1102", "Mr. Zhong Li", [])
root.student[1102].enrollCourse(root.courses[101], "A", 90)
root.student[1102].enrollCourse(root.courses[201], "B", 75)

root.student[1103] = Student("1103", "Mr. Dvalinn Durinson", [])
root.student[1103].enrollCourse(root.courses[101], "B",  78)
root.student[1103].enrollCourse(root.courses[201], "B", 72)

# Store the objects in the database
root.courses = {
    root.courses[101].ID: root.courses[101],
    root.courses[201].ID: root.courses[201]
}

root.students = {
    root.student[1101].ID: root.student[1101],
    root.student[1102].ID: root.student[1102],
    root.student[1103].ID: root.student[1103]
}

# Commit the transaction to save the changes
transaction.commit()

# Reloading the data
courses = root.courses
for c in courses:
    course = courses[c]
    course.printDetail()
print()

students = root.students
for s in students:
    student = students[s]
    student.printTranscript()
    print()
    
print(root.users)
