import bluetooth as bt
import requests
import paramiko
from scp import SCPClient
import time

socket = bt.BluetoothSocket(bt.RFCOMM)
socket.connect(("98:D3:41:FD:66:2A", 1))
print("Connection established")

while True:
    front_message = socket.recv(1024)
    print(front_message)
    if format(front_message) == "b'IN'":
        # send data to sub_server
        ssh_client = paramiko.SSHClient()
        ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh_client.connect("192.168.35.40", username="pi", password="$y1K!Nv72")

        with SCPClient(ssh_client.get_transport()) as scp:
            scp.put("/home/ht/python/in.txt", "~/python", preserve_times=True)
        print("IN detected, pass to sub server")
        ssh_client.close()
        time.sleep(10)

    elif format(front_message) == "b'OUT'":
        requests.post("http://localhost/out", data={"out":"true"})
        print("out send complete")
