SPIDER_NAME = "event-spider"
EVENTS_URLS = {
    "medical school anu": {
        "domain": "https://medicalschool.anu.edu.au",
        "url": "https://medicalschool.anu.edu.au/news-events/events",
        "xpath": {
            "event_list": '//div[@class="clearfix marginbottom clear"]',
            "event_item": './div[1]/a/@href',
            "event_info": {
                "title": '//*[@id="page-title"]/text()',
                "description": '//div[@class="panel-pane pane-node-body"]//text()',
                "speaker": "",
                "date": '//div[@class="panel-pane pane-entity-field pane-node-field-date-time brd-label marginbottom"]/div/div/div//text()',
                "venue": '//div[@class="panel-pane pane-entity-field pane-node-field-location marginbottom"]//p/text()',
                'image_url':'//div[@class="panel-pane pane-views-panes pane-media-node-display-panel-pane-1 marginbottom"]//img/@src',
            }
        }
    },
    "JCSMR anu": {
        "domain": "https://jcsmr.anu.edu.au",
        "url": "https://jcsmr.anu.edu.au/news-events/events",
        "xpath": {
            "event_list": '//div[@class="clearfix marginbottom clear"]',
            "event_item": './div[1]/a/@href',
            "event_info": {
                "title": '//*[@id="page-title"]/text()',
                "description": '//div[@class="panel-pane pane-node-body"]//text()',
                "speaker": '',
                "date": '//div[@class="panel-pane pane-entity-field pane-node-field-date-time brd-label marginbottom"]/div/div/div//text()',
                "venue": '//div[@class="panel-pane pane-entity-field pane-node-field-location marginbottom"]//p/text()',
                'image_url':'//div[@class="panel-pane pane-views-panes pane-media-node-display-panel-pane-1 marginbottom"]//img/@src',
            }
        }
    },
    "computing school anu": {
        "domain": "https://comp.anu.edu.au",
        "url": "https://comp.anu.edu.au/newsroom",
        "xpath": {
            "event_list": '//article[@class="card"]',
            "event_item": './a/@href',
            "event_info": {
                "title": '//*[@id="main-content"]/header/h1/text()',
                "description": '//*[@id="skip-toc-target"]//text()',
                "speaker": '//*[@id="main-content"]/header/p[1]//text()',
                "date": '//*[@id="main-content"]/header/div/div/article[1]//text()',
                "venue": '//*[@id="main-content"]/header/div/div/article[2]//text()',
                'image_url':'//*[@class="cover-image"]//img/@src',
            }
        }
    }
}
