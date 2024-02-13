import ZODB
import ZODB.FileStorage
import persistent

class Course(persistent.Persistent):
    def __init__(self, id, name="", credit=0):
        self.id = id
        self.name = name
        self.credit = credit

    def __str__(self):
        return "ID: %s Course Name: %s, Credit %d" % (str(self.id), self.name, self.credit)

    def getCredit(self):
        return "Credit " + str(self.credit)

    def setName(self, name):
        self.name = name

    def printDetail(self):
        return self.__str__()

class Student(persistent.Persistent):
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.enrolls = []

    def enrollCourse(self, course, grade):
        enrollment = Enrollment(course, grade, self)
        self.enrolls.append(enrollment)

    def getEnrollment(self, course):
        for enrollment in self.enrolls:
            if enrollment.course == course:
                return enrollment
        return None

    def printTranscript(self):
        total_credits = 0
        weighted_grade_sum = 0
        for enrollment in self.enrolls:
            total_credits += enrollment.course.credit
            weighted_grade_sum += enrollment.grade * enrollment.course.credit
        if total_credits == 0:
            return 0.0  # Avoid division by zero
        gpa = weighted_grade_sum / total_credits
        return gpa

    def setName(self, name):
        self.name = name

class Enrollment(persistent.Persistent):
    def __init__(self, course, grade, student):
        self.course = course
        self.grade = grade
        self.student = student

    def getCourse(self):
        return self.course

    def getGrade(self):
        return self.grade

    def printDetail(self):
        return "ID: %s Course Name: %s, Credit %d, Grade: %d" % (str(self.course.id), self.course.name, self.course.credit, self.grade)

    def setGrade(self, grade):
        self.grade = grade
