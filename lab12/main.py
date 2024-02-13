from pydantic import BaseModel
from fastapi import FastAPI

app = FastAPI()

class Person(BaseModel):
    name: str
    surname: str
    age: int
    
persondb = [
    Person(id=1, name="Many", surname="Tanimura", age=22),
    Person(id=2, name="Chris", surname="Evan", age=38),
    Person(id=3, name="Elizabeth", surname="Olson", age=36),
    Person(id=4, name="Steven", surname="Strange", age=22),
    
]

@app.get("/person/{person_id}")
def read_person(person_id: int):
    return persondb[person_id]
