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
                "description": '//*[@id="block-system-main"]/div/div/div/div[1]/div/div[5]/div/div/div/div//text()',
                "speaker": "",
                "date": '//div[@class="panel-pane pane-entity-field pane-node-field-date-time brd-label marginbottom"]/div/div/div//text()',
                "venue": '//div[@class="panel-pane pane-entity-field pane-node-field-location marginbottom"]//p/text()',
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
                "description": '//*[@id="block-system-main"]/div/div/div/div[1]/div/div[5]/div/div/div/div//text()',
                "speaker": '//div[@class="field field-name-body field-type-text-with-summary field-label-hidden"]/div/div/h3[1]/text() | \
                    //div[@class="field field-name-body field-type-text-with-summary field-label-hidden"]/div/div/h4[1]/text()',
                "date": '//div[@class="panel-pane pane-entity-field pane-node-field-date-time brd-label marginbottom"]/div/div/div//text()',
                "venue": '//div[@class="panel-pane pane-entity-field pane-node-field-location marginbottom"]//p/text()',
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
                "speaker": "",
                "date": '//*[@id="skip-toc-target"]/p[1]/text()',
                "venue": '//*[@id="skip-toc-target"]/p[2]/text()',
            }
        }
    }
}
