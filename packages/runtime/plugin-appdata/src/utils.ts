export const showToast = (options: WechatMiniprogram.ShowToastOption) => {
    return new Promise<void>((resolve, reject) => {
      wx.showToast({
        ...options,
        success: () => resolve(),
        fail: reject,
      });
    });
  };
  
  export const showModal = (options: WechatMiniprogram.ShowModalOption) => {
    return new Promise<WechatMiniprogram.ShowModalSuccessCallbackResult>((resolve, reject) => {
      wx.showModal({
        ...options,
        success: resolve,
        fail: reject,
      });
    });
  };
  
  export const showActionSheet = (options: WechatMiniprogram.ShowActionSheetOption) => {
    return new Promise<WechatMiniprogram.ShowActionSheetSuccessCallbackResult>((resolve, reject) => {
      wx.showActionSheet({
        ...options,
        success: resolve,
        fail: reject,
      });
    });
  };
  
  export const setClipboardData = (data: string) => {
    return new Promise<void>((resolve, reject) => {
      wx.setClipboardData({
        data,
        success: () => resolve(),
        fail: reject,
      });
    });
  }; 