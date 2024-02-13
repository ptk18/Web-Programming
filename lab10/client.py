import requests

url = 'http://161.246.5.61:11466/students/html/'
response = requests.get(url)

if response.status_code == 200:
    print('Request successful')
    print('Response:', response.text)
else:
    print('Request failed. Status code:', response.status_code)