import tensorflow as tf


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


class Classification:

    def __init__(self, data_num: int, learning_rate=0.05):
        self.network = tf.keras.Sequential([
            tf.keras.layers.Dense(units=50, activation="relu", input_shape=(data_num,)),
            tf.keras.layers.Dense(units=100, activation="relu"),
            tf.keras.layers.Dense(units=100, activation="relu"),
            tf.keras.layers.Dense(units=1)
        ])
        self.network.compile(optimizer=tf.keras.optimizers.Adam(lr=learning_rate), loss='mse')
        self.network.summary()


if __name__ == "__main__":
    test = RNN(20)
    test2 = Classification(15)
