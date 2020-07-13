import time
from selenium import webdriver
from datetime import datetime

chrome_driver_path = './chromedriver.exe'
target_url = 'https://cleanair.seoul.go.kr/2020/statistics/dayAverage'
csv_filename = 'data.csv'
csv_file = open(csv_filename, 'w')
year_list = range(2014, 2021)
month_list = range(1, 13)
month_list2 = range(1, 7) # use year is 2020
days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
days_in_month2 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] # 29 days in February

driver = webdriver.Chrome(chrome_driver_path)
driver.get(target_url)

def is_leap_year(year):
    if (year % 4 == 0) and ((year % 100 != 0) or (year % 400 == 0)):
        return True
    else:
        return False

def craw_data(year, month):
    driver.find_element_by_id('search').click()
    time.sleep(1)
    value = driver.find_element_by_class_name('total').text.split(' ')

    if is_leap_year(year):
        for day in range(1, days_in_month2[month-1]+1):
            date = datetime(year, month, day).strftime("%Y%m%d")
            print(date + " : " + value[day+2])
            csv_file.write(date + "," + value[day+2]+"\n")
    else:
        for day in range(1, days_in_month[month-1]+1):
            date = datetime(year, month, day).strftime("%Y%m%d")
            print(date + " : " + value[day + 2])
            csv_file.write(date + "," + value[day+2]+"\n")

for year in year_list:
    driver.find_element_by_xpath("//select[@id='lGroup']/option[text()='"+ str(year) +"']").click()

    if year != 2020:
        for month in month_list:
            driver.find_element_by_xpath("//select[@id='monthList']/option[text()='" + str(month) + "월']").click()
            craw_data(year, month)
    else:
        for month in month_list2:
            driver.find_element_by_xpath("//select[@id='monthList']/option[text()='" + str(month) + "월']").click()
            craw_data(year, month)

csv_file.close()
