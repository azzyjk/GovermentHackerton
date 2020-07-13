import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import csv
import NeuralNetwork.CustomMath as customMath


class RNN:

    def __init__(self, estimate_day: int):
        self.network = tf.keras.Sequential([
            tf.keras.layers.LSTM(units=100, return_sequences=True, input_shape=[estimate_day, 1]),
            tf.keras.layers.LSTM(units=100),
            tf.keras.layers.Dense(units=100),
            tf.keras.layers.Dense(units=50),
            tf.keras.layers.Dense(1)
        ])
        self.network.compile(optimizer=tf.keras.optimizers.Adam(lr=0.05), loss='mse')
        self.network.summary()


class Regression:

    def __init__(self, learning_rate=0.005):
        self.network = tf.keras.Sequential([
            tf.keras.layers.Dense(units=52, activation="relu", input_shape=(7,)),
            tf.keras.layers.Dense(units=78, activation="relu"),
            tf.keras.layers.Dense(units=49, activation="relu"),
            tf.keras.layers.Dense(units=28, activation="relu"),
            tf.keras.layers.Dense(units=10, activation="softmax")
        ])
        self.network.compile(optimizer=tf.keras.optimizers.Adam(lr=learning_rate), loss='binary_crossentropy', metrics=['accuracy'])
        self.network.summary()

    def training(self, input_data: np.array, output_data: np.array):
        self.history = self.network.fit(
            input_data, output_data, epochs=50, batch_size=20, validation_split=0.25
            #,callbacks=[tf.keras.callbacks.EarlyStopping(patience=3, monitor='val_loss')]
        )
        self.network.save_weights("weights/value")

    def test(self, input_data: np.array, answer: np.array):
        self.network.load_weights("weights/value")
        result = self.network.predict(input_data)
        result = result.tolist()
        for i in range(len(result)):
            print(result[i].index(max(result[i])))

    def show_matching(self, test_data: np.asarray, answer: np.asarray):
        self.network.load_weights("weights/value")
        predict_answer = self.network.predict(test_data)
        '정답에 해당하는 학습데이터를 판별시켜높음. 일종의 실습. 실제 데이터를 트레이닝시킨 결과라 할 수 있음'

        plt.figure(figsize=(5, 5))
        '맵 사이즈를 5x5로 한다는거같은데, 정규분포를 토대로 그려지니 맞는 선택이라 할 수 있음'
        plt.plot(answer, predict_answer, 'b.')
        '똑같은 데이터셋인데 하나는 학습셋을 학습시킨것, 하나는 진짜 정답값을 1대1 매칭으로 점으로 표기. 즉, y=x 직선에 가까울수록 성능이 좋음'
        plt.axis([min(answer), max(answer), min(answer), max(answer)])

        'y=x 그리는 함수.'
        plt.plot([min(answer), max(answer)], [min(answer), max(answer)],
                 ls="--", c=".3")
        plt.xlabel('test_answer')
        plt.ylabel('predicted_answer')
        plt.show()



def get_regression_data():
    datafile = open("final_training_data.csv", "r")
    csv_data = csv.reader(datafile)
    csv_data.__next__()
    input_data = []
    output_data = []

    for line in csv_data:
        input_data.append(
            [float(line[1]), float(line[2]), float(line[3]), float(line[4]), float(line[5]), float(line[6]),
             float(line[7])])
        output_data.append([customMath.get_one_vector(float(line[8]))])
    input_data = np.asarray(input_data)
    output_data = np.asarray(output_data)
    print(input_data)
    print(output_data)

    return input_data, output_data


if __name__ == "__main__":
    test2 = Regression()
    input_data, output_data = get_regression_data()
    test2.training(input_data, output_data)
    test2.test(input_data[:50], output_data[:50])
