
import { Live2DCubismFramework as live2dcubismframework } from '../../framework/live2dcubismframework';
import { Live2DCubismFramework as cubismmotionmanager } from '../../framework/motion/cubismmotionmanager';
import { Live2DCubismFramework as cubismmodel } from '../../framework/model/cubismmodel';
import { Live2DCubismFramework as cubismid } from '../../framework/id/cubismid';
import { Live2DCubismFramework as cubismmodelmatrix } from '../../framework/math/cubismmodelmatrix';
import { Live2DCubismFramework as cubismmotion } from '../../framework/motion/cubismmotion';
import { Live2DCubismFramework as cubismexpressionmotion } from '../../framework/motion/cubismexpressionmotion';
import { Live2DCubismFramework as acubismmotion } from '../../framework/motion/acubismmotion';
import { Live2DCubismFramework as cubismmodelsettingjson } from '../../framework/cubismmodelsettingjson';
import { Live2DCubismFramework as cubismmoc } from '../../framework/model/cubismmoc';
import { Live2DCubismFramework as csmmap } from '../../framework/type/csmmap';
import { Live2DCubismFramework as cubismphysics } from '../../framework/physics/cubismphysics';
import { Live2DCubismFramework as cubismpose } from '../../framework/effect/cubismpose';
import { Live2DCubismFramework as cubismbreath } from '../../framework/effect/cubismbreath';
import { Live2DCubismFramework as cubismeyeblink } from '../../framework/effect/cubismeyeblink';
import { Live2DCubismFramework as csmvector } from '../../framework/type/csmvector';
import { Live2DCubismFramework as cubismdefaultparameterid } from '../../framework/cubismdefaultparameterid';
import { Live2DCubismFramework as cubismmodeluserdata } from '../../framework/model/cubismmodeluserdata';
import { Live2DCubismFramework as cubismmotionqueuemanager } from '../../framework/motion/cubismmotionqueuemanager';
import { Live2DCubismFramework as csmstring } from '../../framework/type/csmstring';
import { Live2DCubismFramework as cubismtargetpoint } from '../../framework/math/cubismtargetpoint';
import { Live2DCubismFramework as cubismrenderer_webgl } from '../render/Live2Drenderer';
import { Live2DCubismFramework as cubismmatrix44 } from '../../framework/math/cubismmatrix44';

import CubismRenderer_WebGL = cubismrenderer_webgl.CubismRenderer_WebGL;
import FinishedMotionCallback = acubismmotion.FinishedMotionCallback;
import CubismModelUserData = cubismmodeluserdata.CubismModelUserData;
import CubismIdHandle = cubismid.CubismIdHandle;
import Constant = live2dcubismframework.Constant;
import CubismMatrix44 = cubismmatrix44.CubismMatrix44;
import CubismPose = cubismpose.CubismPose;
import CubismMoc = cubismmoc.CubismMoc;
import CubismBreath = cubismbreath.CubismBreath;
import CubismMotionQueueManager = cubismmotionqueuemanager.CubismMotionQueueManager;
import CubismEyeBlink = cubismeyeblink.CubismEyeBlink;
import BreathParameterData = cubismbreath.BreathParameterData;
import CubismModelSettingJson = cubismmodelsettingjson.CubismModelSettingJson;
import ACubismMotion = acubismmotion.ACubismMotion;
import CubismModel = cubismmodel.CubismModel;
import csmVector = csmvector.csmVector;
import CubismMotion = cubismmotion.CubismMotion;
import CubismPhysics = cubismphysics.CubismPhysics;
import CubismExpressionMotion = cubismexpressionmotion.CubismExpressionMotion;
import CubismModelMatrix = cubismmodelmatrix.CubismModelMatrix;
import CubismFramework = live2dcubismframework.CubismFramework;
import csmMap = csmmap.csmMap;
import CubismDefaultParameterId = cubismdefaultparameterid;
import CubismMotionManager = cubismmotionmanager.CubismMotionManager;
import csmString = csmstring.csmString;
import CubismTargetPoint = cubismtargetpoint.CubismTargetPoint;

import { Live2DConfig } from '../core/Live2DConfig';
import { Live2DSubmit } from '../render/Live2DSubmit';
import { Sprite } from 'laya/display/Sprite';
import { Texture2D } from 'laya/resource/Texture2D';
import { Matrix } from 'laya/maths/Matrix';
import { Browser } from 'laya/utils/Browser';
import { Laya } from 'Laya';
import { WarpMode } from 'laya/resource/WrapMode';
import { TextureFormat } from 'laya/resource/TextureFormat';
import { Context } from 'laya/resource/Context';
import { Loader } from 'laya/net/Loader';
import { Event } from 'laya/events/Event';
import { Point } from 'laya/maths/Point';

/**
 * 继承自framework model，Laya封装加载
 */
export class Live2DModel extends Sprite{
  /** 计算用临时点 */
    static TEMPPOINT:Point = new Point();
    /**模型实例 */
    private _model:CubismModel;
    /**型号设定信息 */
    public setting:CubismModelSettingJson;
    /**Moc数据 */
    private _moc:CubismMoc;
    /**模型矩阵 */
    private _modelMatrix:CubismModelMatrix;
    /**加载的面部表情列表 */
    public _expressions = new csmMap<string, ACubismMotion>();
    public _expressionUrls:Array<string>;
    public _expressionNames:Array<string>;
    /**自动眨眼 */
    private _eyeBlink: CubismEyeBlink; 
    /**呼吸 */ 
    private _breath: CubismBreath; 
    /**加载动作列表 */
    public _motions = new csmMap<string, ACubismMotion>();
    /**需要加载的动作文件列表 */
    public _motionUrls:Array<{url:string,index:number,key:string,name:string,type:string}>;
    /**需要加载的动作分组列表 */
    public _motionGroups:Array<string>;
    /**物理相关 */
    private _physics:CubismPhysics;
    /**姿势管理 */
    private _pose: CubismPose;
    /**用户数据 */
    private _modelUserData: CubismModelUserData;
    /**文件夹路径 */
    public _modelHomeDir:string;
    /**  参数ID: ParamAngleX*/
    private _idParamAngleX: CubismIdHandle; 
    /**  参数ID: ParamAngleY*/
    private _idParamAngleY: CubismIdHandle; 
    /**  参数ID: ParamAngleZ*/
    private _idParamAngleZ: CubismIdHandle; 
    /**  参数ID: ParamEyeBallX*/
    private _idParamEyeBallX: CubismIdHandle; 
    /** 参数ID: ParamEyeBAllY*/
    private _idParamEyeBallY: CubismIdHandle; 
    /** 参数ID: ParamBodyAngleX*/
    private _idParamBodyAngleX: CubismIdHandle; 
    /**在模型中设置的眨眼功能的参数ID */
    private _eyeBlinkIds: csmVector<CubismIdHandle>
    /** 模型中设置的口型同步功能的参数ID */
    private _lipSyncIds: csmVector<CubismIdHandle>
    // 动作管理
    private _motionManager: CubismMotionManager; 
    // 表情管理
    private _expressionManager:CubismMotionManager;
    // 动作总数
    private _allMotionCount: number; 

    private _initialized = true;
    /**贴图urls */
    public _textureUrls:Array<any>;
    /**贴图池子 */
    public _texturePool:Array<Texture2D>;
    //鼠标拖动
    private _dragManager:CubismTargetPoint;
    // 增量时间积分值[秒]
    private _userTimeSeconds: number; 
    // 鼠标拖动的X位置
    private _dragX: number; 
    // 鼠标拖动的Y位置
    private _dragY: number; 
    // 是否嘴唇同步
    private _lipsync: boolean;
    // 渲染器
    private _renderer: CubismRenderer_WebGL; 
    /**还原矩阵*/
    private projection:CubismMatrix44;
    /**模型宽 */
    public modelWidth:number;
    /**模型高 */
    public modelHeight:number;
    /**模型x中心点 */
    public modelOriginX:number;
    /**模型y中心点 */
    public modelOriginY:number;
    /**缩放与平移矩阵 */
    private scaleAndTran: CubismMatrix44
    /**mvp矩阵 */
    private mvpMatrix:CubismMatrix44;
    /**记录矩阵 */
    private _lastMat:Matrix;
    /**默认的动画播放group 默认是获取到的第一个 */
    private _defaultGroup:string;
    /** 文件名映射列表 */
    private _fileMap:object;
    /**是否自动轮播默认组动画 */
    public isAutoPlay:boolean = true;

    private _needChanged = true;

    constructor(){
      super();
      this._fileMap = {};
      this.mouseThrough = false;
      this.mouseEnabled = true;
      this._userTimeSeconds = 0;
      this._lipsync = false;
      this._lastMat = new Matrix();
      this.customRenderEnable = true;
      this.scaleAndTran = new CubismMatrix44();
      this.projection = new CubismMatrix44();
      this._motionManager = new CubismMotionManager();
      this._motionManager.setEventCallback(
        Live2DModel.cubismDefaultMotionEventCallback,
        this
      );
      this._expressionManager = new CubismMotionManager();
      
      this._dragManager = new CubismTargetPoint();

      this._eyeBlinkIds = new csmVector<CubismIdHandle>();
      this._lipSyncIds = new csmVector<CubismIdHandle>();
      this._idParamAngleX = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamAngleX
      );
      this._idParamAngleY = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamAngleY
      );
      this._idParamAngleZ = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamAngleZ
      );
      this._idParamEyeBallX = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamEyeBallX
      );
      this._idParamEyeBallY = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamEyeBallY
      );
      this._idParamBodyAngleX = CubismFramework.getIdManager().getId(
        CubismDefaultParameterId.ParamBodyAngleX
      );

      Laya.stage.on(Event.RESIZE,this,this._onResize);
    }

    private _onResize(){
      this._needChanged = true;
    }

    /**
     * 加载模型数据 
     * @param buffer 从中读取moc3文件的缓冲区
     */
    public loadModel(buffer:ArrayBuffer):void{
      this._moc = CubismMoc.create(buffer);
      this._model = this._moc.createModel();
      this._model.saveParameters();

      if (this._moc == null || this._model == null) {
        console.warn('Failed to CreateModel().');
        return;
      }
      
      this._modelMatrix = new CubismModelMatrix(
        this._model.getCanvasWidth(),
        this._model.getCanvasHeight()
      );
    
      this.modelWidth = this._model.getModel().canvasinfo.CanvasWidth;
      this.modelHeight =  this._model.getModel().canvasinfo.CanvasHeight;
      this.modelOriginX = this._model.getModel().canvasinfo.CanvasOriginX;
      this.modelOriginY = this._model.getModel().canvasinfo.CanvasOriginY;
      
      this._needChanged = true;
      this.width = this.modelWidth;
      this.height = this.modelHeight;
    } 

    public createSetting(buffer:ArrayBuffer):void{
      this._initialized = false;
      this.setting = new CubismModelSettingJson(buffer,buffer.byteLength);
    }

    /**
     * 载入运动数据
     * @param buffer 读取motion3.json文件的缓冲区
     * @param size 缓冲区大小
     * @param name 动作的名称
     * @param onFinishedMotionHandler 动态播放结束时调用的回调函数
     * @return 运动节点
     */
    public loadMotion(
        buffer: ArrayBuffer,
        size: number,
        onFinishedMotionHandler?: any
      ) :CubismMotion{
          return CubismMotion.create(buffer, size, onFinishedMotionHandler);
    } 

    /**
     * 读取面部表情数据
     * @param buffer 读取exp文件的缓冲区
     * @param size 缓冲区大小
     * @param name 表情名字
     */
    public loadExpression(
        buffer: ArrayBuffer,
        size: number,
        name:string
      ): void {
        let motion: ACubismMotion = CubismExpressionMotion.create(buffer, size);
        if (this._expressions.getValue(name) != null) {
          ACubismMotion.delete(
            this._expressions.getValue(name)
          );
          this._expressions.setValue(name, null);
        }
        this._expressions.setValue(name, motion);
    }
    
    /**
     * 读取附加到模型的用户数据
     * @param buffer 读取userdata3.json的缓冲区
     * @param size 缓冲区大小
     */
    public loadUserData(buffer: ArrayBuffer, size: number): void {
      this._modelUserData = CubismModelUserData.create(buffer, size);
    }

    /**
     *读取物理数据
     * @param buffer 加载physics3.json的缓冲区
     * @param size 缓冲区大小
     */
    public loadPhysics(buffer: ArrayBuffer, size: number): void {
      this._physics = CubismPhysics.create(buffer, size);
    }
    /**
     *读取姿势数据
     * @param buffer 加载pose3.json的缓冲区
     * @param size 缓冲区大小
     */
    public loadPose(buffer: ArrayBuffer, size: number): void {
      this._pose = CubismPose.create(buffer, size);
    }

    public setupEyeBlink():void{
      if (this.setting.getEyeBlinkParameterCount()>0) {
        this._eyeBlink = CubismEyeBlink.create(this.setting);
      }
    }

    public setupBreath():void{
      this._breath = CubismBreath.create();

      let breathParameters: csmVector<BreathParameterData> = new csmVector();
      breathParameters.pushBack(
        new BreathParameterData(this._idParamAngleX, 0.0, 15.0, 6.5345, 0.5)
      );
      breathParameters.pushBack(
        new BreathParameterData(this._idParamAngleY, 0.0, 8.0, 3.5345, 0.5)
      );
      breathParameters.pushBack(
        new BreathParameterData(this._idParamAngleZ, 0.0, 10.0, 5.5345, 0.5)
      );
      breathParameters.pushBack(
        new BreathParameterData(this._idParamBodyAngleX, 0.0, 4.0, 15.5345, 0.5)
      );
      breathParameters.pushBack(
        new BreathParameterData(
          CubismFramework.getIdManager().getId(
            CubismDefaultParameterId.ParamBreath
          ),
          0.0,
          0.5,
          3.2345,
          0.5
        )
      );
      this._breath.setParameters(breathParameters);
    }
    
    public setupEyeBlinkIds():void{
      let eyeBlinkIdCount: number = this.setting.getEyeBlinkParameterCount();
      for (let i = 0; i < eyeBlinkIdCount; ++i) {
        this._eyeBlinkIds.pushBack(this.setting.getEyeBlinkParameterId(i));
      }
    }

    public setupLipSyncIds (): void{
      let lipSyncIdCount = this.setting.getLipSyncParameterCount();
      for (let i = 0; i < lipSyncIdCount; ++i) {
        this._lipSyncIds.pushBack(this.setting.getLipSyncParameterId(i));
      }
    }

    public setupLayout():void{
      let layout: csmMap<string, number> = new csmMap<string, number>();
      this.setting.getLayoutMap(layout);
      this._modelMatrix.setupFromLayout(layout);
    }

    // Motion
    public loadCubismMotion():void{
      this._model.saveParameters();
      this._allMotionCount = 0;
      let motionGroupCount: number = this.setting.getMotionGroupCount();
      //如果有动作
      if (motionGroupCount) {
        this._motionGroups = [];
        // 查找动作总数
        let group;
        for (let i = 0; i < motionGroupCount; i++) {
          group = this.setting.getMotionGroupName(i);
          this._motionGroups.push(group);
          this._allMotionCount += this.setting.getMotionCount(group);
        }
        this._defaultGroup = this._motionGroups[0];
      }
    }

    /**
     * 从组名中批量加载运动数据。
     * 运动数据的名称是从ModelSetting内部获取的。
     */
    public loadMotionGroup():void{
      let element ,buffer:ArrayBuffer;
      for (let i = 0; i < this._motionUrls.length; i++) {
        element = this._motionUrls[i];
        this.createMotion(element.name,element.url,element.key,element.index);
      }
    }

    
    /**
     * 创建一个动作
     * @param name 名称，name为null是不会记录缓存
     * @param url 动画地址
     * @param group 动画分组
     * @param index 动画分组索引
     */
    private createMotion(name:string,url:string,group:string,index:number):CubismMotion{
        let buffer = Laya.loader.getRes(url);
        if (!buffer||!(buffer instanceof ArrayBuffer)) {
          console.warn(`createMotion fail! filename: ${url}, name:${name},group:${group},index:${index}`);
          return;
        }
        let strs = url.split("/");
        let filename = strs[strs.length-1].split(".")[0];
        this._fileMap[group+ "_"+ filename] = index;
        let tmpMotion:CubismMotion = this.loadMotion(buffer,buffer.byteLength);

        let fadeTime = this.setting.getMotionFadeInTimeValue(group, index);
        if (fadeTime >= 0.0) {
          tmpMotion.setFadeInTime(fadeTime);
        }

        fadeTime = this.setting.getMotionFadeOutTimeValue(group, index);
        if (fadeTime >= 0.0) {
          tmpMotion.setFadeOutTime(fadeTime);
        }
        tmpMotion.setEffectIds(this._eyeBlinkIds, this._lipSyncIds);

        if (name) {
          if (this._motions.getValue(name) != null) {
            ACubismMotion.delete(this._motions.getValue(name));
          }
          this._motions.setValue(name, tmpMotion);
        }
        if (Live2DConfig.debugMode) {
          console.log(`[APP]load motion: ${url} => [${group}_${index}]`);
        }
        return tmpMotion;
    }
    
    /**
     * 加载完成 init模型
     * @param isPremultipliedAlpha 是否预乘Alpha, default：true
     */
    public initModel(isPremultipliedAlpha:boolean = true):void{
      // 全てのモーションを停止する
      this._motionManager.stopAllMotions();
      this._initialized = true;
      this.createRenderer();
      this.renderer.setClipRect(0,0,Laya.stage.width,Laya.stage.height);
      this._texturePool = [];
      let element:any,texture:Texture2D,img:any;
      for (let index = 0; index < this._textureUrls.length; index++) {
        element = this._textureUrls[index];
        img = Laya.loader.getRes(element.url);
        texture = new Texture2D(img.width,img.height,TextureFormat.R8G8B8A8,true,false);
        texture.wrapModeU = WarpMode.Clamp;
        texture.wrapModeV = WarpMode.Clamp;
        texture.loadImageSource(img,isPremultipliedAlpha);
        texture._setCreateURL(img.src);
        if (!texture) {
          console.warn("Texture load fail! url:"+element);
          return
        }
        this.renderer.bindTexture(index,(texture as any)._glTexture);
        texture.lock = true;
        this._texturePool[index] = texture;
      }
      this.renderer.setIsPremultipliedAlpha(isPremultipliedAlpha);
    }
    
    public customRender(context:Context,x:number,y:number){
      let _cMat:Matrix = (context as any)._curMat;
      if(this._lastMat.a != _cMat.a){
        this._lastMat.a = _cMat.a;
        this._needChanged = true;
      } 
      if(this._lastMat.d != _cMat.d){
        this._lastMat.d = _cMat.d;
        this._needChanged = true;
      }
      if(_cMat.tx  + _cMat.a * x!= this._lastMat.tx ){
        this._lastMat.tx = _cMat.tx + _cMat.a *x;
        this._needChanged = true;
      }
      if(this._lastMat.ty  != _cMat.ty + _cMat.d * y){
        this._lastMat.ty = _cMat.ty + _cMat.d * y;
        this._needChanged = true;
      }
      this.refreshScaleAndTranM();
      context.addRenderObject(Live2DSubmit.create(this));
      context.breakNextMerge();
    }
    /**
     * 动画更新
     * @param deltaTimeSeconds 更新时间
     */
    public update(deltaTimeSeconds:number):void{
      this._userTimeSeconds += deltaTimeSeconds;
      this._dragManager.update(deltaTimeSeconds);
      this._dragX = this._dragManager.getX();
      this._dragY = this._dragManager.getY();
      // モーションによるパラメータ更新の有無
      let motionUpdated = false;

      //--------------------------------------------------------------------------
      this._model.loadParameters(); // 前回セーブされた状態をロード
      if (this._motionManager.isFinished()) {
        // 如果没有动作播放，则从待机动作中随机播放
        if(this.isAutoPlay){
          this.startRandomMotion(
            this._defaultGroup,
            3
          );
        }
      } else {
        motionUpdated = this._motionManager.updateMotion(
          this._model,
          deltaTimeSeconds
        ); // モーションを更新
      }
      this._model.saveParameters(); // 状態を保存
      //--------------------------------------------------------------------------

      // まばたき
      if (!motionUpdated) {
        if (this._eyeBlink != null) {
          // メインモーションの更新がないとき
          this._eyeBlink.updateParameters(this._model, deltaTimeSeconds); // 目パチ
        }
      }

      if (this._expressionManager != null) {
        this._expressionManager.updateMotion(this._model, deltaTimeSeconds); // 表情でパラメータ更新（相対変化）
      }

      // ドラッグによる変化
      // ドラッグによる顔の向きの調整
      this._model.addParameterValueById(this._idParamAngleX, this._dragX * 30); // -30から30の値を加える
      this._model.addParameterValueById(this._idParamAngleY, this._dragY * 30);
      this._model.addParameterValueById(
        this._idParamAngleZ,
        this._dragX * this._dragY * -30
      );

      // ドラッグによる体の向きの調整
      this._model.addParameterValueById(
        this._idParamBodyAngleX,
        this._dragX * 10
      ); // -10から10の値を加える

      // ドラッグによる目の向きの調整
      this._model.addParameterValueById(this._idParamEyeBallX, this._dragX); // -1から1の値を加える
      this._model.addParameterValueById(this._idParamEyeBallY, this._dragY);

      // 呼吸など
      if (this._breath != null) {
        this._breath.updateParameters(this._model, deltaTimeSeconds);
      }

      // 物理演算の設定
      if (this._physics != null) {
        this._physics.evaluate(this._model, deltaTimeSeconds);
      }

      // 嘴唇同步设置
      if (this._lipsync) {
        let value = 0; // 要进行实时唇形同步，请从系统获取音量并输入0到1之间的值。

        for (let i = 0; i < this._lipSyncIds.getSize(); ++i) {
          this._model.addParameterValueById(this._lipSyncIds.at(i), value, 0.8);
        }
      }

      // ポーズの設定
      if (this._pose != null) {
        this._pose.updateParameters(this._model, deltaTimeSeconds);
      }

      this.mvpMatrix = this.scaleAndTran.clone();
      this.mvpMatrix.multiplyByMatrix(this.projection);
      this._model.update();
      this.renderer.setMvpMatrix(this.mvpMatrix);
      // 通过画布尺寸
      this._renderer.doDrawModel();
    }

    /**
     * 重新生成缩放与位移矩阵
     */
    public refreshScaleAndTranM(){
      if (!this._needChanged) {
        return
      }
      this._needChanged = false;

      let width = Browser.mainCanvas.width;
      let height = Browser.mainCanvas.height;
      let scaleNum :number 
      if(this.modelHeight > this.modelWidth){
        scaleNum= this.modelWidth * 2 / width;
      }else{
        scaleNum = this.modelHeight *2 / width;
      }
      this.projection.scale(scaleNum , scaleNum * width/height);

      let a = this._lastMat.a ,d = this._lastMat.d,x = this._lastMat.tx,y = this._lastMat.ty;
      this.scaleAndTran.scale(a,d);
      let canvasx = (x  + a * ( this.modelOriginX - this.pivotX)) * 2 / width -1;
      let canvasy = 1 - (y  + d * (this.modelOriginY - this.pivotY)) * 2 / height;
      this.scaleAndTran.translate(canvasx,canvasy);
    } 
    
    public set defaultGroup(group:string) {
      if (group != this._defaultGroup) {
        if (this._defaultGroup.indexOf(group) == -1) {
          console.log("Can not find Motion Group:",group);
          this._defaultGroup = group;
        }
      }
    }

    public get defaultGroup():string{
      return this._defaultGroup;
    }
    /**
     * 渲染器获取，不推荐获取去使用结果不可控
     * @return CubismRenderer_WebGL
     */
    public get renderer(): CubismRenderer_WebGL {
      return this._renderer;
    }

    /**
     * 创建渲染器并执行初始化
     */
    public createRenderer(): void {
      if (this._renderer) {
        this.deleteRenderer();
      }

      this._renderer = new CubismRenderer_WebGL();
      this._renderer.initialize(this._model);
      this._renderer.owner = this;
    }

    /**
     * レンダラの解放
     */
    public deleteRenderer(): void {
      if (this._renderer != null) {
        this._renderer.release();
        this._renderer = null;
      }
    }

    /**
     * live2d model获取
     * @return CubismModel
     */
    public getModel():CubismModel{
      return this._model;
    }

    /**
     * @readonly
     * 动作管理
     */
    public get motionManager():CubismMotionManager{
      return this._motionManager;
    }

    /**
     * @readonly
     * 表情管理
     */
    public get expressionManager():CubismMotionManager{
      return this._expressionManager;
    }

    /**
     * @readonly
     * 获取Live2D物理
     */
    public get physics():CubismPhysics{
      return this._physics;
    }

    /**
     * @readonly
     * 拖动管理
     */
    public get dragManager(){
      return this._dragManager;
    }
    /**
     * @readonly
     * 动作总数
     */
    public get allMotionCount():number{
      return this._allMotionCount;
    }

    /**
     * 是否开启嘴唇同步
     */
    public get lipsync():boolean{
      return this._lipsync;
    }
    /**
     * 是否开启嘴唇同步
     */
    public set lipsync(value:boolean){
      this._lipsync = value;
    }
    /**
     * 设置鼠标拖动信息
     * @param 拖动光标的X位置
     * @param 拖动光标的Y位置
     */
    public setDragging(x: number, y: number): void {
      let point = Live2DModel.TEMPPOINT.setTo(x,y);
      this.changeToRenderPoint(point)
      this._dragManager.set(point.x, point.y);
    }

    /**
     * 引数で指定したモーションの再生を開始する
     * @param group モーショングループ名
     * @param no グループ内の番号
     * @param priority 優先度
     * @param onFinishedMotionHandler モーション再生終了時に呼び出されるコールバック関数
     * @return 開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するisFinished()の引数で使用する。開始できない時は[-1]
     */
    public startMotion(
      group: string,
      no: number,
      priority: number,
      onFinishedMotionHandler?: FinishedMotionCallback
    ): any {
      if (priority == 3) {
        this._motionManager.setReservePriority(priority);
      } else if (!this._motionManager.reserveMotion(priority)) {
        console.warn("[APP]can't start motion.");
        return -1;
      }
      // ex) idle_0
      let motion: CubismMotion = this.getMotion(group,no) as CubismMotion;
      let autoDelete = false;
      
      if (motion == null) {
        let motionFileName = this.setting.getMotionFileName(group, no);
          motion = this.createMotion(null,`${this._modelHomeDir}/${motionFileName}`,group,no);
          if (!motion) {
            console.warn("[APP]can't start motion.");
            return -1;
          }
          autoDelete = true; // 終了時にメモリから削除
      } else {
        motion.setFinishedMotionHandler(onFinishedMotionHandler);
      }
      if (Live2DConfig.debugMode) {
        console.log(`[APP]start motion: [${group}_${no}`);
      }
      return this._motionManager.startMotionPriority(
        motion,
        autoDelete,
        priority
      );
    }

    /**
     * 通过分组+文件名来播放动作
     * @param group モーショングループ名
     * @param filename 文件名
     * @param priority 優先度
     * @param onFinishedMotionHandler モーション再生終了時に呼び出されるコールバック関数
     * @return 開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するisFinished()の引数で使用する。開始できない時は[-1]
     */
    public startMotionByName(
      group: string,
      filename: string,
      priority: number,
      onFinishedMotionHandler?: FinishedMotionCallback
    ): any {
      if (priority == 3) {
        this._motionManager.setReservePriority(priority);
      } else if (!this._motionManager.reserveMotion(priority)) {
        console.warn("[APP]can't start motion.");
        return -1;
      }
      let motion: CubismMotion = this.getMotionByFileName(group,filename) as CubismMotion;
      
      if (motion == null) {
          console.warn("[APP]can't start motion.");
          return -1;
      } else {
        motion.setFinishedMotionHandler(onFinishedMotionHandler);
      }
      
      if (Live2DConfig.debugMode) {
        console.log(`[APP]start motion: [${group}_${filename}`);
      }

      return this._motionManager.startMotionPriority(
        motion,
        false,
        priority
      );
    }
    
    /**
     * 通过分组与编号获取当前动作池中的原生对象
     * @param group 动作分组
     * @param index 动作索引
     */
    public getMotion(group:string,index:number):ACubismMotion{
      return this._motions.getValue(`${group}_${index}`);
    }

    /**
     * 通过动作文件名获取当前对象池中的原生对象
     * @param group 
     * @param filename 
     */
    public getMotionByFileName(group:string,filename:string):ACubismMotion{
      return this._motions.getValue(`${group}_${this._fileMap[group+"_"+filename]}`);
    }
    /**
     * 开始播放随机选择的动作。
     * @param group 运动组名称
     * @param priority 優先度
     * @param onFinishedMotionHandler 动态播放结束时调用的回调函数
     * @return 返回开始的动作的标识号。 在isFinished（）的参数中使用它来确定单个运动是否已完成。 如果无法启动[-1]
     */
    public startRandomMotion(
      group: string,
      priority: number,
      onFinishedMotionHandler?: FinishedMotionCallback
    ): any {
      if (this.setting.getMotionCount(group) == 0) {
        return -1;
      }

      let no: number = Math.floor(
        Math.random() * this.setting.getMotionCount(group)
      );

      return this.startMotion(group, no, priority, onFinishedMotionHandler);
    }

    /**
     * 通过动作名字获取当前动作池中的原生对象
     * @param expressionId 表情动作ID
     */
    public getExpression(expressionId:string):ACubismMotion{
      return this._expressions.getValue(expressionId);
    }

    /**
     * 设置参数指定的面部表情运动
     * @param expressionId 表情动作ID
     */
    public setExpression(expressionId: string): void {
      const motion: ACubismMotion = this.getExpression(expressionId);
      if (motion != null) {
        this._expressionManager.startMotionPriority(
          motion,
          false,
          3
        );
      } else {
          console.warn(`[APP]expression[${expressionId}] is null`);
      }
    }

    /**
     * 设置随机选择的面部表情动作
     */
    public setRandomExpression(): void {
      if (this._expressions.getSize() == 0) {
        return;
      }

      const no: number = Math.floor(Math.random() * this._expressions.getSize());

      for (let i = 0; i < this._expressions.getSize(); i++) {
        if (i == no) {
          let name: string = this._expressions._keyValues[i].first;
          this.setExpression(name);
          return;
        }
      }
    }
    /**
     * 转换为渲染点
     * @param point 
     */
    public changeToRenderPoint(form:Point,out:Point = null):Point{
      if(!out){
        out = form;
      }else{
        out.setTo(form.x,form.y);
      }

      let cheight = Browser.mainCanvas.height,cwidth = Browser.mainCanvas.width;
      out.x = out.x / Laya.stage.width * cwidth;
      out.y = out.y / Laya.stage.height * cheight;

      out.x = out.x * 2 / cwidth - 1;
      out.y = 1 - out.y * 2 / cheight ;

      let tx: number = this.projection.invertTransformX(this.scaleAndTran.invertTransformX(out.x));
      let ty: number = this.projection.invertTransformY(this.scaleAndTran.invertTransformY(out.y));
      out.setTo(tx,ty);
      return out;
    }
    /**
     * 当たり判定テスト
     * 指定ＩＤの頂点リストから矩形を計算し、座標をが矩形範囲内か判定する。
     *
     * @param hitArenaName  当たり判定をテストする対象のID
     * @param x             判定を行うX座標
     * @param y             判定を行うY座標
     */
    public live2DHitTest(hitArenaName: string, x: number, y: number):boolean{
      if (!this.hitTestPoint(x,y)) {
        return false;
      }
      let point= Live2DModel.TEMPPOINT.setTo(x,y);
      this.changeToRenderPoint(point)
      let count: number = this.setting.getHitAreasCount();
      for (let i = 0; i < count; i++) {
        if ( this.setting.getHitAreaName(i) == hitArenaName) {
          const drawId: CubismIdHandle = this.setting.getHitAreaId(i);
          return this.live2DIsHit(drawId, point.x, point.y);
        }
      }
      return false;
    }

    /**
     * 当たり判定の取得
     * @param drawableId 検証したいDrawableのID
     * @param pointX X位置
     * @param pointY Y位置
     * @return true ヒットしている
     * @return false ヒットしていない
     */
    public live2DIsHit(
      drawableId: CubismIdHandle,
      pointX: number,
      pointY: number
    ): boolean {
      
      const drawIndex: number = this._model.getDrawableIndex(drawableId);

      if (drawIndex < 0) {
        return false; // 存在しない場合はfalse
      }

      const count: number = this._model.getDrawableVertexCount(drawIndex);
      const vertices: Float32Array = this._model.getDrawableVertices(drawIndex);

      let left: number = vertices[0];
      let right: number = vertices[0];
      let top: number = vertices[1];
      let bottom: number = vertices[1];

      for (let j = 1; j < count; ++j) {
        const x = vertices[Constant.vertexOffset + j * Constant.vertexStep];
        const y = vertices[Constant.vertexOffset + j * Constant.vertexStep + 1];

        if (x < left) {
          left = x; // Min x
        }

        if (x > right) {
          right = x; // Max x
        }

        if (y < top) {
          top = y; // Min y
        }

        if (y > bottom) {
          bottom = y; // Max y
        }
      }
      return left <= pointX && pointX <= right && top <= pointY && pointY <= bottom;
    }
    /**
     * 清理
     */
    private release():void{
      if (this._motionManager != null) {
        this._motionManager.release();
        this._motionManager = null;
      }

      if (this._expressionManager != null) {
        this._expressionManager.release();
        this._expressionManager = null;
      }

      if (this._moc != null) {
        this._moc.deleteModel(this._model);
        this._moc.release();
        this._moc = null;
      }
      this._motionGroups = null;
      this._motionUrls = null;
      this._textureUrls = null;
      this._expressionNames = null;
      this._expressionUrls = null;
      this._modelMatrix = null;

      for (let i = 0; i < this._texturePool.length; i++) {
        let tex = this._texturePool[i];
        tex.destroy();
        Loader.clearRes(tex.url);
      }
      this._texturePool = null;
      CubismPose.delete(this._pose);
      CubismEyeBlink.delete(this._eyeBlink);
      CubismBreath.delete(this._breath);

      this._dragManager = null;
      
      CubismPhysics.delete(this._physics);
      CubismModelUserData.delete(this._modelUserData);
    }
    /**
     * @inheritdoc
     * @param destroyTexture 是否销毁
     */
    public destroy(destroyTexture:boolean = true,destroyChildren?:boolean):void{
      if(this.destroyed)
        return;
      Laya.stage.off(Event.RESIZE,this,this._onResize);
      super.destroy(destroyChildren);
      this.release();
      this._pose = null;
      this._eyeBlink = null;
      this._breath = null;
      this._physics = null;
      this._modelUserData = null;
    }

    /**
     * 事件触发时的标准处理
     * 在播放过程中出现事件时进行处理。
     * 假定被继承覆盖。
     * 如果未覆盖，则输出日志。
     * @param eventValue 触发事件的字符串数据
     */
    public motionEventFired(eventValue: csmString): void {
      this.event(Event.CHANGE,eventValue.s);
    }

    /**
     * 活动回调
     * 回调以在CubismMotionQueueManager中注册事件。
     * @param caller Motion经理管理触发的事件，以进行比较
     * @param eventValue 触发事件的字符串数据
     * @param customData CubismUserModel
     */
    public static cubismDefaultMotionEventCallback(
      caller: CubismMotionQueueManager,
      eventValue: csmString,
      customData: Live2DModel
    ):void{
      customData.motionEventFired(eventValue);
    }
}