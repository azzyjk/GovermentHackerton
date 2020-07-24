#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3);

int motion_pin = 8;
int buzzer_pin = 9;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
  }
  mySerial.begin(9600);

  pinMode(motion_pin, INPUT);
  pinMode(buzzer_pin, OUTPUT);
}

void loop() {
  if (mySerial.available()) { //블루투스에서 넘어온 데이터가 있다면
    //Serial.write(mySerial.read()); //시리얼모니터에 데이터를 출력
    char myChar = (char)mySerial.read();
    Serial.write(myChar);
    if(myChar == 'X'){
      Serial.write("buzzer");
      for(int freq = 150; freq <=1800; freq = freq + 2) {
        tone(buzzer_pin, freq, 10);
      }
      myChar = ' ';
    }
  }
  if (Serial.available()) {    //시리얼모니터에 입력된 데이터가 있다면
    mySerial.write(Serial.read());  //블루투스를 통해 입력된 데이터 전달
  }

  if(digitalRead(motion_pin) == HIGH){ //움직임이 감지되었을때
    Serial.write("toilet");
    mySerial.write(" toilet");
    delay(60000); // 1분 대기
  }
}
