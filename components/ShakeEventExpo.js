import { Accelerometer } from 'expo-sensors';

const THRESHOLD = 150;

class ShakeEventExpo {
  static addListener(handler) {
    this.accelerometerSubscription = Accelerometer.addListener(
      (accelerometerData) => {
        const { x, y, z } = accelerometerData;
        const totalForce = Math.sqrt(x * x + y * y + z * z);

        if (totalForce > THRESHOLD) {
          handler();
        }
      }
    );

    Accelerometer.setUpdateInterval(100);
  }

  static removeListener() {
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.remove();
      this.accelerometerSubscription = null;
    }
  }
}

export { ShakeEventExpo };
