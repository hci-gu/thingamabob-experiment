const int LED_PIN = 5;
const int BUTTON_PIN = 0;
const int START_PIN = 2;    // grey
const int STOP_PIN = 4;     // red

void setup()
{
    pinMode(LED_PIN, OUTPUT);
    pinMode(BUTTON_PIN, INPUT_PULLUP);
    pinMode(START_PIN, INPUT_PULLUP);
    pinMode(STOP_PIN, INPUT_PULLUP);
    Serial.begin(115200);
}

void loop()
{
  int start;

  Serial.println("event: ready");

  waitOnStart:
  while(digitalRead(START_PIN) == LOW);

  Serial.println("event: start");
  start = millis();

  while(digitalRead(STOP_PIN) == HIGH) {
    if (digitalRead(START_PIN) == LOW) goto waitOnStart;
  }

  int duration = millis() - start;

  Serial.print("event: time ");

  Serial.println(duration);

  delay(1000);
}
