import { Delegate } from "./Adapter/core/Delegate";
import { Live2DLoader } from "./Adapter/net/Live2DLoader";
import { Live2DModel } from "./Adapter/model/Live2DModel";

import { Live2DCubismFramework as Live2Drenderer } from "./Adapter/render/Live2Drenderer";
import { Live2DCubismFramework as cubismphysics } from "./framework/physics/cubismphysics";
import { Live2DCubismFramework as cubismvector2 } from './framework/math/cubismvector2';
import CubismShader_Laya = Live2Drenderer.CubismShader_Laya;
import { Config } from "Config";
import { Laya } from "Laya";
import { Box } from "laya/ui/Box";
import { Stage } from "laya/display/Stage";
import { Handler } from "laya/utils/Handler";
import { Event } from "laya/events/Event";
import { Sprite } from "laya/display/Sprite";
import { Widget } from "laya/ui/Widget";
import { Browser } from "laya/utils/Browser";


class Live2DDemo {
	private _model: Live2DModel;
	private _modelurls = [
		"Haru", "Hiyori", "Mark", "Natori", "Rice"
	];
	private index: number = 2;
	private sp: Box;
	constructor() {
		Config.useRetinalCanvas = true;
		Laya.init(720, 1280);
		Laya.stage.scaleMode = Stage.SCALE_FIXED_AUTO;
		// Laya.stage.screenMode = Stage.SCREEN_HORIZONTAL;

		Laya.alertGlobalError(true);
		//初始化渲染gl相关
		CubismShader_Laya.__init__();
		//编译live2dshader
		CubismShader_Laya.getInstance().generateShaders();
		//初始化live2d计时
		Delegate.instance.initializeCubism();
		this.initRedBtn();
	}

	private changeModel() {
		if (this._model) {
			this._model.destroy();
		}
		console.log(Browser.now())
		this._model = null;
		let loader = new Live2DLoader();
		// let url = this._modelurls[this.index % this._modelurls.length];
		let url = "Haru";
		this.index++;
		// loader.loadAssets("res/"+url,url+".model3.json",Handler.create(this,this._loadSuccess));
		
		loader.loadZipAssets("res","Hiyori.zip", "Hiyori", Handler.create(this, this._loadSuccess));
	}
	private _loadSuccess(model: Live2DModel, loader: Live2DLoader) {
		if (!model) return;
		if (!this.sp) {
			this.sp = new Box();//this.sp未红色按钮
			Laya.stage.addChild(this.sp);
		}
		this._model = model;
		model.isAutoPlay = false;
		// this._model.addChild(this.sp);
		// model.pivot(model.width/2,model.height/2)

		/** 模型初始化 */
		model.initModel();
		Laya.stage.addChildAt(model, 0);
		// this.sp.addChild(model);
		model.scale(0.2, 0.2);
		let widget = model.addComponent(Widget) as Widget;
		// widget.centerX = widget.centerY = 0;
		loader.clear();
		model.on(Event.MOUSE_DOWN, this, this.onMouseDown);
		model.on(Event.CHANGE, this, this.aboutEvent);
		Laya.stage.on(Event.MOUSE_DOWN, this, this.stageOnMouseDown);

	}

	private initRedBtn() {
		let sp = new Sprite();
		Laya.stage.addChild(sp)
		sp.graphics.drawRect(0, 0, 100, 100, "red");
		sp.mouseEnabled = true;
		sp.mouseThrough = true
		sp.x = Laya.stage.width - 100;
		sp.on(Event.MOUSE_DOWN, this, this.changeModel)
	}

	private aboutEvent(eventValue): void {
		console.log(eventValue);
	}
	private stageOnMouseDown(): void {
		Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove)
		Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp)
		Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp)
	}
	private onMouseDown(): void {
		if (!this._model) {
			return
		}
		let model = this._model;
		if (model.live2DHitTest("Body", Laya.stage.mouseX, Laya.stage.mouseY)) {
			console.log("点击到了Body");
			model.startRandomMotion("TapBody", 3);
		} else
			if (model.live2DHitTest("Head", Laya.stage.mouseX, Laya.stage.mouseY)) {
				console.log("点到Head了")
				model.setRandomExpression();
			}

	}

	private onMouseUp() {
		Laya.stage.off(Event.MOUSE_MOVE, this, this.onMouseMove)
		Laya.stage.off(Event.MOUSE_OUT, this, this.onMouseUp)
		Laya.stage.off(Event.MOUSE_UP, this, this.onMouseUp)
	}

	private onMouseMove() {
		if (!this._model) {
			return
		}
		this._model.setDragging(Laya.stage.mouseX, Laya.stage.mouseY)
	}

}

new Live2DDemo();