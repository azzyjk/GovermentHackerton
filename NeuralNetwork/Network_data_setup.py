import csv
import numpy as np


def set_weather_data():
    weather_file = open("../자료조사/Data/날씨데이터.csv")
    csv_reader = csv.reader(weather_file)
    csv_reader.__next__()

    rain = []
    windspeed = []
    date = []
    d1, d2, d3, d4 = [], [], [], []

    for line in csv_reader:
        try:
            rain.append(float(line[5]))
            windspeed.append(float(line[6]))
            date.append(line[0])
            d1.append(line[1])
            d2.append(line[2])
            d3.append(line[3])
            d4.append(line[4])

        except:
            print(line[0])

    rain = np.asarray(rain)
    rain = (rain - rain.min()) / (rain.max() - rain.min())
    rain = rain.tolist()
    print(rain)
    windspeed = np.asarray(windspeed)
    windspeed = (windspeed - windspeed.min()) / (windspeed.max() - windspeed.min())
    windspeed = windspeed.tolist()

    final_file = open("final_weather_data.csv", "w")
    final_csv = csv.writer(final_file)
    final_csv.writerow(["날짜", "북", "동", "남", "서", "강수량", "풍속"])

    for i in range(len(rain)):
        final_csv.writerow([date[i], d1[i], d2[i], d3[i], d4[i], round(rain[i], 3), round(windspeed[i], 3)])


def set_traffic_data():
    traffic_file = open("../자료조사/Data/교통량.csv")
    csv_reader = csv.reader(traffic_file)
    csv_reader.__next__()

    traffic = []
    date = []

    for line in csv_reader:
        value = int(line[1])
        if value != 0:
            traffic.append(value)
            date.append(line[0])

    traffic = np.asarray(traffic)
    traffic = (traffic - traffic.min()) / (traffic.max() - traffic.min())
    traffic = traffic.tolist()

    test = open("final_traffic_data.csv", "w")
    csv_writer = csv.writer(test)
    csv_writer.writerow(["날짜", "교통량"])

    for i in range(len(traffic)):
        csv_writer.writerow([date[i], round(traffic[i], 3)])


def set_training_data():
    f1 = open("final_weather_data.csv", "r")
    f2 = open("final_traffic_data.csv", "r")
    f3 = open("../자료조사/Data/미세먼지_testdata.csv", "r")
    c1 = csv.reader(f1)
    c1.__next__()
    c1_date, c1_north, c1_east, c1_south, c1_west, c1_rain, c1_wind = [], [], [], [], [], [], []
    c2 = csv.reader(f2)
    c2.__next__()
    c2_date, c2_traffic = [], []  # 0, 1
    c3 = csv.reader(f3)
    c3.__next__()
    c3_date, c3_dust = [], []  # 0, 2

    for line in c1:
        c1_date.append(int(line[0].replace("-", "")))
        c1_north.append(line[1])
        c1_east.append(line[2])
        c1_south.append(line[3])
        c1_west.append(line[4])
        c1_rain.append(line[5])
        c1_wind.append(line[6])

    for line in c2:
        c2_date.append(int(line[0]))
        c2_traffic.append(line[1])

    for line in c3:
        c3_date.append(int(line[0]))
        c3_dust.append(line[2])

    final_file = open("final_training_data.csv", "w")
    csv_final = csv.writer(final_file)
    csv_final.writerow(["날짜", "교통량", "풍속", "강우량", "북", "동", "남", "서", "미세먼지"])

    n1, n2, n3 = 0, 0, 0
    while True:

        print(c1_date[n1], c2_date[n2], c3_date[n3])

        if c1_date[n1] > 20200530:
            break

        if c1_date[n1] == c2_date[n2] and c2_date[n2] == c3_date[n3]:
            csv_final.writerow([c1_date[n1], c2_traffic[n2], c1_wind[n1], c1_rain[n1], c1_north[n1], c1_east[n1], c1_south[n1], c1_west[n1], c3_dust[n3]])
            n1 += 1
            n2 += 1
            n3 += 1

        else:
            # print("before: ", c1_date[n1], c2_date[n2], c3_date[n3])
            if c1_date[n1] > c2_date[n2] and c1_date[n1] > c3_date[n3]:
                # print("case1")
                while c1_date[n1] > c2_date[n2]:
                    n2 += 1
                while c1_date[n1] > c3_date[n3]:
                    n3 += 1
            if c2_date[n2] > c1_date[n1] and c2_date[n2] > c3_date[n3]:
                # print("case2")
                while c2_date[n2] > c1_date[n1]:
                    n1 += 1
                while c2_date[n2] > c3_date[n3]:
                    n3 += 1
            if c3_date[n3] > c1_date[n1] and c3_date[n3] > c2_date[n2]:
                # print("case3")
                while c3_date[n3] > c1_date[n1]:
                    n1 += 1
                while c3_date[n3] > c2_date[n2]:
                    n2 += 1
            # print("after : ", c1_date[n1], c2_date[n2], c3_date[n3])



if __name__ == "__main__":
    # set_weather_data()
    # set_traffic_data()
    set_training_data()
