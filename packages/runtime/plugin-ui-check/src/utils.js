export class MoveAreaHelper {
  constructor(Debug) {
    this.systemInfo = Debug.store.sys.get();
    const { screenWidth, statusBarHeight, screenHeight } = this.systemInfo;

    if (Debug.getEnv() === Debug.ENV_TYPE.QQ) {
      this.systemInfo.safeArea = {
        left: 0,
        right: screenWidth,
        top: statusBarHeight,
        bottom: screenHeight,
        width: screenWidth,
        height: statusBarHeight - statusBarHeight
      };
    }
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
