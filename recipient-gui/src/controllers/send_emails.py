import sys, os, re, time
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.parent.parent.absolute()))
from email_component.email_main import *

def send():

    email_main = EmailMain()
    email_main.send()

if __name__ == "__main__":
    send()