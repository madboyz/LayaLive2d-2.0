## LayaAir环境使用Live2D案例

本项目基于 **LayaAir IDE ts实验版项目** 与 **Live2D web 版本官方示例** （[项目地址](https://github.com/Live2D/CubismWebSamples)）开发。



#### 适用引擎版本：>= LayaAir 2.7.0

或者可以尝试按照本条修改记录调整引擎（[commit](https://github.com/layabox/LayaAir/commit/fe01a6f8c3eeadfb5b43e915497c5ae60656aede)）



#### 项目构成：

```
├─ .laya           # laya发布与编译相关脚本
├─ .vscode         # vscode相关文件
├─ bin             # 运行目录
├─ dist 		   # 打包 publish 脚本与 frameWork 代码输出目录
├─ laya			   # IDE编辑时资源与ui目录（可忽略）
├─ libs			   # 引擎源码
├─ src			   # 实现部分代码
|   ├─ Adapter      # 引擎适配部分代码，render部分参考Live2D CubismRenderer实现
|   └─ framework    # 来自于Live2D web官方示例 framework，可以自行替换Live2D官方示例新版本代码（可能需要同步修改adapter部分代码）
└─ scripts          # 工具代码包
	└─ publish.js   # 基于rollup实现的简单打包工具，可将 publish 脚本与 frameWork 目录代码打包，使用改功能前，请在根目录执行 npm install

```

Live2D的 js 核心库可以从Live2D官方获取



#### 注意事项：

使用本适配库，请必须遵守Live2D官方的软件使用授权协议：https://www.live2d.com/eula/live2d-open-software-license-agreement_cn.html



#### 使用说明：

`具体可以参考示例`

优先需要初始化相关环境：

```typescript
//.... 来源与 Main.ts line:33-38
//初始化渲染gl相关
CubismShader_WebGL.__init__();
//编译live2dshader
CubismShader_WebGL.getInstance().generateShaders();
//初始化live2d计时
Delegate.instance.initializeCubism();

```

使用对应的Loader来加载模型:

```typescript
//来源 Main.ts line: 48-51
let loader = new Live2DLoader();
let url = this._modelurls[this.index % this._modelurls.length];
this.index ++;
loader.loadAssets("res/"+url,url+".model3.json",Handler.create(this,this._loadSuccess));

//来源 Main.ts line: 54-77
function _loadSuccess(model:Live2DModel,loader:Live2DLoader){
		if(!model)return;
		if(!this.sp){//this.sp未红色按钮
			this.sp = new Box();
			Laya.stage.addChild(this.sp);
		}
		this._model = model;//加载获取的模型
		model.isAutoPlay = false;
		// this._model.addChild(this.sp);
		// model.pivot(model.width/2,model.height/2)
    
    	/** 模型初始化 */
		model.initModel();
		Laya.stage.addChildAt(model,0);
		// this.sp.addChild(model);
		model.scale(0.2,0.2);
		let widget = model.addComponent(Widget) as Widget;
		// widget.centerX = widget.centerY = 0;
		loader.clear();
		model.on(Event.MOUSE_DOWN,this,this.onMouseDown);
		model.on(Event.CHANGE,this,this.aboutEvent);
		Laya.stage.on(Event.MOUSE_DOWN,this,this.stageOnMouseDown);
	}
```

Live2DLoader加载解析参考

#### 显示相关：

模型的宽高信息为模型数据中的 **CanvasWidth** 和 **CanvasHeight**。



#### 优化相关：

**因为渲染与数据部分使用的 live2d 示例相关代码，且存在获取webgl状态相关逻辑，无法保证渲染效率。**

可优化部分：

`Live2DSubmit` 类中有针对小游戏环境webgl方法不支持问题的补丁，如果只是web环境运行可以去掉以下相关逻辑

```typescript
public static __init__(gl:WebGLRenderingContext){
        Live2DSubmit._gl =gl;
	    /**web 环境可以自己手动去掉 **/
        var _originBindBuffer = gl.bindBuffer;
        function bindBuffer (target: GLenum, buffer: WebGLBuffer | null):void{
            if(Live2DSubmit.isMark){
                /** 注意使用 _curAB 和 _curEAB 的相关代码也可以省略**/
                if(target == Live2DSubmit._gl.ARRAY_BUFFER){
                    Live2DSubmit._curAB = buffer;
                }else if(target == Live2DSubmit._gl.ELEMENT_ARRAY_BUFFER){
                    Live2DSubmit._curEAB = buffer;
                }
            }
            _originBindBuffer.call(Live2DSubmit._gl,target,buffer);
        }
        gl.bindBuffer = bindBuffer;
    	/** end*/
    }
```



**注意**：如果需要更新 `framework `可以从 Live2D 官方 Github 获取，再直接替换 `src/framework`。（可能会有部分不兼容）



#### 如何适用其他IDE类型项目：

##### 1.标准ts项目

可以将 `Adapter` 与 `framework` 文件夹拷贝到自己项目下，再将 `Adapter` 目录下的 ts 文件 `import` 引擎相关代码调整：

例如:

```typescript
import { EventDispatcher } from "laya/events/EventDispatcher";
import { Loader } from "laya/net/Loader";
import { Handler } from "laya/utils/Handler";
```

修改为:

```typescript
import  EventDispatcher = Laya.EventDispatcher;
import  Loader = Laya.Loader;
import  Handler= Laya.Handler;
```

##### 2.js项目

JS项目使用源码的源码`Adapter`与 `framework` 要比标准ts项目多一个步骤。在修改 import 之前，使用 **tsc** 编译获得 `Adapter` 与 `framework` 的 js 版本。再重复标准 ts 项目的修改即可。

##### 3. as3项目

as3可以参考发布流程，编译出库之后，项目独立引用 JS 的方式去使用。



#### 发布相关：

如果开发者直接采用live2D源码开发，那用不上发布，除非是JS与AS项目，只能采用JS库的方案。那就需要先把Live2D发布成js库，再通过引入js库的方式来使用live2D的API。

目前通过 `scripts` 下的 `publish.js` 脚本已经能简单实现将 `Adapter` 于 `framework`两个文件夹打包成独立工具库。

但是目前还不具备生成 d.ts 的能力。所以采用JS库的方式，会没有API提示，如果想加，开发者可根据项目需要，自行编写livd2D的d.ts

##### 环境准备：

在项目根目录下

```
npm install
```

##### 发布库：

```
npm run publish
```

本人修改Live2DLoader 加载zip模型

