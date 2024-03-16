import sys, os, re, time
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.parent.parent.parent.absolute()))
from email_component import email_main

main = email_main.EmailMain()
main.verify()