from selenium.webdriver import PhantomJS
from random import randint
import time

def savepic():
    filename = '{}-{}.png'.format(int(time.time()), randint(100, 999))
    driver.save_screenshot(filename=filename)

# 下拉框处理
from selenium.webdriver.support.ui import Select

with PhantomJS() as driver:
    driver.set_window_size(width=1280, height=1024)
    url = 'https://www.oschina.net/search?q=python&scope=project'
    driver.get(url=url)
    element = driver.find_element_by_name(name="tag1")

    print(element.tag_name)
    print(driver.current_url)
    savepic()

    select = Select(element)
    select.select_by_index(index=1)  # 选择一个按钮，这里会跳转到一个新页面
    # select.select_by_value(value='309')
    print(driver.current_url)
    savepic()
