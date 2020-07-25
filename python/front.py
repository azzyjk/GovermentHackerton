import bluetooth as bt
import requests
import datetime
from scp import SCPClient, SCPException
import paramiko

t1 = datetime.datetime.now()
t2 = datetime.datetime.now()

t3 = t2 - t1
print(t1)
print(t2)
print(t3)
print(t3.seconds)

