from pydantic import BaseModel
class Student(BaseModel):

    name: str = 'Akshat'

new_student = {}

student = Student(**new_student)
print(student)