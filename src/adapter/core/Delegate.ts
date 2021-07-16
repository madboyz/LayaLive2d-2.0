
import {
    Live2DCubismFramework as live2dcubismframework,
    Option as Csm_Option,
    LogLevel,
  } from '../../framework/live2dcubismframework';
import Csm_CubismFramework = live2dcubismframework.CubismFramework;

export class Delegate {
    private static _instance:Delegate;
    public static get instance():Delegate{
      if (!Delegate._instance) {
        Delegate._instance = new Delegate();
      }
      return Delegate._instance;
    }
    private _cubismOption:Csm_Option;
    constructor() {
        this._cubismOption = new Csm_Option();
    }

    /**
     * live2d framework 初始化
     * @param logFunction 输出方法
     * @param logginLevel 输出等级
     */
    public initializeCubism(logFunction = console.log,logginLevel:LogLevel = LogLevel.LogLevel_Verbose){
      // setup cubism
      this._cubismOption.logFunction = logFunction;
      this._cubismOption.loggingLevel = logginLevel;
      Csm_CubismFramework.startUp(this._cubismOption);
      // initialize cubism
      Csm_CubismFramework.initialize();
    }

    /**
     * 结束清理
     */
    public dispose(){
      Csm_CubismFramework.dispose();
    }
}