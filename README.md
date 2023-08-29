# How to deploy the JEI system

## Prepare Linux environment

1. Install PostgresSQL server

   ```bash
   sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
   wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
   sudo apt-get update
   sudo apt-get -y install postgresql
   ```

2. Install Node.js through this website https://nodejs.org/en/download/package-manager

3. Make sure we have Python3.6+ installed

4. Execute these code in terminal

```bash
pip install -U pip setuptools wheel
pip install -U spacy
python -m spacy download en_core_web_sm
pip install sqlalchemy
pip install psycopg2
pip install schedule
pip install datetime
pip install nltk
```

5. Create a database for this project

   - check if "PostgresSQL/[version_number]/bin" is in the "PATH"

   - open a terminal and type in ```pg_ctl -D "PostgresSQL/[version_number]/data"```

   - click enter until you are able to type in SQL commands

     - type in  

       ```sql
       -- Database: postgres
       
       -- DROP DATABASE IF EXISTS jei;
       
       CREATE DATABASE jei
           WITH
           OWNER = postgres
           ENCODING = 'UTF8'
           TABLESPACE = pg_default
           CONNECTION LIMIT = -1
           IS_TEMPLATE = False;
       ```

6. Run the web server by opening a terminal and type in

   ```
   npm run dev
   ```

   

7. cd into the project root directory, where "**scrapy.cfg**" locates, then cd into **scraper**

   Please open **settings.py**, and you need to modify the **user, passwd**  variables in **"CONNECTION_STRING"** according to your setup, so that you can get access to the database

8. cd into the project root directory, where "**scrapy.cfg**" locates

   open a terminal in this directory and type in

   ```bash
   python schedule_execute
   ```

   The system would crawl the websites within scraper/config.py once a week

   The default crawl time is 17:00 on each Wednesday. You are free to change it in **schedule_execute.py** file.

9. We strongly recommend you to install a GUI for PostgresSQL called pgAdmin if you are unfamiliar with writing SQL commands.



### Unhappy about the extracted keywords?

If you are unhappy with the extracted keywords from the abstracts of seminars, still in the **scraper/settings.py**. You are free to adjust four hyper parameters there.

```python
\# Setting for the key terms extractor

\# LINGUISTIC_FILTER: the linguistic filter, can be Noun or AdjNoun or AdjPrepNoun

\# MAX_LEN: the expected maximum length of a term

\# FREQUENCY_THRESHOLD: the frequency threshold

\# C_VALUE_THRESHOLD: the C-value threshold



LINGUISTIC_FILTER = "Noun"

MAX_LEN = 2

FREQUENCY_THRESHOLD = 0

C_VALUE_THRESHOLD = 1
```



### How do you add a new target website?

1. cd into the project root directory, where "**scrapy.cfg**" locates, then cd into **scraper** directory.

   Then, you could open **config.py**.

   - To add a new website, you need to add a new element into **EVENT_URLS**

   Here is a concrete example

   ```python
   "computing school anu": {
           "domain": "https://comp.anu.edu.au",
           "url": "https://comp.anu.edu.au/newsroom",
           "xpath": {
               "event_list": '//article[@class="card"]',
               "event_item": './a/@href',
               "event_info": {
                   "title": '//*[@id="main-content"]/header/h1/text()',
                   "description": '//*[@id="skip-toc-target"]//text()',
                   "speaker": "",
                   "date": '//*[@id="skip-toc-target"]/p[1]/text()',
                   "venue": '//*[@id="skip-toc-target"]/p[2]/text()',
               }
           }
       }
   ```

   - "computing school anu" is the customized name of new target website
   - "domain" is the domain of the website
   - "url" is the index page that containing many events that you can click into, here is an example
     - ![image-20230829110219213](/static/readme_images/image-20230829110219213.png)
   - "event_list" defines the xpath to get all events URL in this webpage, press F12 to use the devtool
   - "event_item" defines the xpath to get detailed webpage of an event
     - ![image-20230829111038058](/static/readme_images/image-20230829111038058.png)
   - "title" defines the XPATH of the seminar title
     - ![image-20230829111717958](/static/readme_images/image-20230829111717958.png)
   - "description" is always the XPATH involving Abstract and Biography. Here is an example:
     - ![image-20230829111930872](/static/readme_images/image-20230829111930872.png)
   - "venue" and "date" are straightforward, find the according XPATH and put it there
   - "speaker": If there is a clear html tag displaying the presenter, we use the XPATH. But sometimes, we cannot find the exact XPATH towards the presenter, in that case, we could leave it blank, and let our spider extract it from the description.

   

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
