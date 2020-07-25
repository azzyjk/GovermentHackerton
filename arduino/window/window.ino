#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3);

int trig_pin = 8;
int echo_pin = 9;
int window_open = 0;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
  }
  mySerial.begin(9600);
  
  pinMode(trig_pin, OUTPUT);
  pinMode(echo_pin, INPUT);
}

void loop() {
  if (mySerial.available()) { //블루투스에서 넘어온 데이터가 있다면
    Serial.write(mySerial.read()); //시리얼모니터에 데이터를 출력
  }
  if (Serial.available()) {    //시리얼모니터에 입력된 데이터가 있다면
    mySerial.write(Serial.read());  //블루투스를 통해 입력된 데이터 전달
  }

  digitalWrite(trig_pin, HIGH);
  delay(10);
  digitalWrite(trig_pin, LOW);
  float duration = pulseIn(echo_pin, HIGH);
  float distance = duration / 58.8;

  if(distance > 5){
    if(window_open == 0){
      Serial.print(distance);
      Serial.print("OPEN\n");
      mySerial.write("O");
    }
    window_open = 1;
  }else{
    if(window_open == 1){
      Serial.print(distance);
      Serial.print("CLOSED\n");
      mySerial.write("C");
    }
    window_open = 0;
  }
}
