import ZODB.FileStorage
import transaction
import BTrees.OOBTree
from fastapi import FastAPI, Body
import json

app = FastAPI()

storage = ZODB.FileStorage.FileStorage('mydata.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root
root.students = BTrees.OOBTree.BTree()

@app.post("/students/new/")
async def create_student(body: dict = Body(...)):
    sid = int(body["ID"])
    root.students[sid] = body
    transaction.commit()
    return root.students[sid]

@app.on_event("shutdown")
def shutdown_event():
    db.close()
    storage.close()
