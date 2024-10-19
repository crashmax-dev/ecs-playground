export class Keyboard {
  private static keyStates: { [key: string]: boolean } = {};

  public static keyPressed(key: string): boolean {
    return Keyboard.keyStates[key] || false;
  }

  public static keyDown(key: string): void {
    Keyboard.keyStates[key] = true;
  }

  public static keyUp(key: string): void {
    Keyboard.keyStates[key] = false;
  }
}

document.addEventListener('keydown', (event) => {
  Keyboard.keyDown(event.code);
});

document.addEventListener('keyup', (event) => {
  Keyboard.keyUp(event.code);
});
