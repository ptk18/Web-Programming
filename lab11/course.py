import ZODB
import ZODB.FileStorage
import persistent
import transaction
from z_enrollment import Course, Student

storage = ZODB.FileStorage.FileStorage('mydata.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root


if __name__ == "__main__":
    # Attempt to retrieve existing 'courses' and 'students' data, if they exist
    courses = getattr(root, 'courses', {})
    students = getattr(root, 'students', {})

    # Create and store course objects
    course1 = Course(id=1, name="Math", credit=3)
    course2 = Course(id=2, name="History", credit=4)
    courses[course1.id] = course1
    courses[course2.id] = course2

    # Create and store student objects
    student1 = Student(id=1, name="John Doe")
    student2 = Student(id=2, name="Jane Smith")
    students[student1.id] = student1
    students[student2.id] = student2

    # Store the updated 'courses' and 'students' data back in the root object
    root.courses = courses
    root.students = students

    # Commit the transaction to persist the changes
    transaction.commit()

    # Retrieve and display course data
    print("Courses found in the database:")
    for course_id, course in courses.items():
        print(course.printDetail())

    print()

    # Retrieve and display student data
    print("Students found in the database:")
    for student_id, student in students.items():
        print(student.printTranscript())
        print()
