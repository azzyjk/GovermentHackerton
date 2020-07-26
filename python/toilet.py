import bluetooth as bt
import requests
import datetime
import time
import os

socket = bt.BluetoothSocket(bt.RFCOMM)
socket.connect(("98:D3:21:F4:88:8A", 1))
print("Connection established")

while True:
    try:
        in_checker = open("/home/pi/python/in.txt")
        cur_time = datetime.datetime.now()
        while True:
            toilet_message = socket.recv(1024)
            time_elapse = datetime.datetime.now() - cur_time
            if format(toilet_message) == "b'toilet'" and time_elapse.seconds < 50:
                requests.post("http://192.168.35.169/toilet_success", data={"toilet_success":"true"})
                print("toilet success")
                break
            elif format(toilet_message) != "b'toilet'" and time_elapse.seconds >= 50:
                requests.post("http://192.168.35.169/toilet_fail", data={"toilet_fail":"true"})
                print("toilet_fail")
                break
        os.system("rm -rf /home/pi/python/in.txt")
        print("flag erased")

    except FileNotFoundError:
        time.sleep(1)
