import requests
from bs4 import BeautifulSoup
from random import choice

url = 'https://book.douban.com/tag/%E7%BC%96%E7%A8%8B'
ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36"
headers = {'User-Agent': ua}

with open('hosts') as f:
    proxies = [proxy.strip() for proxy in f.readlines()]

    with requests.get(url=url, headers=headers, proxies={"http": choice(proxies)}) as resp:
        soup = BeautifulSoup(markup=resp.text, features='lxml')
        # //li[@class="subject-item"]//h2/a/text()
        # //li[@class="subject-item"]//span[@class="rating_nums"]/text()
        books = soup.select('.subject-item')
        # print(books)

        for book in books:
            # print(book.select('h2 a'))
            title = ''.join(map(lambda x: x.strip(), book.select('h2 a')[0].text))  # 合并副标题
            rate = book.select('.rating_nums')[0].text
            print(title, rate)
