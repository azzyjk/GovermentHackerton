
def get_wind_direction_vector(value: int):
    
    # 북, 동, 남, 서로 원핫벡터 인코딩

    if value == 0:
        return [1, 0, 0, 0]
    elif value == 90:
        return [0, 1, 0, 0]
    elif value == 180:
        return [0, 0, 1, 0]
    elif value == 270:
        return [0, 0, 0, 1]
    elif 0 < value < 90:
        return [round((value - 0 ) /90, 2), round((90 - value ) /90, 2), 0, 0]
    elif 90 < value < 180:
        return [0, round((value - 90 ) /90, 2), round((180 - value ) /90, 2), 0, 0]
    elif 180 < value < 270:
        return [0, 0, round((value - 180 ) /90, 2), round((270 - value ) /90, 2)]
    elif 270 < value < 360:
        return [round((360 - value ) /90, 2), 0, 0, round((value - 270 ) /90, 2)]


def get_one_vector(value: float):

    if 0 <= value < 0.1:
        return float(0)
    elif 0.1 <= value < 0.2:
        return float(1)
    elif 0.2 <= value < 0.3:
        return float(2)
    elif 0.3 <= value < 0.4:
        return float(3)
    elif 0.4 <= value < 0.5:
        return float(4)
    elif 0.5 <= value < 0.6:
        return float(5)
    elif 0.6 <= value < 0.7:
        return float(6)
    elif 0.7 <= value < 0.8:
        return float(7)
    elif 0.8 <= value < 0.9:
        return float(8)
    elif 0.9 <= value <= 1:
        return float(9)
