from fastapi import FastAPI

app = FastAPI()

@app.get("/json")
def read_json():
    return {"Hello": "World!"}