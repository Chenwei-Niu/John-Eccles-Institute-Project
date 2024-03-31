import sys, os
from pathlib import Path
path = Path(os.path.dirname(__file__))
sys.path.append(str(path.parent.absolute())) 
# The four lines above are required, so that this py file could detect other modules
from email_component.email_main import *
recipients = ['u7377070@anu.edu.au']
email_main = EmailMain()
email_main.verify()
# email_main.send(recipients)
