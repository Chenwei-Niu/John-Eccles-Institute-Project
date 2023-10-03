import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class EmailMain:
    def __init__(self):
        self.GMAIL_USERNAME = "1126niuchenwei"
        self.GMAIL_APP_PASSWORD = "xtwmjekajpzzfike"
        self.email_text = f"""
            Hi! This is the report from our script.
            
            We have added 1 + 2 and gotten the answer {1 + 2}.
            
            Bye!
            """

    def send(self, recipients):
        msg = MIMEText(self.email_text)
        msg["Subject"] = "Email report: a simple sum"
        msg["To"] = ", ".join(recipients)
        msg["From"] = f"{self.GMAIL_USERNAME}@gmail.com"
        smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtp_server.login(self.GMAIL_USERNAME, self.GMAIL_APP_PASSWORD)
        smtp_server.sendmail(msg["From"], recipients, msg.as_string())
        smtp_server.quit()
