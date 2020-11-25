import Debug from '@we-debug/core';

const store = Debug.store;

export class MoveAreaHelper {
  constructor() {
    this.systemInfo = store.sys.get();
  }

  getLeft() {
    return this.systemInfo.safeArea.left;
  }

  getWidth() {
    return this.systemInfo.safeArea.width;
  }

  getTop(reservedDistance) {
    const { windowHeight, screenHeight } = this.systemInfo;
    return windowHeight - screenHeight - reservedDistance;
  }

  getHeight(reservedDistance) {
    const { screenHeight } = this.systemInfo;
    return screenHeight + reservedDistance * 2;
  }
}
