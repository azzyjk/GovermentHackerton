#include <SoftwareSerial.h>

SoftwareSerial mySerial(2, 3);

int inner_trig = 8;
int inner_echo = 9;
int outer_trig = 10;
int outer_echo = 11;

int inner_detected = 0;
int outer_detected = 0;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
  }
  mySerial.begin(9600);

  pinMode(inner_trig, OUTPUT);
  pinMode(inner_echo, INPUT);
  pinMode(outer_trig, OUTPUT);
  pinMode(outer_echo, INPUT);
  
}

void loop() { 
  if (mySerial.available()) { //블루투스에서 넘어온 데이터가 있다면
    Serial.write(mySerial.read()); //시리얼모니터에 데이터를 출력
  }
  if (Serial.available()) {    //시리얼모니터에 입력된 데이터가 있다면
    mySerial.write(Serial.read());  //블루투스를 통해 입력된 데이터 전달
  }

  //안쪽 초음파 센서 거리 측정
  digitalWrite(inner_trig, HIGH);
  delay(10);
  digitalWrite(inner_trig, LOW);
  float inner_duration = pulseIn(inner_echo, HIGH);
  float inner_distance = inner_duration / 58.8;

<<<<<<< HEAD:arduino/door/door.ino
  if(inner_distance < 100){
=======
  //바깥쪽 초음파 센서 거리 측정
  digitalWrite(outer_trig, HIGH);
  delay(10);
  digitalWrite(outer_trig, LOW);
  float outer_duration = pulseIn(outer_echo, HIGH);
  float outer_distance = outer_duration / 58.8;
  
  //바깥쪽 초음파 센서에서 먼저 탐지된 이후, 안쪽 초음파 센서에서 탐지되면 들어온것으로 판정
  if(inner_distance < 10){
>>>>>>> b819425d21e3580044abde96bc2114cfc0031a20:arduino/door.ino/door.ino.ino
    if(inner_detected + outer_detected == 0){
      inner_detected = 1;
    }else if(outer_detected == 1){
      Serial.print("IN \n");
      mySerial.write(" IN");
      inner_detected = 0;
      outer_detected =0;
    }
  }
<<<<<<< HEAD:arduino/door/door.ino

  digitalWrite(outer_trig, HIGH);
  delay(10);
  digitalWrite(outer_trig, LOW);
  float outer_duration = pulseIn(outer_echo, HIGH);
  float outer_distance = outer_duration / 58.8;

  if(outer_distance < 100){
=======
  
  //안쪽 초음파 센서에서 먼저 탐지된 이후, 바깥쪽 초음파 센서에서 탐지되면 나간것으로 판정
  if(outer_distance < 10){
>>>>>>> b819425d21e3580044abde96bc2114cfc0031a20:arduino/door.ino/door.ino.ino
    if(inner_detected + outer_detected == 0){
      outer_detected = 1;
    }else if(inner_detected == 1){
      Serial.print("OUT \n");
      mySerial.write(" OUT");
      inner_detected = 0;
      outer_detected = 0;
    }
  }
}
