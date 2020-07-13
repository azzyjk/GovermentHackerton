import csv
import codecs
import os
from collections import Counter
import NeuralNetwork.CustomMath as customMath


def read_file(file_location: str):
    file = codecs.open(file_location, 'r', 'euc-kr')
    csv_reader = csv.reader(file)
    return csv_reader


def get_wind_direction_rain(file_name: str, year_month: str):
    file_csv = read_file(file_name)
    file_csv.__next__()

    prev_date = "01"
    temp_windspeed_list = []
    return_value = []

    for line in file_csv:

        cur_date = line[1][8:10]

        if cur_date != prev_date:
            day_value = Counter(temp_windspeed_list).most_common()
            if day_value[0][0] == 0:
                return_value.append([year_month + "-" + prev_date, day_value[1][0], line[3]])
            else:
                return_value.append([year_month + "-" + prev_date, day_value[0][0], line[3]])

            temp_windspeed_list = []
        try:
            temp_windspeed_list.append(round(float(line[4])))
        except ValueError:
            pass

        if cur_date == "01" and prev_date != "01":
            break

        prev_date = cur_date

    return return_value


def get_windspeed(file_name: str, wind_direction_rain: list):
    file_csv = read_file(file_name)
    file_csv.__next__()

    cur_day_windspeed = []
    prev_date = "01"

    for line in file_csv:

        cur_date = line[1][8:10]

        if cur_date != prev_date:
            wind_direction_rain[int(prev_date) - 1].append(round(sum(cur_day_windspeed) / len(cur_day_windspeed), 2))
            cur_day_windspeed = []

        try:
            if round(float(line[4])) == wind_direction_rain[int(cur_date) - 1][1]:
                cur_day_windspeed.append(float(line[5]))
        except ValueError:
            pass

        if cur_date == "01" and prev_date != "01":
            break

        prev_date = cur_date

    return wind_direction_rain


if __name__ == "__main__":

    result = []
    dataset = os.listdir("../자료조사/Data/풍향데이터/")

    for name in dataset:
        print(name, name[20:27])
        csv_file = "../자료조사/Data/풍향데이터/" + name
        month_middle = get_wind_direction_rain(csv_file, name[20:27])
        print(month_middle)
        month_result = get_windspeed(csv_file, month_middle)
        # print(month_result)
        for day in month_result:
            result.append(day)

    writer = open("result.csv", "w")
    csv_writer = csv.writer(writer)
    csv_writer.writerow(["날짜", "북", "동", "남", "서", "강수량", "풍속"])

    for day in result:
        try:
            wind_direction = customMath.get_wind_direction_vector(day[1])
            csv_writer.writerow([day[0], wind_direction[0], wind_direction[1], wind_direction[2], wind_direction[3], day[2], day[3]])
        except:
            print(day)

    # 나온 결과값을 정리해 Data폴더 안에 날씨데이터.csv로 옮김
