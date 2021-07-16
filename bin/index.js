/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

//-----libs-begin-----
loadLib("libs/box2d.js")
//-----libs-end-------
loadLib("https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js");
loadLib("laya.js");
loadLib("libs/jszip.js")
loadLib("js/bundle.js");
