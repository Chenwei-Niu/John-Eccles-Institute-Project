# Email component



## email_component/email_main.py

This file is responsible to send emails and generate verification email for the maintainer to check. The verification email contains all latest crawled seminars. Current implementation is to fetch all seminars from the database crawled in the following 7 days. There will be a generated verification email under the root directory periodically based on the maintainer's schedule setting in `schedule_execute.py`. If any thing wrong with the verification email, the maintainer can edit it in database graphic admin software like **pgAdmin 4**. After that, regenerate the verification email until every stuff looks correct.

Emails are assembled by the information in database and the email templates under directory **static/email_template**. 



### send_emails.py

This file invokes the send function and sequentially send customized email to each recipient.