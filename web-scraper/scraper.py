
# Additional info: https://stackoverflow.com/questions/8049520/web-scraping-javascript-page-with-python

from bs4 import BeautifulSoup as bs
import requests
import argparse
from tqdm import tqdm
import datetime
import statistics
from random import randint
import json

from re import sub
from re import match

parser = argparse.ArgumentParser()

parser.add_argument("--verbose", "-v", help="Enable verbose logging to console", action='store_true',
                    required=False, default=False)
parser.add_argument("--proxy", "-p", help="Use random proxies for each scraping call. MUCH Slower but obfuscates IP Address. Also foregoes HTTPS since not all proxies support it.", action='store_true',
                    required=False, default=False)


args = parser.parse_args()

baseURL = "https://emojipedia.org/people/"
endURLS = [
    "people/",
    "nature/",
    "food-drink/",
    "activity/",
    "travel-places/",
    "objects/",
    "symbols/",
    "flags/"
]
urls = ["{}{}"
        .format(baseURL, endURL) for endURL in endURLS]


def priceFromListItem(item):
    return int(sub(r"\D", "", str(item.contents)))


def getProxyIPs():
    r = requests.get("https://www.us-proxy.org/")
    soup = bs(r.content, 'html.parser')
    table = soup.find('table', attrs={"id": "proxylisttable"})
    rows = table.findAll('tr')
    proxies = []
    for row in rows:
        ip = row.findNext('td')
        port = ip.findNext('td')

        proxy = u"{}:{}".format(ip.contents[0], port.contents[0])
        proxies.append(proxy)
    proxies.pop()
    return proxies


def fetchEmojis():
    allEmojis = []
    for url in tqdm(urls):
        r = None
        if args.proxy:
            proxies = getProxyIPs()
            i = randint(0, len(proxies)-1)
            r = requests.get(url, proxies={
                "http": proxies[i]
            })
        else:
            r = requests.get(url)
        if r.status_code == 404:
            print("Invalid page, ending!")
            break
        soup = bs(r.content, 'html.parser')
        emojiList = soup.find('ul', attrs={"class": "emoji-list"})
        emojiRows = emojiList.findAll('li')
        for row in emojiRows:
            span, name = row.findChild('a').contents
            emoji = span.contents[0]
            entry = {}
            entry['name'] = name
            entry['emoji'] = emoji
            category = match(r"[^/]+(?=/$|$)", url)
            entry['category'] = ""
            if category:
                entry['category'] = category.group(0)
            allEmojis.append(entry)
            # allEmojis[name] = emoji

    if args.verbose:
        print(allEmojis)

    with open('AllEmojis.txt', 'w+') as outfile:
        json.dump(allEmojis, outfile)
    

if __name__ == "__main__":
    fetchEmojis()
    # with open('AllEmojis.txt', 'r+') as outfile:
    #     data = json.load(outfile)
    #     print(data)
