import serial
import requests

port="/dev/ttyUSB0"
arduino = serial.Serial(port, 9600)
arduino.flushInput()
while True:
    a_in = arduino.readline()
    a_in = str(a_in)
    print(a_in)
    if 'OPEN' in a_in:
        requests.post("http://192.168.35.169/window_open", data={"window_open":"true"})
        print("opened")
    elif 'CLOSED' in a_in:
        requests.post("http://192.168.35.169/window_close", data={"window_close":"true"})
        print("closed")
