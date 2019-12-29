# https://selenium-python.readthedocs.io/locating-elements.html
# https://selenium-python.readthedocs.io/api.html#module-selenium.webdriver.common.keys

# 模拟登陆(模拟键盘操作)

from selenium.webdriver import PhantomJS
from random import randint
import time
from selenium.webdriver.common.keys import Keys
from requests.cookies import RequestsCookieJar
import requests

def savepic():
    filename = '{}-{}.png'.format(int(time.time()), randint(100, 999))
    driver.save_screenshot(filename=filename)

with PhantomJS() as driver:
    driver.set_window_size(width=1280, height=1024)
    url = 'https://www.oschina.net/home/login'
    driver.get(url=url)
    # savepic()

    username = driver.find_element_by_id(id_='userMail')
    password = driver.find_element_by_id(id_='userPassword')
    username.send_keys('username')  # 输入用户名
    password.send_keys('password')  # 输入密码
    # savepic()

    password.send_keys(Keys.ENTER)  # 输入回车,提交表单
    time.sleep(10)
    print(driver.current_url)  # 登陆后跳转到首页
    # userinfo = driver.find_element_by_class_name(name='user-info')
    while not driver.find_element_by_class_name(name='user-info').is_displayed():
        time.sleep(1)
    savepic()

    cookies = driver.get_cookies()  # 获取cookie
    print(cookies, type(cookies))
    for cookie in cookies:
        print(cookie)

    jar = RequestsCookieJar()
    for cookie in cookies:
        jar.set(name=cookie.get('name'), value=cookie.get('value'))
    print(jar)

    ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36"
    headers = {'user-agent': ua}

    with requests.get(url=url, headers=headers) as resp:
        print(resp.url)  # 不带cookie会停留在登陆页

    with requests.get(url=url, headers=headers, cookies=jar) as resp:
        print(resp.url)  # 带上cookie会自动登陆跳转到首页
        with open('osc.html', 'wb') as f:
            f.write(resp.content)
