import js
from pyodide import create_proxy
from datetime import datetime

container = Element("container")
botton = js.document.querySelector("#btn1")

def on_click(event):
    now = datetime.now()
    temp = now.strftime("%m/%d/%Y, %H:%M:%S")
    container.write("<label>Clicked at " + temp + "</label>" )

click_proxy = create_proxy(on_click)

botton.addEventListener("click", click_proxy)
print(botton)
print(js.document.title)

