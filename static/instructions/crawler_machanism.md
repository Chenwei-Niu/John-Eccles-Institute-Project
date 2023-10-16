# Crawling part

## 1.1 The entrance of the system

The entrance of whole system is  file`schedule_execute.py` at the root directory of the project. Source code contains detailed comments

## 1.2 The Scrapy component

The crawling process is executed by Scrapy crawling framework https://scrapy.org/

To better understand how this works, I recommend you to go through any of Scrapy tutorials on YouTube.

The folder `scrapy_component` and file `scrapy.cfg` are crucial in Scrapy framework. `scrapy.cfg` defines the project deploy name and where the project setting locates. Here are several essential files within the folder `scrapy_component`.

### 1.2.1 scrapy_component/config

In this file, it contains the spider name and a list of websites containing events.

![image-20231017073807246](D:\ANU Courses\COMP8755 Individual Computing Project\JEI_remote\static\readme_images\crawler_machanism_1.png)

### 1.2.2 scrapy_component/settings

This file contains many useful properties and parameters adjusting the performance of crawler. These screenshots include significant attributes that the maintainer should know.

![image-20231017074421634](D:\ANU Courses\COMP8755 Individual Computing Project\JEI_remote\static\readme_images\crawler_machanism_2.png)

![image-20231017074643053](D:\ANU Courses\COMP8755 Individual Computing Project\JEI_remote\static\readme_images\crawler_machanism_3.png)

![image-20231017074908515](D:\ANU Courses\COMP8755 Individual Computing Project\JEI_remote\static\readme_images\crawler_machanism_4.png)

### 1.2.3 scrapy_component/spiders/event-spider

In this file, class **EventSpider** will be instantiated during the crawling, and it would execute **start_request()**, **parse_event_list()**, and **parse_event()** in sequence. This spider object could firstly fetch all target websites in config.py, and for each website fetch the list of events, then parse the event and store the event into database. This class also fetch and store the presenter's key information and interested research areas based on their Google Scholar profile. This process should take several minutes.

### 1.2.4 scrapy_component/items

The class **ScrapyComponentItem** wraps information we want to convey from `event-spider.py` to `pipelines.py`

### 1.2.5 scrapy_component/pipelines

This file defines all pipeline classes, and for our project, we do not use the default **ScrapyComponentPipeline** class. Our **SaveToDatabase** pipeline creates scholar and events object which can be handled by database.

### 1.2.6 scrapy_component/key_terms_extractor

This directory contains the implementation of C-value keywords extractor. 