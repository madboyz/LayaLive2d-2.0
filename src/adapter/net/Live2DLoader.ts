import { Live2DModel } from "../model/Live2DModel";
import { Live2DCubismFramework as cubismmodelsettingjson } from '../../framework/cubismmodelsettingjson';
import CubismModelSettingJson = cubismmodelsettingjson.CubismModelSettingJson;
import { Laya } from "Laya";
import { EventDispatcher } from "laya/events/EventDispatcher";
import { Loader } from "laya/net/Loader";
import { Handler } from "laya/utils/Handler";


export enum LoadStep {
    LoadAssets,
    LoadModel,
    WaitLoadModel,
    LoadExpression,
    WaitLoadExpression,
    LoadPhysics,
    WaitLoadPhysics,
    LoadPose,
    WaitLoadPose,
    SetupEyeBlink,
    SetupBreath,
    LoadUserData,
    WaitLoadUserData,
    SetupEyeBlinkIds,
    SetupLipSyncIds,
    SetupLayout,
    LoadMotion,
    WaitLoadMotion,
    CompleteInitialize,
    CompleteSetupModel,
    LoadTexture,
    WaitLoadTexture,
    CompleteSetup
}

export class Live2DLoader extends EventDispatcher {
    private _modelHomeDir: string;
    private _completeHandler: Handler;
    private _model: Live2DModel;
    public state: LoadStep;
    private _setting: CubismModelSettingJson;
    /**读取的所有的Json数据 */
    public jsonUrls: Array<string>;

    constructor() {
        super();
        this.jsonUrls = [];
    }
    /**
     * 直接loadzip文件
     * @param url 
     * @param complete 
     */
    public loadZipAssets(resPath: string, filedName: string, dirName: string, complete: Handler = null) {
        this._model = new Live2DModel();
        this._model._modelHomeDir = this._modelHomeDir = dirName;
        this._completeHandler = complete;

        this.jsonUrls.push(`${dirName}/${dirName}.model3.json`);
        var THIS = this;
        Laya.loader.load(`${resPath}/${filedName}`, Handler.create(this, (buffer: ArrayBuffer) => {
            let zip: JSZip = new JSZip(buffer);
            let isloaded = THIS.loadModel3JsonByFiles(zip.files);
            if (isloaded) {
                isloaded = THIS.setupModelByFiles(zip.files);
                if (isloaded) {
                    THIS.loadCubismExpressionByFiles(zip.files);
                    THIS.loadCubismPhysicsByFiles(zip.files);
                    THIS.loadCubismPoseByFiles(zip.files);
                    THIS.loadDetailsinitByFiles(zip.files);
                    THIS.loadDetailsinit2ByFiles(zip.files);
                    THIS.loadTextureByFiles(zip)
                }
            }





        }), null, Loader.BUFFER);
    }

    private textureCount = 0;
    public static readonly chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    public static btoa(input) {
        var str = String (input);
        for (
          // initialize result and counter
          var block, charCode, idx = 0, map = this.chars, output = '';
          // if the next str index does not exist:
          //   change the mapping table to "="
          //   check if d has no fractional digits
          str.charAt (idx | 0) || (map = '=', idx % 1);
          // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
          output += map.charAt (63 & block >> 8 - idx % 1 * 8)
        ) {
          charCode = str.charCodeAt (idx += 3 / 4);
          if (charCode > 0xFF) {
            throw new Error ("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
          }
          block = block << 8 | charCode;
        }
        return output;
      }

    private loadTextureByFiles(zip: JSZip) {
        let textureCount: number = this._setting.getTextureCount();
        this._model._textureUrls = [];
        let texturePath;
        var THIS = this;
        this.textureCount = textureCount;
        for (let i = 0; i < textureCount; i++) {
            texturePath = `${this._modelHomeDir}/${this._setting.getTextureFileName(i)}`;
            this._model._textureUrls.push({ url: texturePath, type: "nativeimage" });
            let file = zip.files[texturePath];
            if (file) {
                let bytes = file.asArrayBuffer();
                if (bytes) {
                    var image = new Laya.Browser.window.Image();
                    image.crossOrigin = "";
                    Laya.Loader.cacheRes(texturePath, image);
                    var onload = function (e) {
                        e.target.onerror = null;
                        e.target.onload = null;
                        THIS.checkTextureAllLoaded();
                    };
                    var onerror = function (e) {
                        e.target.onerror = null;
                        e.target.onload = null;
                    };
                    image.onerror = onerror;
                    image.onload = onload;
                    /**可以使用glTFBase64Tool.encode */
                    let binary = Laya.glTFBase64Tool.encode(bytes);
                    let pIndex = file.name.indexOf('.');
                    let type = file.name.substr(pIndex + 1);
                    let re = 'data:image/' + type + ';base64,'
                    image.src = re + binary;
                }
            }
        }
    }

    private checkTextureAllLoaded() {
        this.textureCount--;
        if (this.textureCount <= 0) {
            this._completeHandler && this._completeHandler.runWith([this._model, this]);
        }
    }

    private loadDetailsinit2ByFiles(files: any) {
        this._model.setupEyeBlinkIds();
        this._model.setupLipSyncIds();
        this._model.setupLayout();
        this._model.loadCubismMotion();
        if (this._model.allMotionCount) {
            this.preMotionUrls();
            for (let i = 0; i < this._model._motionUrls.length; i++) {
                const item = this._model._motionUrls[i];
                let file = files[item.url];
                if (file) {
                    let buffer = file.asArrayBuffer();
                    if (buffer) {
                        Laya.Loader.cacheRes(item.url, buffer);
                    }

                }
            }
            this._model.loadMotionGroup();
            this._model._motionUrls = null;
        }

    }

    private loadDetailsinitByFiles(files: any): boolean {
        let isLoad: boolean = false;
        this._model.setupEyeBlink();
        this._model.setupBreath();
        let userDataFile = this._setting.getUserDataFile();
        if (userDataFile != '') {
            let url = `${this._modelHomeDir}/${userDataFile}`;
            this.jsonUrls.push(url);
            let file = files[url];
            if (file) {
                let buffer = file.asArrayBuffer();
                if (buffer) {
                    this._model.loadUserData(buffer, buffer.byteLength);
                    isLoad = true;
                }
            }
        }
        return isLoad;
    }

    private loadModel3JsonByFiles(files: any): boolean {
        let isLoad: boolean = false;
        let file = files[this._modelHomeDir + "/" + this._modelHomeDir + ".model3.json"];
        if (file) {
            let buffer = file.asArrayBuffer();
            if (buffer) {
                this._model.createSetting(buffer);
                this._setting = this._model.setting;
                this.state = LoadStep.LoadModel;
                isLoad = true;
            }
        }
        return isLoad;
    }

    private setupModelByFiles(files: any): boolean {
        let isLoad: boolean = false;
        let modelFileName = this._setting.getModelFileName();
        let url = `${this._modelHomeDir}/${modelFileName}`;
        this.jsonUrls.push(url);
        let file = files[url];
        if (file) {
            let buffer = file.asArrayBuffer()
            this._model.loadModel(buffer);
            this.state = LoadStep.LoadExpression;
            isLoad = true;
        }
        else
            isLoad = true;
        return isLoad;
    }

    private loadCubismExpressionByFiles(files: any) {
        let expressionCount: number = this._setting.getExpressionCount();
        if (expressionCount > 0) {
            this._model._expressionUrls = [];
            this._model._expressionNames = [];
            let url: string;
            for (let i = 0; i < expressionCount; i++) {
                this._model._expressionNames.push(
                    this._setting.getExpressionName(i)
                );
                url = `${this._modelHomeDir}/${this._setting.getExpressionFileName(i)}`;
                this.jsonUrls.push(url);
                this._model._expressionUrls.push(
                    url
                );
            }
            this.state = LoadStep.WaitLoadExpression;
            for (let i = 0; i < expressionCount; i++) {
                let file = files[this._model._expressionUrls[i]];
                let buffer: ArrayBuffer = file.asArrayBuffer();
                if (!buffer) {
                    console.log(`[WARNNING]:${this._model._expressionUrls[i]} data load fail!`);
                } else
                    this._model.loadExpression(buffer, buffer.byteLength, this._model._expressionNames[i]);
            }
            this._model._expressionUrls = null;
        }
    }
    /**
    * 加载物理
    */
    private loadCubismPhysicsByFiles(files: any) {
        let physicsFileName: string = this._setting.getPhysicsFileName();
        if (physicsFileName != "") {
            let url = `${this._modelHomeDir}/${physicsFileName}`;
            this.jsonUrls.push(url);
            let file = files[url];
            if (file) {
                let buffer = file.asArrayBuffer();
                this._model.loadPhysics(buffer, buffer.byteLength);
            }
        }

    }

    private loadCubismPoseByFiles(files: any) {
        let poseFileName = this._setting.getPoseFileName();
        if (poseFileName != '') {
            let url = `${this._modelHomeDir}/${poseFileName}`;
            this.jsonUrls.push(url);
            let file = files[url];
            if (file) {
                let buffer = file.asArrayBuffer();
                this._model.loadPose(buffer, buffer.byteLength);
            }
        }
    }

    /**
     * 从放置model3.json的目录和文件路径生成模型
     * @param dir 
     * @param fileName 
     * @param complete 完成回调，失败时会返回null complete(model,thisloader)
     */
    public loadAssets(dir: string, fileName: string, complete: Handler = null): void {
        this._model = new Live2DModel();
        this._model._modelHomeDir = this._modelHomeDir = dir;
        this._completeHandler = complete;
        let url = `${dir}/${fileName}`;
        this.jsonUrls.push(url);
        Laya.loader.load(url, Handler.create(this, this._loadAssetsComplete), null, Loader.BUFFER);
    }

    private _loadAssetsComplete(buffer: ArrayBuffer) {
        if (!buffer) {
            console.error("loadAssets fail!");
            this._completeHandler && this._completeHandler.run();
            return;
        }
        this._model.createSetting(buffer);
        this._setting = this._model.setting;
        this.state = LoadStep.LoadModel;
        this.setupModel();
    }

    /**
     * 从model3.json生成模型。
     * 根据model3.json的描述生成模型，运动和物理等组件。
     */
    private setupModel() {
        let modelFileName = this._setting.getModelFileName();
        if (modelFileName != '') {
            this.state = LoadStep.WaitLoadModel;
            let url = `${this._modelHomeDir}/${modelFileName}`;
            this.jsonUrls.push(url);
            Laya.loader.load(url, Handler.create(this, this._setupModelComplete), null, Loader.BUFFER);
        } else {
            console.warn('Model data does not exist.');
        }
    }

    private _setupModelComplete(buffer: ArrayBuffer): void {
        if (!buffer) {
            console.error("loadModel fail!");
            this._completeHandler && this._completeHandler.run();
            return;
        }
        this._model.loadModel(buffer);
        this.state = LoadStep.LoadExpression;
        this.loadCubismExpression();
    }

    private loadCubismExpression(): void {
        let expressionCount: number = this._setting.getExpressionCount();
        if (expressionCount > 0) {
            this._model._expressionUrls = [];
            this._model._expressionNames = [];
            let url: string;
            for (let i = 0; i < expressionCount; i++) {
                this._model._expressionNames.push(
                    this._setting.getExpressionName(i)
                );
                url = `${this._modelHomeDir}/${this._setting.getExpressionFileName(i)}`;
                this.jsonUrls.push(url);
                this._model._expressionUrls.push(
                    url
                );
            }
            this.state = LoadStep.WaitLoadExpression;
            Laya.loader.load(this._model._expressionUrls, Handler.create(this, this._loadCubismExpressionComplete, [expressionCount]), null, Loader.BUFFER);
        } else {
            this.state = LoadStep.LoadPhysics;
            this.loadCubismPhysics();
        }
    }

    private _loadCubismExpressionComplete(count: number): void {
        for (let i = 0; i < count; i++) {
            let buffer: ArrayBuffer = Laya.loader.getRes(this._model._expressionUrls[i]);
            if (!buffer) {
                console.log(`[WARNNING]:${this._model._expressionUrls[i]} data load fail!`);
            } else
                this._model.loadExpression(buffer, buffer.byteLength, this._model._expressionNames[i]);
        }
        this._model._expressionUrls = null;
        this.state = LoadStep.LoadPhysics;
        this.loadCubismPhysics();
    }

    /**
     * 加载物理
     */
    private loadCubismPhysics(): void {
        let physicsFileName: string = this._setting.getPhysicsFileName();
        if (physicsFileName != '') {
            this.state = LoadStep.WaitLoadPhysics;
            let url = `${this._modelHomeDir}/${physicsFileName}`;
            this.jsonUrls.push(url);
            Laya.loader.load(url, Handler.create(this, this._loadCubismPhysicsComplete), null, Loader.BUFFER);
        } else {
            this.state = LoadStep.LoadPose;
            this.loadCubismPose();
        }
    }

    private _loadCubismPhysicsComplete(buffer: ArrayBuffer): void {
        if (!buffer) {
            console.log("[WARNNING]:Physics data load fail!");
        } else {
            this._model.loadPhysics(buffer, buffer.byteLength);
        }
        this.state = LoadStep.LoadPose;
        this.loadCubismPose();
    }
    /**
     * Pose
     */
    private loadCubismPose(): void {
        let poseFileName = this._setting.getPoseFileName();
        if (poseFileName != '') {
            this.state = LoadStep.WaitLoadPose;
            let url = `${this._modelHomeDir}/${poseFileName}`;
            this.jsonUrls.push(url);
            Laya.loader.load(url, Handler.create(this, this._loadCubismPoseComplete), null, Loader.BUFFER);
        } else {
            this.state = LoadStep.SetupEyeBlink;
            this.detailsinit();
        }
    }

    private _loadCubismPoseComplete(buffer: ArrayBuffer): void {
        if (!buffer) {
            console.log("[WARNNING]:Pose data load fail!");
        } else
            this._model.loadPose(buffer, buffer.byteLength);
        this.state = LoadStep.SetupEyeBlink;
        this.detailsinit();
    }

    private detailsinit(): void {
        this._model.setupEyeBlink();
        this.state = LoadStep.SetupBreath;
        this._model.setupBreath();
        this.state = LoadStep.LoadUserData;
        let userDataFile = this._setting.getUserDataFile();
        if (userDataFile != '') {
            this.state = LoadStep.WaitLoadUserData;
            let url = `${this._modelHomeDir}/${userDataFile}`;
            this.jsonUrls.push(url);
            Laya.loader.load(url, Handler.create(this, this._loadUserDataComplete), null, Loader.BUFFER);
        } else {
            this.state = LoadStep.SetupEyeBlinkIds;
            this.detailsinit2();
        }
    }

    private _loadUserDataComplete(buffer: ArrayBuffer): void {
        if (!buffer) {
            console.log("[WARNNING]:UserData load fail!");
        } else {
            this._model.loadUserData(buffer, buffer.byteLength);
        }
        this.state = LoadStep.SetupEyeBlinkIds;
        this.detailsinit2();
    }

    /**
     * 第二部分无加载初始化
     */
    private detailsinit2(): void {
        this._model.setupEyeBlinkIds()
        this.state = LoadStep.SetupLipSyncIds;
        this._model.setupLipSyncIds();
        this.state = LoadStep.SetupLayout;
        this._model.setupLayout();
        this.state = LoadStep.WaitLoadMotion;
        this._model.loadCubismMotion();
        if (this._model.allMotionCount) {
            this.preMotionUrls();
            this.state = LoadStep.LoadMotion;
            Laya.loader.load(this._model._motionUrls, Handler.create(this, this._preLoadMotionGroupComplete));
        } else {
            this.state = LoadStep.LoadTexture;
            this.loadTexture();
        }
    }

    /**
     * 准备motion路径Urls
     */
    public preMotionUrls(): void {
        this._model._motionUrls = [];
        let motionGroups = this._model._motionGroups;
        let group: string, count: number, motionFileName: string;
        for (let i = 0; i < motionGroups.length; i++) {
            group = motionGroups[i];
            count = this._setting.getMotionCount(group)
            for (let j = 0; j < count; j++) {
                motionFileName = `${this._modelHomeDir}/${this._setting.getMotionFileName(group, j)}`;
                this.jsonUrls.push(motionFileName);
                this._model._motionUrls.push({
                    url: motionFileName,
                    key: group,
                    index: j,
                    name: `${group}_${j}`,
                    type: Loader.BUFFER
                });
            }
        }
    }

    private _preLoadMotionGroupComplete(): void {
        this._model.loadMotionGroup();
        this._model._motionUrls = null;
        this.state = LoadStep.LoadTexture;
        this.loadTexture();
    }

    private loadTexture(): void {
        if (this.state !== LoadStep.LoadTexture) {
            return;
        }
        let textureCount: number = this._setting.getTextureCount();
        this._model._textureUrls = [];
        let texturePath;
        for (let i = 0; i < textureCount; i++) {
            texturePath = `${this._modelHomeDir}/${this._setting.getTextureFileName(i)}`;
            this._model._textureUrls.push({ url: texturePath, type: "nativeimage" });
        }
        Laya.loader.load(this._model._textureUrls.slice(), Handler.create(this, this.loadComplete))
    }
    /**
     * 整体加载完成
     */
    private loadComplete(): void {
        this.state = LoadStep.CompleteSetup;
        this._completeHandler && this._completeHandler.runWith([this._model, this]);
    }

    /**
     * 清理数据
     * @param clearJson 是否清理所有加载的json
     * @default true
     */
    public clear(clearJson: boolean = true): void {
        this._modelHomeDir = null
        this._setting = null;
        this._model = null;
        if (clearJson) {
            for (let index = 0; index < this.jsonUrls.length; index++) {
                let url = this.jsonUrls[index];
                Laya.loader.clearRes(url);
            }
        }
        this.jsonUrls.length = 0;;
        this.state = LoadStep.LoadAssets;
    }
}