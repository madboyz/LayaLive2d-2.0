import { ILaya } from "../../ILaya";
import { Sprite } from "../display/Sprite";
import { ColorFilter } from "../filters/ColorFilter";
import { LayaGL } from "../layagl/LayaGL";
import { Bezier } from "../maths/Bezier";
import { Matrix } from "../maths/Matrix";
import { Point } from "../maths/Point";
import { Rectangle } from "../maths/Rectangle";
import { FontInfo } from "../utils/FontInfo";
import { HTMLChar } from "../utils/HTMLChar";
import { Stat } from "../utils/Stat";
import { WordText } from "../utils/WordText";
import { BlendMode } from "../webgl/canvas/BlendMode";
import { DrawStyle } from "../webgl/canvas/DrawStyle";
import { Path } from "../webgl/canvas/Path";
import { ISaveData } from "../webgl/canvas/save/ISaveData";
import { SaveBase } from "../webgl/canvas/save/SaveBase";
import { SaveClipRect } from "../webgl/canvas/save/SaveClipRect";
import { SaveMark } from "../webgl/canvas/save/SaveMark";
import { SaveTransform } from "../webgl/canvas/save/SaveTransform";
import { SaveTranslate } from "../webgl/canvas/save/SaveTranslate";
import { WebGLCacheAsNormalCanvas } from "../webgl/canvas/WebGLCacheAsNormalCanvas";
import { BaseShader } from "../webgl/shader/BaseShader";
import { Shader2D } from "../webgl/shader/d2/Shader2D";
import { ShaderDefines2D } from "../webgl/shader/d2/ShaderDefines2D";
import { SkinMeshBuffer } from "../webgl/shader/d2/skinAnishader/SkinMeshBuffer";
import { Value2D } from "../webgl/shader/d2/value/Value2D";
import { Shader } from "../webgl/shader/Shader";
import { BasePoly } from "../webgl/shapes/BasePoly";
import { Earcut } from "../webgl/shapes/Earcut";
import { ISubmit } from "../webgl/submit/ISubmit";
import { Submit } from "../webgl/submit/Submit";
import { SubmitBase } from "../webgl/submit/SubmitBase";
import { SubmitCanvas } from "../webgl/submit/SubmitCanvas";
import { SubmitCMD } from "../webgl/submit/SubmitCMD";
import { SubmitKey } from "../webgl/submit/SubmitKey";
import { SubmitTarget } from "../webgl/submit/SubmitTarget";
import { SubmitTexture } from "../webgl/submit/SubmitTexture";
import { CharRenderInfo } from "../webgl/text/CharRenderInfo";
import { CharSubmitCache } from "../webgl/text/CharSubmitCache";
import { TextRender } from "../webgl/text/TextRender";
import { IndexBuffer2D } from "../webgl/utils/IndexBuffer2D";
import { Mesh2D } from "../webgl/utils/Mesh2D";
import { MeshQuadTexture } from "../webgl/utils/MeshQuadTexture";
import { MeshTexture } from "../webgl/utils/MeshTexture";
import { MeshVG } from "../webgl/utils/MeshVG";
import { RenderState2D } from "../webgl/utils/RenderState2D";
import { VertexBuffer2D } from "../webgl/utils/VertexBuffer2D";
import { WebGLContext } from "../webgl/WebGLContext";
import { Bitmap } from "./Bitmap";
import { HTMLCanvas } from "./HTMLCanvas";
import { RenderTexture2D } from "./RenderTexture2D";
import { RenderTextureFormat } from "./RenderTextureFormat";
import { Texture } from "./Texture";
import { Texture2D } from "./Texture2D";

/**
 * @private
 * Context?????????
 */
export class Context {

	/**@internal */
	_canvas: HTMLCanvas;
	static ENUM_TEXTALIGN_DEFAULT: number = 0;
	static ENUM_TEXTALIGN_CENTER: number = 1;
	static ENUM_TEXTALIGN_RIGHT: number = 2;


	static _SUBMITVBSIZE: number = 32000;

	static _MAXSIZE: number = 99999999;
	private static _MAXVERTNUM: number = 65535;

	static MAXCLIPRECT: Rectangle = null;

	static _COUNT: number = 0;

	/**@internal */
	_tmpMatrix: Matrix = new Matrix();		// chrome????????????????????????this????????????

	private static SEGNUM: number = 32;

	private static _contextcount: number = 0;

	private _drawTexToDrawTri_Vert: Float32Array = new Float32Array(8);		// ???????????????????????????static???
	private _drawTexToDrawTri_Index: Uint16Array = new Uint16Array([0, 1, 2, 0, 2, 3]);
	private _tempUV: Float32Array = new Float32Array(8);
	private _drawTriUseAbsMatrix: boolean = false;	//drawTriange????????????????????????????????????????????????????????????????????????????????????

	static __init__(): void {
		Context.MAXCLIPRECT = new Rectangle(0, 0, Context._MAXSIZE, Context._MAXSIZE);
		ContextParams.DEFAULT = new ContextParams();
		WebGLCacheAsNormalCanvas;
	}

	/**@private */
	drawImage(...args:any[]): void {
	}

	/**@private */
	getImageData(...args:any[]): any {
	}

	/**@private */
	measureText(text: string): any {
		return null;
	}

	/**@private */
	setTransform(...args:any[]): void {
	}


	/**@private */
	$transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
	}


	/**@private */
	get lineJoin(): string {
		return '';
	}

	/**@private */
	set lineJoin(value: string) {
	}

	/**@private */
	get lineCap(): string {
		return '';
	}

	/**@private */
	set lineCap(value: string) {
	}

	/**@private */
	get miterLimit(): string {
		return '';
	}

	/**@private */
	set miterLimit(value: string) {
	}

	/**@private */
	clearRect(x: number, y: number, width: number, height: number): void {
	}

	/**@internal */
	//TODO:coverage
	_drawRect(x: number, y: number, width: number, height: number, style: any): void {
		Stat.renderBatches++;
		style && (this.fillStyle = style);
		this.fillRect(x, y, width, height, null);
	}

	///**@private */
	//public function transformByMatrix(value:Matrix):void {
	//this.transform(value.a, value.b, value.c, value.d, value.tx, value.ty);
	//}

	/**@private */
	//TODO:coverage
	//public function setTransformByMatrix(value:Matrix):void {
	//	this.setTransform(value.a, value.b, value.c, value.d, value.tx, value.ty);
	//}

	/**@private */
	//TODO:coverage
	drawTexture2(x: number, y: number, pivotX: number, pivotY: number, m: Matrix, args2: any[]): void {
	}

	//=============??????==================
	transformByMatrix(matrix: Matrix, tx: number, ty: number): void {
		this.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx + tx, matrix.ty + ty);
	}

	saveTransform(matrix: Matrix): void {
		this.save();
	}

	restoreTransform(matrix: Matrix): void {
		this.restore();
	}

	drawRect(x: number, y: number, width: number, height: number, fillColor: any, lineColor: any, lineWidth: number): void {
		var ctx: any = this;

		//????????????
		if (fillColor != null) {
			ctx.fillStyle = fillColor;
			ctx.fillRect(x, y, width, height);
		}

		//??????????????????
		if (lineColor != null) {
			ctx.strokeStyle = lineColor;
			ctx.lineWidth = lineWidth;
			ctx.strokeRect(x, y, width, height);
		}
	}

	alpha(value: number): void {
		this.globalAlpha *= value;
	}

	/**@internal */
	//TODO:coverage
	_transform(mat: Matrix, pivotX: number, pivotY: number): void {
		this.translate(pivotX, pivotY);
		this.transform(mat.a, mat.b, mat.c, mat.d, mat.tx, mat.ty);
		this.translate(-pivotX, -pivotY);
	}

	/**@internal */
	_rotate(angle: number, pivotX: number, pivotY: number): void {
		this.translate(pivotX, pivotY);
		this.rotate(angle);
		this.translate(-pivotX, -pivotY);
	}

	/**@internal */
	_scale(scaleX: number, scaleY: number, pivotX: number, pivotY: number): void {
		this.translate(pivotX, pivotY);
		this.scale(scaleX, scaleY);
		this.translate(-pivotX, -pivotY);
	}

	/**@internal */
	_drawLine(x: number, y: number, fromX: number, fromY: number, toX: number, toY: number, lineColor: string, lineWidth: number, vid: number): void {
		this.beginPath();
		this.strokeStyle = lineColor;
		this.lineWidth = lineWidth;
		this.moveTo(x + fromX, y + fromY);
		this.lineTo(x + toX, y + toY);
		this.stroke();
	}

	/**@internal */
	_drawLines(x: number, y: number, points: any[], lineColor: any, lineWidth: number, vid: number): void {
		this.beginPath();
		//x += args[0], y += args[1];
		this.strokeStyle = lineColor;
		this.lineWidth = lineWidth;
		//var points:Array = args[2];
		this.addPath(points.slice(), false, false, x, y);
		this.stroke();
	}

	drawCurves(x: number, y: number, points: any[], lineColor: any, lineWidth: number): void {
		this.beginPath();
		this.strokeStyle = lineColor;
		this.lineWidth = lineWidth;
		//var points:Array = args[2];
		//x += args[0], y += args[1];
		this.moveTo(x + points[0], y + points[1]);
		var i: number = 2, n: number = points.length;
		while (i < n) {
			this.quadraticCurveTo(x + points[i++], y + points[i++], x + points[i++], y + points[i++]);
		}
		this.stroke();
	}

	private _fillAndStroke(fillColor: string, strokeColor: string, lineWidth: number, isConvexPolygon: boolean = false): void {
		//??????????????????
		if (fillColor != null) {
			this.fillStyle = fillColor;
			this.fill();
		}

		//????????????
		if (strokeColor != null && lineWidth > 0) {
			this.strokeStyle = strokeColor;
			this.lineWidth = lineWidth;
			this.stroke();
		}
	}
	/**Math.PI*2??????????????? */
	static PI2: number = 2 * Math.PI;
	/**@internal */
	_drawCircle(x: number, y: number, radius: number, fillColor: any, lineColor: any, lineWidth: number, vid: number): void {
		Stat.renderBatches++;
		this.beginPath(true);
		this.arc(x, y, radius, 0, Context.PI2);
		this.closePath();
		//??????
		this._fillAndStroke(fillColor, lineColor, lineWidth);
	}

	//????????????	
	/**@internal */
	_drawPie(x: number, y: number, radius: number, startAngle: number, endAngle: number, fillColor: any, lineColor: any, lineWidth: number, vid: number): void {
		//???????????????
		//ctx.translate(x + args[0], y + args[1]);
		//????????????
		this.beginPath();
		this.moveTo(x, y);
		this.arc(x, y, radius, startAngle, endAngle);
		this.closePath();
		//??????
		this._fillAndStroke(fillColor, lineColor, lineWidth);
		//???????????????
		//ctx.translate(-x - args[0], -y - args[1]);
	}

	/**@internal */
	_drawPoly(x: number, y: number, points: any[], fillColor: any, lineColor: any, lineWidth: number, isConvexPolygon: boolean, vid: number): void {
		//var points:Array = args[2];
		this.beginPath();
		//poly?????????close???
		this.addPath(points.slice(), true, isConvexPolygon, x, y);
		this.closePath();
		this._fillAndStroke(fillColor, lineColor, lineWidth, isConvexPolygon);
	}

	/**@internal */
	_drawPath(x: number, y: number, paths: any[], brush: any, pen: any): void {
		//????????????
		this.beginPath();
		//x += args[0], y += args[1];

		//var paths:Array = args[2];
		for (var i: number = 0, n: number = paths.length; i < n; i++) {

			var path: any[] = paths[i];
			switch (path[0]) {
				case "moveTo":
					this.moveTo(x + path[1], y + path[2]);
					break;
				case "lineTo":
					this.lineTo(x + path[1], y + path[2]);
					break;
				case "arcTo":
					this.arcTo(x + path[1], y + path[2], x + path[3], y + path[4], path[5]);
					break;
				case "closePath":
					this.closePath();
					break;
			}
		}

		//var brush:Object = args[3];
		if (brush != null) {
			this.fillStyle = brush.fillStyle;
			this.fill();
		}

		//var pen:Object = args[4];
		if (pen != null) {
			this.strokeStyle = pen.strokeStyle;
			this.lineWidth = pen.lineWidth || 1;
			this.lineJoin = pen.lineJoin;
			this.lineCap = pen.lineCap;
			this.miterLimit = pen.miterLimit;
			this.stroke();
		}
	}

	static set2DRenderConfig(): void {
		var gl: WebGLRenderingContext = LayaGL.instance;
		WebGLContext.setBlend(gl, true);//??????2D??????
		WebGLContext.setBlendEquation(gl, gl.FUNC_ADD);
		BlendMode.activeBlendFunction=null;		// ??????submit?????????blend
		WebGLContext.setBlendFunc(gl, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
		WebGLContext.setDepthTest(gl, false);
		WebGLContext.setCullFace(gl, false);
		WebGLContext.setDepthMask(gl, true);
		WebGLContext.setFrontFace(gl, gl.CCW);
		gl.viewport(0, 0, RenderState2D.width, RenderState2D.height);//??????2D??????
	}

	/**@internal */
	_id: number = ++Context._COUNT;

	private _other: ContextParams|null = null;
	private _renderNextSubmitIndex: number = 0;

	private _path: Path|null = null;
	/**@internal */
	_drawCount: number = 1;
	private _width: number = Context._MAXSIZE;
	private _height: number = Context._MAXSIZE;
	private _renderCount: number = 0;
	/**@internal */
	_submits: any = null;
	/**@internal */
	_curSubmit: any = null;
	/**@internal */
	_submitKey: SubmitKey = new SubmitKey();	//???????????????????????????????????????????????????_curSubmit??????

	/**@internal */
	_mesh: MeshQuadTexture ;			//???Mesh2D??????_vb,_ib. ???????????????mesh
	/**@internal */
	_pathMesh: MeshVG|null = null;			//????????????mesh???
	/**@internal */
	_triangleMesh: MeshTexture|null = null;	//drawTriangles??????mesh?????????ib???????????????????????????_mesh??????

	meshlist: any[] = [];	//???context?????????mesh

	//public var _vbs:Array = [];	//???buffer?????????TODO ?????????????????????mesh?????????
	private _transedPoints: any[] = new Array(8);	//??????????????????????????????4?????????????????????????????????
	private _temp4Points: any[] = new Array(8);		//???????????????????????????4?????????????????????

	/**@internal */
	_clipRect: Rectangle = Context.MAXCLIPRECT;
	//public var _transedClipInfo:Array = [0, 0, Context._MAXSIZE, 0, 0, Context._MAXSIZE];	//??????????????????clip???ox,oy, xx,xy,yx,yy 	xx,xy????????????*??????
	/**@internal */
	_globalClipMatrix: Matrix = new Matrix(Context._MAXSIZE, 0, 0, Context._MAXSIZE, 0, 0);	//??????????????????clip???????????????????????????????????????????????????0~1??????????????????
	/**@internal */
	_clipInCache: boolean = false; 	// ???????????????clipinfo??????cacheas normal?????????????????????cacheas normal????????????????????????tx???ty??????????????????????????????????????????shader?????????
	/**@internal */
	_clipInfoID: number = 0;					//?????????????????????clipinfo???????????????
	private _clipID_Gen: number = 0;			//??????clipid???????????????  _clipInfoID=++_clipInfoID ?????????????????????????????????clip???id?????????
	/**@internal */
	_curMat: Matrix;

	//???????????????????????????
	/**@internal */
	_lastMatScaleX: number = 1.0;
	/**@internal */
	_lastMatScaleY: number = 1.0;
	private _lastMat_a: number = 1.0;
	private _lastMat_b: number = 0.0;
	private _lastMat_c: number = 0.0;
	private _lastMat_d: number = 1.0;
	/**@internal */
	_nBlendType: number = 0;
	/**@internal */
	_save: any = null;
	/**@internal */
	_targets: RenderTexture2D|null = null;
	/**@internal */
	_charSubmitCache: CharSubmitCache|null = null;
	/**@internal */
	_saveMark: SaveMark|null = null;
	/**@internal */
	_shader2D: Shader2D = new Shader2D();	//

	/**
	 * ???cacheAs??????
	 * ??????cacheas bitmap?????????????????????????????????????????????????????????????????????????????????sprite??????????????????
	 * ????????????????????????repaint
	 */
	sprite: Sprite|null = null;

	/**@internal */
	public static _textRender: TextRender|null = null;// new TextRender();
	/**@internal */
	_italicDeg: number = 0;//?????????????????????
	/**@internal */
	_lastTex: Texture|null = null; //???????????????texture???????????????fillrect??????????????????????????????drawtexture

	private _fillColor: number = 0;
	private _flushCnt: number = 0;

	private defTexture: Texture|null = null;	//???fillrect???
	/**@internal */
	_colorFiler: ColorFilter|null = null;

	drawTexAlign: boolean = false;		// ??????????????????
	/**@internal */
	_incache: boolean = false;			// ?????????cacheas normal?????????

	isMain: boolean = false;				// ????????????context

	constructor() {
		Context._contextcount++;
		Context._textRender = Context._textRender || new TextRender();
		//_ib = IndexBuffer2D.QuadrangleIB;
		if (!this.defTexture) {
			var defTex2d: Texture2D = new Texture2D(2, 2);
			defTex2d.setPixels(new Uint8Array(16));
			defTex2d.lock = true;
			this.defTexture = new Texture(defTex2d);
		}
		this._lastTex = this.defTexture;
		this.clear();
	}

	clearBG(r: number, g: number, b: number, a: number): void {
		var gl: WebGLRenderingContext = WebGLContext.mainContext;
		gl.clearColor(r, g, b, a);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	//TODO:coverage
	/**@internal */
	_getSubmits(): any[] {
		return this._submits;
	}

	/**
	 * ??????????????????
	 * @param	keepRT  ????????????rendertarget
	 */
	private _releaseMem(keepRT: boolean = false): void {
		if (!this._submits)
			return;

		this._curMat && this._curMat.destroy();
		//@ts-ignore
		this._curMat = null;
		this._shader2D.destroy();
		//@ts-ignore
		this._shader2D = null;
		//@ts-ignore
		this._charSubmitCache.clear();

		for (var i: number = 0, n: number = this._submits._length; i < n; i++) {
			this._submits[i].releaseRender();
		}
		this._submits.length = 0;
		this._submits._length = 0;
		this._submits = null;
		this._curSubmit = null;

		this._path = null;
		//_other && (_other.font = null);
		this._save = null;

		var sz: number;
		for (i = 0, sz = this.meshlist.length; i < sz; i++) {
			var curm: Mesh2D = this.meshlist[i];
			curm.destroy();
		}
		this.meshlist.length = 0;

		this.sprite = null;
		if (!keepRT) {
			this._targets && (this._targets.destroy());
			this._targets = null;
		}
		//TODO mesh ??????releaseMem???
	}

	/**
	 * ??????????????????
	 * @param	keepRT  ????????????rendertarget
	 */
	destroy(keepRT: boolean = false): void {
		--Context._contextcount;
		this.sprite = null;
		this._releaseMem(keepRT);
		this._charSubmitCache && this._charSubmitCache.destroy();
		//_ib && (_ib != IndexBuffer2D.QuadrangleIB) && _ib.releaseResource();
		this._mesh.destroy();
		if (!keepRT) {
			this._targets && this._targets.destroy();//???????????????????????????????????????????????????
			this._targets = null;
		}
	}

	clear(): void {
		if (!this._submits) {//?????????
			this._other = ContextParams.DEFAULT;
			this._curMat = Matrix.create();
			this._charSubmitCache = new CharSubmitCache();
			//_vb = _vbs[0] = VertexBuffer2D.create( -1);
			this._mesh = MeshQuadTexture.getAMesh(this.isMain);
			this.meshlist.push(this._mesh);
			this._pathMesh = MeshVG.getAMesh(this.isMain);
			this.meshlist.push(this._pathMesh);
			this._triangleMesh = MeshTexture.getAMesh(this.isMain);
			this.meshlist.push(this._triangleMesh);
			//if(Config.smartCache) _vbs[1] = VertexBuffer2D.create( -1);
			this._submits = [];
			this._save = [SaveMark.Create(this)];
			this._save.length = 10;
			this._shader2D = new Shader2D();
		}

		this._submitKey.clear();

		//_vb = _vbs[_renderCount%2];
		//_vb.clear();
		this._mesh.clearVB();

		//_targets && (_targets.repaint = true);

		this._drawCount = 1;

		this._other = ContextParams.DEFAULT;
		this._other.lineWidth = this._shader2D.ALPHA = 1.0;

		this._nBlendType = 0;

		this._clipRect = Context.MAXCLIPRECT;

		this._curSubmit = SubmitBase.RENDERBASE;
		SubmitBase.RENDERBASE._ref = 0xFFFFFF;
		SubmitBase.RENDERBASE._numEle = 0;

		this._shader2D.fillStyle = this._shader2D.strokeStyle = DrawStyle.DEFAULT;

		for (var i: number = 0, n: number = this._submits._length; i < n; i++)
			this._submits[i].releaseRender();

		this._submits._length = 0;

		this._curMat.identity();
		this._other.clear();

		this._saveMark = this._save[0];
		this._save._length = 1;

	}

	/**
	 * ??????ctx???size??????????????????????????????????????????canvas???????????????????????????????????????????????????canvas???????????????
	 * @param	w
	 * @param	h
	 */
	size(w: number, h: number): void {
		if (this._width != w || this._height != h) {
			this._width = w;
			this._height = h;
			//TODO ??????????????????rendertarget ??????????????????????????????canvas????????????rt????????????,?????????????????????
			//???????????????canvas??????????????????
			if (this._targets) {
				this._targets.destroy();
				this._targets = new RenderTexture2D(w, h, RenderTextureFormat.R8G8B8A8, -1);
			}
			//??????????????????????????????????????????
			//???????????? TODO
			if (this.isMain) {
				WebGLContext.mainContext.viewport(0, 0, w, h);
				RenderState2D.width = w;
				RenderState2D.height = h;
			}
		}
		if (w === 0 && h === 0) this._releaseMem();
	}

	/**
	 * ??????canvas???????????????????????????
	 * ?????????
	 * ??????value==true????????????_target??????
	 * @param value {Boolean} 
	 */
	set asBitmap(value: boolean) {
		if (value) {
			//?????????RGB??????a?????????????????????????????????????????????????????????
			//???????????????-1???????????????????????????
			let rt = this._targets;
			if (!this._width || !this._height)
				throw Error("asBitmap no size!");
			if(!rt || rt.width!=this._width||rt.height!=this._height){
				if(rt){
					rt.destroy();
				}
				this._targets = new RenderTexture2D(this._width, this._height, RenderTextureFormat.R8G8B8A8, -1)
			}
		} else {
			this._targets && this._targets.destroy();
			this._targets = null;
		}
	}

	/**
	 * ??????????????????????????????
	 * ?????????????????????getScaleX
	 * @return
	 */
	getMatScaleX(): number {
		if (this._lastMat_a == this._curMat.a && this._lastMat_b == this._curMat.b)
			return this._lastMatScaleX;
		this._lastMatScaleX = this._curMat.getScaleX();
		this._lastMat_a = this._curMat.a;
		this._lastMat_b = this._curMat.b;
		return this._lastMatScaleX;
	}

	getMatScaleY(): number {
		if (this._lastMat_c == this._curMat.c && this._lastMat_d == this._curMat.d)
			return this._lastMatScaleY;
		this._lastMatScaleY = this._curMat.getScaleY();
		this._lastMat_c = this._curMat.c;
		this._lastMat_d = this._curMat.d;
		return this._lastMatScaleY;
	}

	//TODO
	setFillColor(color: number): void {
		this._fillColor = color;
	}
	getFillColor(): number {
		return this._fillColor;
	}

	set fillStyle(value: any) {
		if (!this._shader2D.fillStyle.equal(value)) {
			SaveBase.save(this, SaveBase.TYPE_FILESTYLE, this._shader2D, false);
			this._shader2D.fillStyle = DrawStyle.create(value);
			this._submitKey.other = -this._shader2D.fillStyle.toInt();
		}
	}

	get fillStyle(): any {
		return this._shader2D.fillStyle;
	}

	set globalAlpha(value: number) {
		value = Math.floor(value * 1000) / 1000;
		if (value != this._shader2D.ALPHA) {
			SaveBase.save(this, SaveBase.TYPE_ALPHA, this._shader2D, false);
			this._shader2D.ALPHA = value;
		}
	}

	get globalAlpha(): number {
		return this._shader2D.ALPHA;
	}

	set textAlign(value: string) {
		(this._other.textAlign === value) || (this._other = this._other.make(), SaveBase.save(this, SaveBase.TYPE_TEXTALIGN, this._other, false), this._other.textAlign = value);
	}

	get textAlign(): string {
		return this._other.textAlign;
	}

	set textBaseline(value: string) {
		(this._other.textBaseline === value) || (this._other = this._other.make(), SaveBase.save(this, SaveBase.TYPE_TEXTBASELINE, this._other, false), this._other.textBaseline = value);
	}

	get textBaseline(): string {
		return this._other.textBaseline;
	}

	set globalCompositeOperation(value: string) {
		var n = BlendMode.TOINT[value];
		n == null || (this._nBlendType === n) || (SaveBase.save(this, SaveBase.TYPE_GLOBALCOMPOSITEOPERATION, this, true), this._curSubmit = SubmitBase.RENDERBASE, this._nBlendType = n /*, _shader2D.ALPHA = 1*/);
	}

	get globalCompositeOperation(): string {
		return BlendMode.NAMES[this._nBlendType];
	}

	set strokeStyle(value: any) {
		this._shader2D.strokeStyle.equal(value) || (SaveBase.save(this, SaveBase.TYPE_STROKESTYLE, this._shader2D, false), this._shader2D.strokeStyle = DrawStyle.create(value), this._submitKey.other = -this._shader2D.strokeStyle.toInt());
	}

	get strokeStyle(): any {
		return this._shader2D.strokeStyle;
	}

	translate(x: number, y: number): void {
		if (x !== 0 || y !== 0) {
			SaveTranslate.save(this);
			if (this._curMat._bTransform) {
				SaveTransform.save(this);
				//_curMat.transformPointN(Point.TEMP.setTo(x, y));
				//x = Point.TEMP.x;
				//y = Point.TEMP.y;
				//translate?????????????????????????????????????????????x,y?????????????????????_curMat,??????x,y???????????????
				this._curMat.tx += (x * this._curMat.a + y * this._curMat.c);
				this._curMat.ty += (x * this._curMat.b + y * this._curMat.d);
			} else {
				this._curMat.tx = x;
				this._curMat.ty = y;
			}
		}
	}

	set lineWidth(value: number) {
		(this._other.lineWidth === value) || (this._other = this._other.make(), SaveBase.save(this, SaveBase.TYPE_LINEWIDTH, this._other, false), this._other.lineWidth = value);
	}

	get lineWidth(): number {
		return this._other.lineWidth;
	}

	save(): void {
		this._save[this._save._length++] = SaveMark.Create(this);
	}

	restore(): void {
		var sz: number = this._save._length;
		var lastBlend: number = this._nBlendType;
		if (sz < 1)
			return;
		for (var i: number = sz - 1; i >= 0; i--) {
			var o: ISaveData = this._save[i];
			o.restore(this);
			if (o.isSaveMark()) {
				this._save._length = i;
				return;
			}
		}
		if (lastBlend != this._nBlendType) {
			//????????????
			this._curSubmit = SubmitBase.RENDERBASE;
		}
	}

	set font(str: string) {
		//if (str == _other.font.toString())
		//	return;
		this._other = this._other.make();
		SaveBase.save(this, SaveBase.TYPE_FONT, this._other, false);
		//_other.font === FontInContext.EMPTY ? (_other.font = new FontInContext(str)) : (_other.font.setFont(str));
	}

	fillText(txt: string | WordText, x: number, y: number, fontStr: string, color: string, align: string, lineWidth: number = 0, borderColor: string = ""): void {
		Context._textRender!.filltext(this, txt, x, y, fontStr, color, borderColor, lineWidth, align);
	}
	// ???fillText??????????????????border??????
	drawText(text: string | WordText, x: number, y: number, font: string, color: string, textAlign: string): void {
		Context._textRender!.filltext(this, text, x, y, font, color, null, 0, textAlign);
	}
	fillWords(words: HTMLChar[], x: number, y: number, fontStr: string, color: string): void {
		Context._textRender!.fillWords(this, words, x, y, fontStr, color, null, 0);
	}
	strokeWord(text: string | WordText, x: number, y: number, font: string, color: string, lineWidth: number, textAlign: string): void {
		Context._textRender!.filltext(this, text, x, y, font, null, color, lineWidth, textAlign);
	}
	fillBorderText(txt: string | WordText, x: number, y: number, font: string, color: string, borderColor: string, lineWidth: number, textAlign: string): void {
		Context._textRender!.filltext(this, txt, x, y, font, color, borderColor, lineWidth, textAlign);
	}
	fillBorderWords(words: HTMLChar[], x: number, y: number, font: string, color: string, borderColor: string, lineWidth: number): void {
		Context._textRender!.fillWords(this, words, x, y, font, color, borderColor, lineWidth);
	}

	/**@internal */
	_fast_filltext(data: string | WordText, x: number, y: number, fontObj: any, color: string, strokeColor: string|null, lineWidth: number, textAlign: number, underLine: number = 0): void {
		Context._textRender!._fast_filltext(this, data, null, x, y, (<FontInfo>fontObj), color, strokeColor, lineWidth, textAlign, underLine);
	}

	private _fillRect(x: number, y: number, width: number, height: number, rgba: number): void {
		var submit: Submit = this._curSubmit;
		var sameKey: boolean = submit && (submit._key.submitType === SubmitBase.KEY_DRAWTEXTURE && submit._key.blendShader === this._nBlendType);
		if (this._mesh.vertNum + 4 > Context._MAXVERTNUM) {
			this._mesh = MeshQuadTexture.getAMesh(this.isMain);//????????????mesh  TODO ??????_mesh????????????????????????????????????????????????????????????_mesh??????????????????????????? 
			this.meshlist.push(this._mesh);
			sameKey = false;
		}

		//clipinfo
		sameKey && (sameKey = sameKey && this.isSameClipInfo(submit));

		this.transformQuad(x, y, width, height, 0, this._curMat, this._transedPoints);
		if (!this.clipedOff(this._transedPoints)) {
			this._mesh.addQuad(this._transedPoints, Texture.NO_UV, rgba, false);
			//if (GlUtils.fillRectImgVb(_mesh._vb, _clipRect, x, y, width, height, Texture.DEF_UV, _curMat, rgba,this)){
			if (!sameKey) {
				submit = this._curSubmit = SubmitTexture.create(this, this._mesh, Value2D.create(ShaderDefines2D.TEXTURE2D, 0));
				this._submits[this._submits._length++] = submit;
				this._copyClipInfo(submit, this._globalClipMatrix);
				submit.shaderValue.textureHost = this._lastTex;
				//?????????????????????????????? clip1, drawTex(tex1), clip2, fillRect, drawTex(tex2)	????????????3???submit???
				//submit._key.copyFrom2(_submitKey, SubmitBase.KEY_DRAWTEXTURE, (_lastTex && _lastTex.bitmap)?_lastTex.bitmap.id: -1);
				submit._key.other = (this._lastTex && this._lastTex.bitmap) ? (this._lastTex.bitmap as Texture2D).id : -1
				submit._renderType = SubmitBase.TYPE_TEXTURE;
			}
			this._curSubmit._numEle += 6;
			this._mesh.indexNum += 6;
			this._mesh.vertNum += 4;
		}
	}

	fillRect(x: number, y: number, width: number, height: number, fillStyle: any): void {
		var drawstyle: DrawStyle = fillStyle ? DrawStyle.create(fillStyle) : this._shader2D.fillStyle;
		//var rgb = drawstyle.toInt() ;
		//???????????????????????? rgba???????????????????????????
		//var rgba:uint = ((rgb & 0xff0000) >> 16) | (rgb & 0x00ff00) | ((rgb & 0xff) << 16) | (_shader2D.ALPHA * 255) << 24;
		var rgba: number = this.mixRGBandAlpha(drawstyle.toInt());
		this._fillRect(x, y, width, height, rgba);
	}

	//TODO:coverage
	fillTexture(texture: Texture, x: number, y: number, width: number, height: number, type: string, offset: Point, other: any): void {
		//test
		/*
		var aa = 95 / 274, bb = 136 / 341, cc = (95 + 41) / 274, dd = (136 + 48) / 341;
		texture.uv = [aa,bb, cc,bb, cc,dd, aa,dd];
		texture.width = 41;
		texture.height = 48;
		*/
		//test

		if (!texture._getSource()) {
			this.sprite && ILaya.systemTimer.callLater(this, this._repaintSprite);
			return;
		}
		this._fillTexture(texture, texture.width, texture.height, texture.uvrect, x, y, width, height, type, offset.x, offset.y);
	}

	/**@internal */
	_fillTexture(texture: Texture, texw: number, texh: number, texuvRect: any[], x: number, y: number, width: number, height: number, type: string, offsetx: number, offsety: number): void {
		var submit: Submit = this._curSubmit;
		var sameKey: boolean = false;
		if (this._mesh.vertNum + 4 > Context._MAXVERTNUM) {
			this._mesh = MeshQuadTexture.getAMesh(this.isMain);
			this.meshlist.push(this._mesh);
			sameKey = false;
		}

		//filltexture?????????????????????rect?????????????????????uv
		var repeatx: boolean = true;
		var repeaty: boolean = true;
		switch (type) {
			case "repeat": break;
			case "repeat-x": repeaty = false; break;
			case "repeat-y": repeatx = false; break;
			case "no-repeat": repeatx = repeaty = false; break;
			default: break;
		}
		//??? _temp4Points ??????????????????????????????uv????????????uv???0???1???????????????uv????????????????????????????????????shader???????????????????????????uv
		var uv: any[] = this._temp4Points;
		var stu: number = 0; //uv??????
		var stv: number = 0;
		var stx: number = 0, sty: number = 0, edx: number = 0, edy: number = 0;
		if (offsetx < 0) {
			stx = x;
			stu = (-offsetx % texw) / texw;//????????????????????????u??????????????????
		} else {
			stx = x + offsetx;
		}
		if (offsety < 0) {
			sty = y;
			stv = (-offsety % texh) / texh;//????????????????????????v??????????????????
		} else {
			sty = y + offsety;
		}

		edx = x + width;
		edy = y + height;
		(!repeatx) && (edx = Math.min(edx, x + offsetx + texw));//x????????????????????????????????????
		(!repeaty) && (edy = Math.min(edy, y + offsety + texh));//y????????????????????????????????????
		if (edx < x || edy < y)
			return;
		if (stx > edx || sty > edy)
			return;

		//????????????uv
		var edu: number = (edx - x - offsetx) / texw;
		var edv: number = (edy - y - offsety) / texh;

		this.transformQuad(stx, sty, edx - stx, edy - sty, 0, this._curMat, this._transedPoints);
		//??????????????????uv????????????transformQuad????????????????????????_temp4Points
		uv[0] = stu; uv[1] = stv; uv[2] = edu; uv[3] = stv; uv[4] = edu; uv[5] = edv; uv[6] = stu; uv[7] = edv;
		if (!this.clipedOff(this._transedPoints)) {
			//????????????wrapmode????????????filltexture?????????????????????????????????
			//tex2d.wrapModeU = BaseTexture.WARPMODE_REPEAT;	//????????????????????????
			//tex2d.wrapModeV = BaseTexture.WARPMODE_REPEAT;
			//var rgba:int = mixRGBandAlpha(0xffffffff);
			//rgba = _mixRGBandAlpha(rgba, alpha);	???????????????????????????????????????????????????????????????
			var rgba: number = this._mixRGBandAlpha(0xffffffff, this._shader2D.ALPHA);

			this._mesh.addQuad(this._transedPoints, uv, rgba, true);

			var sv: Value2D = Value2D.create(ShaderDefines2D.TEXTURE2D, 0);
			//????????????????????????????????????????????????wrapmode?????????????????????????????????
			//if(texture.uvrect[2]<1.0||texture.uvrect[3]<1.0)//??????????????????????????????????????????????????????????????????shader
			sv.defines.add(ShaderDefines2D.FILLTEXTURE);
			((<any>sv)).u_TexRange = texuvRect.concat();
			submit = this._curSubmit = SubmitTexture.create(this, this._mesh, sv);
			this._submits[this._submits._length++] = submit;
			this._copyClipInfo(submit, this._globalClipMatrix);
			submit.shaderValue.textureHost = texture;
			submit._renderType = SubmitBase.TYPE_TEXTURE;
			this._curSubmit._numEle += 6;
			this._mesh.indexNum += 6;
			this._mesh.vertNum += 4;
		}
		this.breakNextMerge();	//????????????
	}


	/**
	 * ?????????????????????filter???????????????setFilter???????????????setColorFilter
	 * @param	value
	 */
	setColorFilter(filter: ColorFilter): void {
		SaveBase.save(this, SaveBase.TYPE_COLORFILTER, this, true);
		//_shader2D.filters = value;
		this._colorFiler = filter;
		this._curSubmit = SubmitBase.RENDERBASE;
		//_reCalculateBlendShader();
	}

	drawTexture(tex: Texture, x: number, y: number, width: number, height: number): void {
		this._drawTextureM(tex, x, y, width, height, null, 1, null);
	}

	drawTextures(tex: Texture, pos: any[], tx: number, ty: number): void {
		if (!tex._getSource()) //source?????????tex.active();
		{
			this.sprite && ILaya.systemTimer.callLater(this, this._repaintSprite);
			return;
		}

		//TODO ????????????
		var n: number = pos.length / 2;
		var ipos: number = 0;
		var bmpid: number = (tex.bitmap as Texture2D).id;
		for (var i: number = 0; i < n; i++) {
			this._inner_drawTexture(tex, bmpid, pos[ipos++] + tx, pos[ipos++] + ty, 0, 0, null, null, 1.0, false);
		}

		/*
		var pre:Rectangle = _clipRect;
		_clipRect = MAXCLIPRECT;
		if (!_drawTextureM(tex, pos[0], pos[1], tex.width, tex.height,null, 1)) {
			throw "drawTextures err";
			return;
		}
		_clipRect = pre;
		
		Stat.drawCall++;//= pos.length / 2;
		
		if (pos.length < 4)
			return;
		
		var finalVB:VertexBuffer2D = _curSubmit._vb || _vb;
		var sx:Number = _curMat.a, sy:Number = _curMat.d;
		var vpos:int = finalVB._byteLength >> 2;// + Context._RECTVBSIZE;
		finalVB.byteLength = finalVB._byteLength + (pos.length / 2 - 1) * Context._RECTVBSIZEBYTE;
		var vbdata:Float32Array = finalVB.getFloat32Array();
		for (var i:int = 2, sz:int = pos.length; i < sz; i += 2) {
			GlUtils.copyPreImgVb(finalVB,vpos, (pos[i] - pos[i - 2]) * sx, (pos[i + 1] - pos[i - 1]) * sy,vbdata);
			_curSubmit._numEle += 6;
			vpos += Context._RECTVBSIZE;
		}
		*/
	}

	/**
	 * ???drawTexture??????????????????submit???????????? SubmitTexture
	 * @param	vbSize
	 * @param	alpha
	 * @param	webGLImg
	 * @param	tex
	 */
	//TODO:coverage
	private _drawTextureAddSubmit(imgid: number, tex: Texture): void {
		//var alphaBack:Number = shader.ALPHA;
		//shader.ALPHA *= alpha;

		var submit: SubmitTexture = null;
		submit = SubmitTexture.create(this, this._mesh, Value2D.create(ShaderDefines2D.TEXTURE2D, 0));
		this._submits[this._submits._length++] = submit;
		submit.shaderValue.textureHost = tex;
		//submit._key.copyFrom2(_submitKey, SubmitBase.KEY_DRAWTEXTURE, imgid);
		submit._key.other = imgid;
		//submit._key.alpha = shader.ALPHA;
		submit._renderType = SubmitBase.TYPE_TEXTURE;
		this._curSubmit = submit;

		//shader.ALPHA = alphaBack;
	}

	/**@internal */
	_drawTextureM(tex: Texture, x: number, y: number, width: number, height: number, m: Matrix, alpha: number, uv: any[]|null): boolean {
		// ??????sprite????????????????????????????????????
		var cs = this.sprite;
		if (!tex._getSource(function (): void {
			if (cs) {
				cs.repaint();	// ?????????calllater???callater??????cacheas normal????????????????????????
			}
		})) { //source?????????tex.active();
			return false;
		}

		return this._inner_drawTexture(tex, (tex.bitmap as Texture2D).id, x, y, width, height, m, uv, alpha, false);
	}

	/**@internal */
	_drawRenderTexture(tex: RenderTexture2D, x: number, y: number, width: number, height: number, m: Matrix, alpha: number, uv: any[]): boolean {
		return this._inner_drawTexture((<Texture>(tex as any)), -1, x, y, width, height, m, uv, 1.0, false);
	}

	//TODO:coverage
	submitDebugger(): void {
		this._submits[this._submits._length++] = SubmitCMD.create([], function (): void { debugger; }, this);
	}

	/*
	private function copyClipInfo(submit:Submit, clipInfo:Array):void {
		var cd:Array = submit.shaderValue.clipDir;
		cd[0] = clipInfo[2]; cd[1] = clipInfo[3]; cd[2] = clipInfo[4]; cd[3] = clipInfo[5];
		var cp:Array = submit.shaderValue.clipRect;
		cp[0] = clipInfo[0]; cp[1] = clipInfo[1];
		submit.clipInfoID = this._clipInfoID;
	}
	*/
	/**@internal */
	_copyClipInfo(submit: SubmitBase, clipInfo: Matrix): void {
		var cm: any[] = submit.shaderValue.clipMatDir;
		cm[0] = clipInfo.a; cm[1] = clipInfo.b; cm[2] = clipInfo.c; cm[3] = clipInfo.d;
		var cmp: any[] = submit.shaderValue.clipMatPos;
		cmp[0] = clipInfo.tx; cmp[1] = clipInfo.ty;
		submit.clipInfoID = this._clipInfoID;

		if (this._clipInCache) {
			submit.shaderValue.clipOff[0] = 1;
		}
	}


	private isSameClipInfo(submit: SubmitBase): boolean {
		return (submit.clipInfoID === this._clipInfoID);
		/*
		var cd:Array = submit.shaderValue.clipDir;
		var cp:Array = submit.shaderValue.clipRect;
		
		if (clipInfo[0] != cp[0] || clipInfo[1] != cp[1] || clipInfo[2] != cd[0] || clipInfo[3] != cd[1] || clipInfo[4] != cd[2] || clipInfo[5] != cd[3] ) 
			return false;
		return true;
		*/
	}

	/**
	 * @internal
	 * ?????????????????????????????????
	 * @param	tex
	 * @param	minVertNum
	 */
	_useNewTex2DSubmit(tex: Texture, minVertNum: number): void {
		//var sameKey:Boolean = tex.bitmap.id >= 0 && preKey.submitType === SubmitBase.KEY_DRAWTEXTURE && preKey.other === tex.bitmap.id ;

		if (this._mesh.vertNum + minVertNum > Context._MAXVERTNUM) {
			this._mesh = MeshQuadTexture.getAMesh(this.isMain);//????????????mesh  TODO ??????_mesh????????????????????????????????????????????????????????????_mesh??????????????????????????? 
			this.meshlist.push(this._mesh);
			//sameKey = false;
		}

		var submit: SubmitTexture = SubmitTexture.create(this, this._mesh, Value2D.create(ShaderDefines2D.TEXTURE2D, 0));
		this._submits[this._submits._length++] = this._curSubmit = submit;
		submit.shaderValue.textureHost = tex;
		this._copyClipInfo(submit, this._globalClipMatrix);
	}

	/**
	 * @internal
	 * ????????????????????????texture???submit???alpha???clip???????????????rect
	 */
	_drawTexRect(x: number, y: number, w: number, h: number, uv: any[]): void {
		this.transformQuad(x, y, w, h, this._italicDeg, this._curMat, this._transedPoints);
		//???????????????????????????????????????????????????????????????????????????????????????????????????
		var ops: any[] = this._transedPoints;
		ops[0] = (ops[0] + 0.5) | 0;
		ops[1] = (ops[1] + 0.5) | 0;
		ops[2] = (ops[2] + 0.5) | 0;
		ops[3] = (ops[3] + 0.5) | 0;
		ops[4] = (ops[4] + 0.5) | 0;
		ops[5] = (ops[5] + 0.5) | 0;
		ops[6] = (ops[6] + 0.5) | 0;
		ops[7] = (ops[7] + 0.5) | 0;

		if (!this.clipedOff(this._transedPoints)) {
			this._mesh.addQuad(this._transedPoints, uv, this._fillColor, true);
			this._curSubmit._numEle += 6;
			this._mesh.indexNum += 6;
			this._mesh.vertNum += 4;
		}
	}

	drawCallOptimize(enable: boolean): boolean {
		this._charSubmitCache.enable(enable, this);
		return enable;
	}

	/**
	 * @internal
	 * @param	tex {Texture | RenderTexture }
	 * @param  imgid ??????id?????????????????????
	 * @param	x
	 * @param	y
	 * @param	width
	 * @param	height
	 * @param	m
	 * @param	alpha
	 * @param	uv
	 * @return
	 */
	_inner_drawTexture(tex: Texture, imgid: number, x: number, y: number, width: number, height: number, m: Matrix, uv: ArrayLike<number>|null, alpha: number, lastRender: boolean): boolean {
		if (width <= 0 || height <= 0) {
			return false;
		}
		var preKey: SubmitKey = this._curSubmit._key;
		uv = uv || tex._uv
		//?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
		//?????????????????????drawTexture???drawTriangle?????????
		if (preKey.submitType === SubmitBase.KEY_TRIANGLES && preKey.other === imgid) {
			var tv: Float32Array = this._drawTexToDrawTri_Vert;
			tv[0] = x; tv[1] = y; tv[2] = x + width, tv[3] = y, tv[4] = x + width, tv[5] = y + height, tv[6] = x, tv[7] = y + height;
			this._drawTriUseAbsMatrix = true;
			var tuv: Float32Array = this._tempUV;
			tuv[0] = uv[0]; tuv[1] = uv[1]; tuv[2] = uv[2]; tuv[3] = uv[3]; tuv[4] = uv[4]; tuv[5] = uv[5]; tuv[6] = uv[6]; tuv[7] = uv[7];
			this.drawTriangles(tex, 0, 0, tv, tuv, this._drawTexToDrawTri_Index, m, alpha, null, null);//???tuv?????????uv???????????????
			this._drawTriUseAbsMatrix = false;
			return true;
		}

		var mesh = this._mesh;
		var submit: SubmitTexture = this._curSubmit;
		var ops: any[] = lastRender ? this._charSubmitCache.getPos() : this._transedPoints;

		//?????????????????????_mesh????????????????????????samekey
		this.transformQuad(x, y, width || tex.width, height || tex.height, this._italicDeg, m || this._curMat, ops);

		if (this.drawTexAlign) {
			var round: Function = Math.round;
			ops[0] = round(ops[0]);//  (ops[0] + 0.5) | 0;	// ????????????????????????????????????
			ops[1] = round(ops[1]);
			ops[2] = round(ops[2]);
			ops[3] = round(ops[3]);
			ops[4] = round(ops[4]);
			ops[5] = round(ops[5]);
			ops[6] = round(ops[6]);
			ops[7] = round(ops[7]);
			this.drawTexAlign = false;	//????????????
		}

		var rgba: number = this._mixRGBandAlpha(0xffffffff, this._shader2D.ALPHA * alpha);

		//lastRender = false;
		if (lastRender) {
			this._charSubmitCache.add(this, tex, imgid, ops, uv, rgba);
			return true;
		}

		this._drawCount++;

		var sameKey: boolean = imgid >= 0 && preKey.submitType === SubmitBase.KEY_DRAWTEXTURE && preKey.other === imgid;

		//clipinfo
		sameKey && (sameKey = sameKey && this.isSameClipInfo(submit));

		this._lastTex = tex;

		if (mesh.vertNum + 4 > Context._MAXVERTNUM) {
			mesh = this._mesh = MeshQuadTexture.getAMesh(this.isMain);//????????????mesh  TODO ??????_mesh????????????????????????????????????????????????????????????_mesh??????????????????????????? 
			this.meshlist.push(mesh);
			sameKey = false;	//??????mesh?????????samekey???
		}

		{
			mesh.addQuad(ops, uv, rgba, true);
			if (!sameKey) {
				this._submits[this._submits._length++] = this._curSubmit = submit = SubmitTexture.create(this, mesh, Value2D.create(ShaderDefines2D.TEXTURE2D, 0));
				submit.shaderValue.textureHost = tex;
				submit._key.other = imgid;
				this._copyClipInfo(submit, this._globalClipMatrix);
			}
			submit._numEle += 6;
			mesh.indexNum += 6;
			mesh.vertNum += 4;
			return true;
		}
		return false;
	}

	/**
	 * ??????4??????????????????????????????????????????????????????????????????????????????
	 * @param	a		?????????8???????????????4??????
	 * @param	out		??????
	 */
	transform4Points(a: any[], m: Matrix, out: any[]): void {
		/*
			out[0] = 846;
			out[1] = 656;
			out[2] = 881;
			out[3] = 657;
			out[4] = 880;
			out[5] = 732;
			out[6] = 844;
			out[7] = 731;
			return ;
		*/
		//var m:Matrix = _curMat;
		var tx: number = m.tx;
		var ty: number = m.ty;
		var ma: number = m.a;
		var mb: number = m.b;
		var mc: number = m.c;
		var md: number = m.d;
		var a0: number = a[0];
		var a1: number = a[1];
		var a2: number = a[2];
		var a3: number = a[3];
		var a4: number = a[4];
		var a5: number = a[5];
		var a6: number = a[6];
		var a7: number = a[7];
		if (m._bTransform) {
			out[0] = a0 * ma + a1 * mc + tx; out[1] = a0 * mb + a1 * md + ty;
			out[2] = a2 * ma + a3 * mc + tx; out[3] = a2 * mb + a3 * md + ty;
			out[4] = a4 * ma + a5 * mc + tx; out[5] = a4 * mb + a5 * md + ty;
			out[6] = a6 * ma + a7 * mc + tx; out[7] = a6 * mb + a7 * md + ty;
		} else {
			out[0] = a0 + tx; out[1] = a1 + ty;
			out[2] = a2 + tx; out[3] = a3 + ty;
			out[4] = a4 + tx; out[5] = a5 + ty;
			out[6] = a6 + tx; out[7] = a7 + ty;
		}
	}

	/**
	 * pt??????????????????????????????clip???????????????????????????
	 * @param	pt
	 * @return
	 */
	clipedOff(pt: any[]): boolean {
		//TODO
		if (this._clipRect.width <= 0 || this._clipRect.height <= 0)
			return true;
		return false;
	}

	/**
	 * ?????????????????????????????????????????????????????????????????? 
	 * @param	x
	 * @param	y
	 * @param	w
	 * @param	h
	 * @param   italicDeg ??????????????????????????????0?????????????????????????????????????????????????????????
	 */
	transformQuad(x: number, y: number, w: number, h: number, italicDeg: number, m: Matrix, out: any[]): void {
		/*
		out[0] = 100.1; out[1] = 100.1;
		out[2] = 101.1; out[3] = 100.1;
		out[4] = 101.1; out[5] = 101.1;
		out[6] = 100.1; out[7] = 101.1;
		return;
		*/
		var xoff: number = 0;
		if (italicDeg != 0) {
			xoff = Math.tan(italicDeg * Math.PI / 180) * h;
		}
		var maxx: number = x + w; var maxy: number = y + h;

		var tx: number = m.tx;
		var ty: number = m.ty;
		var ma: number = m.a;
		var mb: number = m.b;
		var mc: number = m.c;
		var md: number = m.d;
		var a0: number = x + xoff;
		var a1: number = y;
		var a2: number = maxx + xoff;
		var a3: number = y;
		var a4: number = maxx;
		var a5: number = maxy;
		var a6: number = x;
		var a7: number = maxy;
		if (m._bTransform) {
			out[0] = a0 * ma + a1 * mc + tx; out[1] = a0 * mb + a1 * md + ty;
			out[2] = a2 * ma + a3 * mc + tx; out[3] = a2 * mb + a3 * md + ty;
			out[4] = a4 * ma + a5 * mc + tx; out[5] = a4 * mb + a5 * md + ty;
			out[6] = a6 * ma + a7 * mc + tx; out[7] = a6 * mb + a7 * md + ty;
		} else {
			out[0] = a0 + tx; out[1] = a1 + ty;
			out[2] = a2 + tx; out[3] = a3 + ty;
			out[4] = a4 + tx; out[5] = a5 + ty;
			out[6] = a6 + tx; out[7] = a7 + ty;
		}
	}

	pushRT(): void {
		this.addRenderObject(SubmitCMD.create(null, RenderTexture2D.pushRT, this));
	}
	popRT(): void {
		this.addRenderObject(SubmitCMD.create(null, RenderTexture2D.popRT, this));
		this.breakNextMerge();
	}

	//TODO:coverage
	useRT(rt: RenderTexture2D): void {
		//??????????????????cliprect???????????????????????????????????????????????????????????????????????????context?????????????????????????????????
		function _use(rt: RenderTexture2D): void {
			if (!rt) {
				throw 'error useRT'
			} else {
				rt.start();
				rt.clear(0, 0, 0, 0);
			}
		}

		this.addRenderObject(SubmitCMD.create([rt], _use, this));
		this.breakNextMerge();
	}

	/**
	 * ????????????rt???restore??????
	 * @param	rt
	 */
	//TODO:coverage
	RTRestore(rt: RenderTexture2D): void {
		function _restore(rt: RenderTexture2D): void {
			rt.restore();
		}
		this.addRenderObject(SubmitCMD.create([rt], _restore, this));
		this.breakNextMerge();
	}

	/**
	 * ????????????submit??????
	 * ????????????rt?????????
	 */
	breakNextMerge(): void {
		this._curSubmit = SubmitBase.RENDERBASE;
	}

	//TODO:coverage
	private _repaintSprite(): void {
		this.sprite && this.sprite.repaint();
	}

	/**
	 * 
	 * @param	tex
	 * @param	x			
	 * @param	y
	 * @param	width
	 * @param	height
	 * @param	transform	???????????????????????????
	 * @param	tx			???????????????
	 * @param	ty
	 * @param	alpha
	 */
	drawTextureWithTransform(tex: Texture, x: number, y: number, width: number, height: number, transform: Matrix|null, tx: number, ty: number, alpha: number, blendMode: string|null, colorfilter: ColorFilter|null = null, uv?: number[]): void {
		var oldcomp: string ;
		var curMat: Matrix = this._curMat;
		if (blendMode) {
			oldcomp = this.globalCompositeOperation;
			this.globalCompositeOperation = blendMode;
		}
		var oldColorFilter = this._colorFiler;
		if (colorfilter) {
			this.setColorFilter(colorfilter);
		}

		if (!transform) {
			this._drawTextureM(tex, x + tx, y + ty, width, height, curMat, alpha, uv);
			if (blendMode) {
				this.globalCompositeOperation = oldcomp;
			}
			if (colorfilter) {
				this.setColorFilter(oldColorFilter);
			}
			return;
		}
		var tmpMat: Matrix = this._tmpMatrix;
		//??????transform,???????????????tx???ty??????????????????????????????transform
		tmpMat.a = transform.a; tmpMat.b = transform.b; tmpMat.c = transform.c; tmpMat.d = transform.d; tmpMat.tx = transform.tx + tx; tmpMat.ty = transform.ty + ty;
		tmpMat._bTransform = transform._bTransform;

		if (transform && curMat._bTransform) {
			// ???????????????????????????????????????????????????mul?????????
			Matrix.mul(tmpMat, curMat, tmpMat);
			transform = tmpMat;
			transform._bTransform = true;
		} else {
			//??????curmat???????????????
			tmpMat.tx += curMat.tx;
			tmpMat.ty += curMat.ty;
			transform = tmpMat;
		}
		this._drawTextureM(tex, x, y, width, height, transform, alpha, uv);
		if (blendMode) {
			this.globalCompositeOperation = oldcomp;
		}
		if (colorfilter) {
			this.setColorFilter(oldColorFilter);
		}
	}

	/**
	 * * ???ctx??????submits????????????????????????target???
	 * @param	ctx
	 * @param	target
	 */
	private _flushToTarget(context: Context, target: RenderTexture2D): void {
		//if (target._destroy) return;
		//var preworldClipRect:Rectangle = RenderState2D.worldClipRect;
		//?????????????????????????????????context?????????????????????????????????
		RenderState2D.worldScissorTest = false;
		var gl: WebGLRenderingContext = LayaGL.instance;
		gl.disable(gl.SCISSOR_TEST);

		var preAlpha: number = RenderState2D.worldAlpha;
		var preMatrix4: any[] = RenderState2D.worldMatrix4;
		var preMatrix: Matrix = RenderState2D.worldMatrix;

		var preShaderDefines: ShaderDefines2D = RenderState2D.worldShaderDefines;

		RenderState2D.worldMatrix = Matrix.EMPTY;

		RenderState2D.restoreTempArray();
		RenderState2D.worldMatrix4 = RenderState2D.TEMPMAT4_ARRAY;
		RenderState2D.worldAlpha = 1;
		//RenderState2D.worldFilters = null;
		//RenderState2D.worldShaderDefines = null;
		BaseShader.activeShader = null;

		target.start();
		// ???????????????????????????clear???????????????????????????cacheas????????????
		// ????????????sprite cacheas normal ?????????????????????cacheas bitmap????????????mask??????????????????????????? _flushToTarget???drawCamvase,?????????target??????????????????
		// ??????cacheas normal ?????? RenderSprite?????????????????? _cacheStyle.canvas ?????????????????????
		if (context._submits._length > 0)
			target.clear(0, 0, 0, 0);

		context._curSubmit = SubmitBase.RENDERBASE;
		context.flush();
		context.clear();
		target.restore();
		context._curSubmit = SubmitBase.RENDERBASE;
		//context._canvas
		BaseShader.activeShader = null;
		RenderState2D.worldAlpha = preAlpha;
		RenderState2D.worldMatrix4 = preMatrix4;
		RenderState2D.worldMatrix = preMatrix;
		//RenderState2D.worldFilters = preFilters;
		//RenderState2D.worldShaderDefines = preShaderDefines;
	}

	drawCanvas(canvas: HTMLCanvas, x: number, y: number, width: number, height: number): void {
		if (!canvas) return;
		var src: Context = canvas.context as Context;
		var submit: ISubmit;
		if (src._targets) {
			//?????????????????????src._targets???
			/*
			this._submits[this._submits._length++] = SubmitCanvas.create(src, 0, null);
			_curSubmit = SubmitBase.RENDERBASE;
			//??????src._targets
			//drawTexture(src._targets.target.getTexture(), x, y, width, height, 0, 0);
			*/
			//???????????????canvas??????????????????????????????????????????RenderSprite?????????????????????submit
			if (src._submits._length > 0) {
				submit = SubmitCMD.create([src, src._targets], this._flushToTarget, this);
				this._submits[this._submits._length++] = submit;
			}
			//??????????????????????????????????????????
			this._drawRenderTexture(src._targets, x, y, width, height, null, 1.0, RenderTexture2D.flipyuv);
			this._curSubmit = SubmitBase.RENDERBASE;
			/*
			this._submits[this._submits._length++] = SubmitCanvas.create(src, 0, null);
			//src._targets.flush(src);
			_curSubmit = SubmitBase.RENDERBASE;
			//src._targets.drawTo(this, x, y, width, height);
			//drawTexture(src._targets.target.getTexture(), x, y, width, height, 0, 0);
			_drawRenderTexture(src._targets, x, y, width, height,null,1.0, RenderTexture.flipyuv);
			*/
		} else {
			var canv: WebGLCacheAsNormalCanvas = (<WebGLCacheAsNormalCanvas>(canvas as any));
			if (canv.touches) {
				((<any[]>canv.touches)).forEach(function (v: CharRenderInfo): void { v.touch(); });
			}

			submit = SubmitCanvas.create(canvas, this._shader2D.ALPHA, this._shader2D.filters);
			this._submits[this._submits._length++] = submit;
			((<SubmitCanvas>submit))._key.clear();
			//var sx:Number = width / canvas.width;
			//var sy:Number = height / canvas.height;
			var mat: Matrix = ((<SubmitCanvas>submit))._matrix;
			this._curMat.copyTo(mat);
			//sx != 1 && sy != 1 && mat.scale(sx, sy);
			// ?????????????????????????????????
			var tx: number = mat.tx, ty: number = mat.ty;
			mat.tx = mat.ty = 0;
			mat.transformPoint(Point.TEMP.setTo(x, y));	// ????????????????????? (x,y)
			mat.translate(Point.TEMP.x + tx, Point.TEMP.y + ty);	// ??????????????? (tx,ty)

			Matrix.mul(canv.invMat, mat, mat);

			this._curSubmit = SubmitBase.RENDERBASE;
		}
	}

	drawTarget(rt: RenderTexture2D, x: number, y: number, width: number, height: number, m: Matrix, shaderValue: Value2D, uv: ArrayLike<number>|null = null, blend: number = -1): boolean {
		this._drawCount++;
		var rgba: number = 0xffffffff;
		if (this._mesh.vertNum + 4 > Context._MAXVERTNUM) {
			this._mesh = MeshQuadTexture.getAMesh(this.isMain);//????????????mesh  TODO ??????_mesh????????????????????????????????????????????????????????????_mesh??????????????????????????? 
			this.meshlist.push(this._mesh);
		}

		//?????????????????????_mesh????????????????????????samekey
		this.transformQuad(x, y, width, height, 0, m || this._curMat, this._transedPoints);
		if (!this.clipedOff(this._transedPoints)) {
			this._mesh.addQuad(this._transedPoints, uv || Texture.DEF_UV, 0xffffffff, true);
			//if (GlUtils.fillRectImgVb( _mesh._vb, _clipRect, x, y, width , height , uv || Texture.DEF_UV, m || _curMat, rgba, this)) {
			var submit: SubmitTarget = this._curSubmit = SubmitTarget.create(this, this._mesh, shaderValue, rt);
			submit.blendType = (blend == -1) ? this._nBlendType : blend;
			this._copyClipInfo((<SubmitBase>(submit as any)), this._globalClipMatrix);
			submit._numEle = 6;
			this._mesh.indexNum += 6;
			this._mesh.vertNum += 4;
			this._submits[this._submits._length++] = submit;
			//??????drawTarget?????????
			this._curSubmit = SubmitBase.RENDERBASE
			return true;
		}
		//??????drawTarget?????????
		this._curSubmit = SubmitBase.RENDERBASE
		return false;
	}

	drawTriangles(tex: Texture, 
			x: number, y: number, 
			vertices: Float32Array, 
			uvs : Float32Array, 
			indices : Uint16Array, 
			matrix : Matrix, alpha: number, color: ColorFilter, blendMode: string, colorNum: number = 0xffffffff): void {

		if (!tex._getSource()) { //source?????????tex.active();
			if (this.sprite) {
				ILaya.systemTimer.callLater(this, this._repaintSprite);
			}
			return;
		}
		var oldcomp: string|null = null;
		if (blendMode) {
			oldcomp = this.globalCompositeOperation;
			this.globalCompositeOperation = blendMode;
		}
		this._drawCount++;

		// ????????????????????????????????????????????????
		var tmpMat = this._tmpMatrix;
		var triMesh = this._triangleMesh!;

		var oldColorFilter: ColorFilter|null = null;
		var needRestorFilter: boolean = false;
		if (color) {
			oldColorFilter = this._colorFiler;
			//????????????save?????????????????????
			this._colorFiler = color;
			this._curSubmit = SubmitBase.RENDERBASE;
			needRestorFilter = oldColorFilter != color;
		}
		var webGLImg: Bitmap = (<Bitmap>tex.bitmap);
		var preKey: SubmitKey = this._curSubmit._key;
		var sameKey: boolean = preKey.submitType === SubmitBase.KEY_TRIANGLES && preKey.other === webGLImg.id && preKey.blendShader == this._nBlendType;

		//var rgba:int = mixRGBandAlpha(0xffffffff);
		//rgba = _mixRGBandAlpha(rgba, alpha);	???????????????????????????????????????????????????????????????
		if (triMesh.vertNum + vertices.length / 2 > Context._MAXVERTNUM) {
			triMesh = this._triangleMesh = MeshTexture.getAMesh(this.isMain);//????????????mesh  TODO ??????_mesh????????????????????????????????????????????????????????????_mesh??????????????????????????? 
			this.meshlist.push(triMesh);
			sameKey = false;	//??????mesh?????????samekey???
		}
		if (!sameKey) {
			//??????????????????submit
			var submit: SubmitTexture = this._curSubmit = SubmitTexture.create(this, triMesh, Value2D.create(ShaderDefines2D.TEXTURE2D, 0));
			submit.shaderValue.textureHost = tex;
			submit._renderType = SubmitBase.TYPE_TEXTURE;
			submit._key.submitType = SubmitBase.KEY_TRIANGLES;
			submit._key.other = webGLImg.id;
			this._copyClipInfo(submit, this._globalClipMatrix);
			this._submits[this._submits._length++] = submit;
		}

		var rgba: number = this._mixRGBandAlpha(colorNum, this._shader2D.ALPHA * alpha);
		if (!this._drawTriUseAbsMatrix) {
			if (!matrix) {
				tmpMat.a = 1; tmpMat.b = 0; tmpMat.c = 0; tmpMat.d = 1; tmpMat.tx = x; tmpMat.ty = y;
			} else {
				tmpMat.a = matrix.a; tmpMat.b = matrix.b; tmpMat.c = matrix.c; tmpMat.d = matrix.d; tmpMat.tx = matrix.tx + x; tmpMat.ty = matrix.ty + y;
			}
			Matrix.mul(tmpMat, this._curMat, tmpMat);
			triMesh.addData(vertices, uvs, indices, tmpMat || this._curMat, rgba);
		} else {
			// ???????????????drawtexture?????????drawTriangle???????????????matrix??????????????????xy??????0
			triMesh.addData(vertices, uvs, indices, matrix, rgba);
		}
		this._curSubmit._numEle += indices.length;

		if (needRestorFilter) {
			this._colorFiler = oldColorFilter;
			this._curSubmit = SubmitBase.RENDERBASE;
		}
		if (blendMode) {
			this.globalCompositeOperation = oldcomp!;
		}
		//return true;
	}

	transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
		SaveTransform.save(this);
		Matrix.mul(Matrix.TEMP.setTo(a, b, c, d, tx, ty), this._curMat, this._curMat);	//TODO ????????????????????????????????????set
		this._curMat._checkTransform();
	}

	//TODO:coverage
	/**@internal */
	_transformByMatrix(matrix: Matrix, tx: number, ty: number): void {
		matrix.setTranslate(tx, ty);
		Matrix.mul(matrix, this._curMat, this._curMat);
		matrix.setTranslate(0, 0);
		this._curMat._bTransform = true;
	}

	//TODO:coverage
	setTransformByMatrix(value: Matrix): void {
		value.copyTo(this._curMat);
	}

	rotate(angle: number): void {
		SaveTransform.save(this);
		this._curMat.rotateEx(angle);
	}

	scale(scaleX: number, scaleY: number): void {
		SaveTransform.save(this);
		this._curMat.scaleEx(scaleX, scaleY);
	}

	clipRect(x: number, y: number, width: number, height: number): void {
		SaveClipRect.save(this);
		if (this._clipRect == Context.MAXCLIPRECT) {
			this._clipRect = new Rectangle(x, y, width, height);
		} else {
			this._clipRect.width = width;
			this._clipRect.height = height;

			//???xy????????????????????????????????????????????????????????????shader????????????????????????????????????normalize???
			this._clipRect.x = x;
			this._clipRect.y = y;
		}
		this._clipID_Gen++;
		this._clipID_Gen %= 10000;
		this._clipInfoID = this._clipID_Gen;
		var cm: Matrix = this._globalClipMatrix;
		//TEMP ??????clip??????????????????????????????????????????????????????????????? ??????????????????
		var minx: number = cm.tx;
		var miny: number = cm.ty;
		var maxx: number = minx + cm.a;
		var maxy: number = miny + cm.d;
		//TEMP end

		if (this._clipRect.width >= Context._MAXSIZE) {
			cm.a = cm.d = Context._MAXSIZE;
			cm.b = cm.c = cm.tx = cm.ty = 0;
		} else {
			//????????????????????????
			if (this._curMat._bTransform) {
				cm.tx = this._clipRect.x * this._curMat.a + this._clipRect.y * this._curMat.c + this._curMat.tx;
				cm.ty = this._clipRect.x * this._curMat.b + this._clipRect.y * this._curMat.d + this._curMat.ty;
				cm.a = this._clipRect.width * this._curMat.a;
				cm.b = this._clipRect.width * this._curMat.b;
				cm.c = this._clipRect.height * this._curMat.c;
				cm.d = this._clipRect.height * this._curMat.d;
			} else {
				cm.tx = this._clipRect.x + this._curMat.tx;
				cm.ty = this._clipRect.y + this._curMat.ty;
				cm.a = this._clipRect.width;
				cm.b = cm.c = 0;
				cm.d = this._clipRect.height;
			}
			if (this._incache) {
				this._clipInCache = true;
			}
		}

		//TEMP ??????clip??????????????????????????????????????????????????????,??????
		if (cm.a > 0 && cm.d > 0) {
			var cmaxx: number = cm.tx + cm.a;
			var cmaxy: number = cm.ty + cm.d;
			if (cmaxx <= minx || cmaxy <= miny || cm.tx >= maxx || cm.ty >= maxy) {
				//???????????????
				cm.a = -0.1; cm.d = -0.1;
			} else {
				if (cm.tx < minx) {
					cm.a -= (minx - cm.tx);
					cm.tx = minx;
				}
				if (cmaxx > maxx) {
					cm.a -= (cmaxx - maxx);
				}
				if (cm.ty < miny) {
					cm.d -= (miny - cm.ty);
					cm.ty = miny;
				}
				if (cmaxy > maxy) {
					cm.d -= (cmaxy - maxy);
				}
				if (cm.a <= 0) cm.a = -0.1;
				if (cm.d <= 0) cm.d = -0.1;
			}
		}
		//TEMP end
	}

	/**
	 * ???setIBVB??????drawMesh
	 * type ?????????????????????????????????????????????offset?????????attribute???????????????
	 * @param	x
	 * @param	y
	 * @param	ib
	 * @param	vb
	 * @param	numElement
	 * @param	mat
	 * @param	shader
	 * @param	shaderValues
	 * @param	startIndex
	 * @param	offset
	 */
	//TODO:coverage
	drawMesh(x: number, y: number, ib: IndexBuffer2D, vb: VertexBuffer2D, numElement: number, mat: Matrix, shader: Shader, shaderValues: Value2D, startIndex: number = 0): void {
		;
	}

	addRenderObject(o: ISubmit): void {
		this._submits[this._submits._length++] = o;
	}

	/**
	 * 
	 * @param	start
	 * @param	end
	 */
	submitElement(start: number, end: number): number {
		//_ib._bind_upload() || _ib._bind();
		//_vb._bind_upload() || _vb._bind();
		var mainCtx: boolean = this.isMain;
		var renderList: any[] = this._submits;
		var ret: number = ((<any>renderList))._length;
		end < 0 && (end = ((<any>renderList))._length);
		var submit: Submit = SubmitBase.RENDERBASE;
		while (start < end) {
			this._renderNextSubmitIndex = start + 1;
			if (renderList[start] === SubmitBase.RENDERBASE) {
				start++;
				continue;
			}
			SubmitBase.preRender = submit;
			submit = renderList[start];
			//??????submitscissor??????????????????
			start += submit.renderSubmit();
			//?????????????????????????????????????????????????????????releaseRender. ??????????????????????????????????????????submit?????????????????????????????????????????????????????????????????????????????????
		}
		return ret;
	}

	flush(): number {
		this._clipID_Gen = 0;
		var ret: number = this.submitElement(0, this._submits._length);
		this._path && this._path.reset();
		SkinMeshBuffer.instance && SkinMeshBuffer.getInstance().reset();

		//Stat.mesh2DNum += meshlist.length;
		this._curSubmit = SubmitBase.RENDERBASE;

		for (var i: number = 0, sz: number = this.meshlist.length; i < sz; i++) {
			var curm: Mesh2D = this.meshlist[i];
			curm.canReuse ? (curm.releaseMesh()) : (curm.destroy());
		}
		this.meshlist.length = 0;

		this._mesh = MeshQuadTexture.getAMesh(this.isMain);	//TODO ???????????????
		this._pathMesh = MeshVG.getAMesh(this.isMain);
		this._triangleMesh = MeshTexture.getAMesh(this.isMain);
		this.meshlist.push(this._mesh, this._pathMesh, this._triangleMesh);

		this._flushCnt++;
		//charbook gc
		if (this._flushCnt % 60 == 0 && this.isMain) {
			if (TextRender.textRenderInst) {
				TextRender.textRenderInst.GC();
			}
		}
		return ret;
	}

	/*******************************************start????????????***************************************************/

	beginPath(convex: boolean = false): void {
		var tPath: Path = this._getPath();
		tPath.beginPath(convex);
	}

	closePath(): void {
		//_path.closePath = true;
		this._path.closePath();
	}

	/**
	 * ????????????path???
	 * @param	points [x,y,x,y....]	???????????????????????????????????????????????????????????????
	 * @param	close	????????????
	 * @param   convex ????????????????????????convex??????????????????????????????fill???????????????????????????fill????????????????????????convex?????????????????????path
	 * @param	dx  ??????????????????????????????????????????????????????????????????
	 * @param	dy
	 */
	addPath(points: any[], close: boolean, convex: boolean, dx: number, dy: number): void {
		var ci: number = 0;
		for (var i: number = 0, sz: number = points.length / 2; i < sz; i++) {
			var x1: number = points[ci] + dx, y1: number = points[ci + 1] + dy;
			points[ci] = x1;
			points[ci + 1] = y1;
			ci += 2;
		}
		this._getPath().push(points, convex);
	}

	fill(): void {
		var m: Matrix = this._curMat;
		var tPath: Path = this._getPath();
		var submit: Submit = this._curSubmit;
		var sameKey: boolean = (submit._key.submitType === SubmitBase.KEY_VG && submit._key.blendShader === this._nBlendType);
		sameKey && (sameKey = sameKey && this.isSameClipInfo(submit));
		if (!sameKey) {
			this._curSubmit = this.addVGSubmit(this._pathMesh);
		}
		var rgba: number = this.mixRGBandAlpha(this.fillStyle.toInt());
		var curEleNum: number = 0;
		var idx: any[];
		//???????????????path????????????????????????mesh???????????????????????????alpha
		for (var i: number = 0, sz: number = tPath.paths.length; i < sz; i++) {
			var p: any = tPath.paths[i];
			var vertNum: number = p.path.length / 2;
			if (vertNum < 3 || (vertNum == 3 && !p.convex))
				continue;
			var cpath: any[] = p.path.concat();
			// ????????????????????????
			var pi: number = 0;
			var xp: number, yp: number;
			var _x: number, _y: number;
			if (m._bTransform) {
				for (pi = 0; pi < vertNum; pi++) {
					xp = pi << 1;
					yp = xp + 1;
					_x = cpath[xp];
					_y = cpath[yp];

					cpath[xp] = m.a * _x + m.c * _y + m.tx;
					cpath[yp] = m.b * _x + m.d * _y + m.ty;
				}
			} else {
				for (pi = 0; pi < vertNum; pi++) {
					xp = pi << 1;
					yp = xp + 1;
					_x = cpath[xp];
					_y = cpath[yp];
					cpath[xp] = _x + m.tx;
					cpath[yp] = _y + m.ty;
				}
			}

			if (this._pathMesh.vertNum + vertNum > Context._MAXVERTNUM) {
				//;
				//????????????????????????????????????
				this._curSubmit._numEle += curEleNum;
				curEleNum = 0;
				//???????????????mesh????????????submit???
				this._pathMesh = MeshVG.getAMesh(this.isMain);
				this._curSubmit = this.addVGSubmit(this._pathMesh);
			}

			var curvert: number = this._pathMesh.vertNum;
			//?????? ib
			if (p.convex) { //convex???ib????????????
				var faceNum: number = vertNum - 2;
				idx = new Array(faceNum * 3);
				var idxpos: number = 0;
				for (var fi: number = 0; fi < faceNum; fi++) {
					idx[idxpos++] = curvert;
					idx[idxpos++] = fi + 1 + curvert;
					idx[idxpos++] = fi + 2 + curvert;
				}
			}
			else {
				idx = Earcut.earcut(cpath, null, 2);	//????????????
				if (curvert > 0) {
					//??????ib
					for (var ii: number = 0; ii < idx.length; ii++) {
						idx[ii] += curvert;
					}
				}
			}
			//??????mesh
			this._pathMesh.addVertAndIBToMesh(this, cpath, rgba, idx);
			curEleNum += idx.length;
		}
		this._curSubmit._numEle += curEleNum;
	}

	private addVGSubmit(mesh: Mesh2D): Submit {
		//elenum??????0???????????????
		var submit: Submit = Submit.createShape(this, mesh, 0, Value2D.create(ShaderDefines2D.PRIMITIVE, 0));
		//submit._key.clear();
		//submit._key.blendShader = _submitKey.blendShader;	//TODO ???????????????????????????
		submit._key.submitType = SubmitBase.KEY_VG;
		this._submits[this._submits._length++] = submit;
		this._copyClipInfo(submit, this._globalClipMatrix);
		return submit;
	}

	stroke(): void {
		if (this.lineWidth > 0) {
			var rgba: number = this.mixRGBandAlpha(this.strokeStyle._color.numColor);
			var tPath: Path = this._getPath();
			var submit: Submit = this._curSubmit;
			var sameKey: boolean = (submit._key.submitType === SubmitBase.KEY_VG && submit._key.blendShader === this._nBlendType);
			sameKey && (sameKey = sameKey && this.isSameClipInfo(submit));

			if (!sameKey) {
				this._curSubmit = this.addVGSubmit(this._pathMesh);
			}
			var curEleNum: number = 0;
			//???????????????path????????????????????????mesh???????????????????????????alpha
			for (var i: number = 0, sz: number = tPath.paths.length; i < sz; i++) {
				var p: any = tPath.paths[i];
				if (p.path.length <= 0)
					continue;
				var idx: any[] = [];
				var vertex: any[] = [];//x,y
				//p.path.loop;
				//??????vbib
				var maxVertexNum: number = p.path.length * 2;	//?????????????????????????????????????????????????????????
				if (maxVertexNum < 2)
					continue;
				if (this._pathMesh.vertNum + maxVertexNum > Context._MAXVERTNUM) {
					//;
					//????????????????????????????????????
					this._curSubmit._numEle += curEleNum;
					curEleNum = 0;
					//???????????????mesh????????????submit???
					this._pathMesh = MeshVG.getAMesh(this.isMain);
					this.meshlist.push(this._pathMesh);
					this._curSubmit = this.addVGSubmit(this._pathMesh);
				}
				//??????????????????????????????mesh????????????????????????mesh.vertNum,???????????????????????????????????????mesh?????????ib????????????
				BasePoly.createLine2(p.path, idx, this.lineWidth, this._pathMesh.vertNum, vertex, p.loop);	//_pathMesh.vertNum ?????????????????????ib??????
				// ??????????????????
				var ptnum: number = vertex.length / 2;
				var m: Matrix = this._curMat;
				var pi: number = 0;
				var xp: number, yp: number;
				var _x: number, _y: number;
				if (m._bTransform) {
					for (pi = 0; pi < ptnum; pi++) {
						xp = pi << 1;
						yp = xp + 1;
						_x = vertex[xp];
						_y = vertex[yp];

						vertex[xp] = m.a * _x + m.c * _y + m.tx;
						vertex[yp] = m.b * _x + m.d * _y + m.ty;
					}
				} else {
					for (pi = 0; pi < ptnum; pi++) {
						xp = pi << 1;
						yp = xp + 1;
						_x = vertex[xp];
						_y = vertex[yp];
						vertex[xp] = _x + m.tx;
						vertex[yp] = _y + m.ty;
					}
				}

				//this.drawPoly(0, 0, p.path, fillStyle._color.numColor, 0, 0, p.convex);
				//??????mesh
				this._pathMesh.addVertAndIBToMesh(this, vertex, rgba, idx);
				curEleNum += idx.length;
			}
			this._curSubmit._numEle += curEleNum;
		}
	}

	moveTo(x: number, y: number): void {
		var tPath: Path = this._getPath();
		tPath.newPath();
		tPath._lastOriX = x;
		tPath._lastOriY = y;
		tPath.addPoint(x, y);
	}

	/**
	 * 
	 * @param	x
	 * @param	y
	 * @param	b ??????????????????
	 */
	lineTo(x: number, y: number): void {
		var tPath: Path = this._getPath();
		if (Math.abs(x - tPath._lastOriX) < 1e-3 && Math.abs(y - tPath._lastOriY) < 1e-3)//????????????????????????????????????????????????
			return;
		tPath._lastOriX = x;
		tPath._lastOriY = y;
		tPath.addPoint(x, y);
	}
	/*
	public function drawCurves(x:Number, y:Number,points:Array, lineColor:*, lineWidth:Number = 1):void {
		//setPathId(-1);
		beginPath();
		strokeStyle = lineColor;
		this.lineWidth = lineWidth;
		var points:Array = points;
		//movePath(x, y); TODO ??????????????????
		moveTo(points[0], points[1]);
		var i:int = 2, n:int = points.length;
		while (i < n) {
			quadraticCurveTo(points[i++], points[i++], points[i++], points[i++]);
		}
		stroke();
	}
	*/

	arcTo(x1: number, y1: number, x2: number, y2: number, r: number): void {
		/*
		if (mId != -1) {
			if (mHaveKey) {
				return;
			}
		}
		*/
		var i: number = 0;
		var x: number = 0, y: number = 0;
		var dx: number = this._path._lastOriX - x1;
		var dy: number = this._path._lastOriY - y1;
		var len1: number = Math.sqrt(dx * dx + dy * dy);
		if (len1 <= 0.000001) {
			return;
		}
		var ndx: number = dx / len1;
		var ndy: number = dy / len1;
		var dx2: number = x2 - x1;
		var dy2: number = y2 - y1;
		var len22: number = dx2 * dx2 + dy2 * dy2;
		var len2: number = Math.sqrt(len22);
		if (len2 <= 0.000001) {
			return;
		}
		var ndx2: number = dx2 / len2;
		var ndy2: number = dy2 / len2;
		var odx: number = ndx + ndx2;
		var ody: number = ndy + ndy2;
		var olen: number = Math.sqrt(odx * odx + ody * ody);
		if (olen <= 0.000001) {
			return;
		}

		var nOdx: number = odx / olen;
		var nOdy: number = ody / olen;

		var alpha: number = Math.acos(nOdx * ndx + nOdy * ndy);
		var halfAng: number = Math.PI / 2 - alpha;

		len1 = r / Math.tan(halfAng);
		var ptx1: number = len1 * ndx + x1;
		var pty1: number = len1 * ndy + y1;

		var orilen: number = Math.sqrt(len1 * len1 + r * r);
		//??????
		var orix: number = x1 + nOdx * orilen;
		var oriy: number = y1 + nOdy * orilen;

		var ptx2: number = len1 * ndx2 + x1;
		var pty2: number = len1 * ndy2 + y1;

		var dir: number = ndx * ndy2 - ndy * ndx2;

		var fChgAng: number = 0;
		var sinx: number = 0.0;
		var cosx: number = 0.0;
		if (dir >= 0) {
			fChgAng = halfAng * 2;
			var fda: number = fChgAng / Context.SEGNUM;
			sinx = Math.sin(fda);
			cosx = Math.cos(fda);
		}
		else {
			fChgAng = -halfAng * 2;
			fda = fChgAng / Context.SEGNUM;
			sinx = Math.sin(fda);
			cosx = Math.cos(fda);
		}

		//x = _curMat.a * ptx1 + _curMat.c * pty1 /*+ _curMat.tx*/;
		//y = _curMat.b * ptx1 + _curMat.d * pty1 /*+ _curMat.ty*/;
		var lastx: number = this._path._lastOriX, lasty: number = this._path._lastOriY;	//?????????????????????????????????
		var _x1: number = ptx1, _y1: number = pty1;
		if (Math.abs(_x1 - this._path._lastOriX) > 0.1 || Math.abs(_y1 - this._path._lastOriY) > 0.1) {
			x = _x1;// _curMat.a * _x1 + _curMat.c * _y1 + _curMat.tx;
			y = _y1;//_curMat.b * _x1 + _curMat.d * _y1 + _curMat.ty;
			lastx = _x1;
			lasty = _y1;
			this._path._lastOriX = x;
			this._path._lastOriY = y;
			this._path.addPoint(x, y);
		}
		var cvx: number = ptx1 - orix;
		var cvy: number = pty1 - oriy;
		var tx: number = 0.0;
		var ty: number = 0.0;
		for (i = 0; i < Context.SEGNUM; i++) {
			var cx: number = cvx * cosx + cvy * sinx;
			var cy: number = -cvx * sinx + cvy * cosx;
			x = cx + orix;
			y = cy + oriy;

			//x1 = _curMat.a * x + _curMat.c * y /*+ _curMat.tx*/;
			//y1 = _curMat.b * x + _curMat.d * y /*+ _curMat.ty*/;
			//x = x1;
			//y = y1;
			if (Math.abs(lastx - x) > 0.1 || Math.abs(lasty - y) > 0.1) {
				//var _tx1:Number = x, _ty1:Number = y;
				//x = _curMat.a * _tx1 + _curMat.c * _ty1 + _curMat.tx;
				//y = _curMat.b * _tx1 + _curMat.d * _ty1 + _curMat.ty;
				this._path._lastOriX = x;
				this._path._lastOriY = y;
				this._path.addPoint(x, y);
				lastx = x;
				lasty = y;
			}
			cvx = cx;
			cvy = cy;
		}
	}

	arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, counterclockwise: boolean = false, b: boolean = true): void {
		/* TODO ??????????????????
		if (mId != -1) {
			var tShape:IShape = VectorGraphManager.getInstance().shapeDic[this.mId];
			if (tShape) {
				if (mHaveKey && !tShape.needUpdate(_curMat))
					return;
			}
			cx = 0;
			cy = 0;
		}
		*/
		var a: number = 0, da: number = 0, hda: number = 0, kappa: number = 0;
		var dx: number = 0, dy: number = 0, x: number = 0, y: number = 0, tanx: number = 0, tany: number = 0;
		var px: number = 0, py: number = 0, ptanx: number = 0, ptany: number = 0;
		var i: number, ndivs: number, nvals: number;

		// Clamp angles
		da = endAngle - startAngle;
		if (!counterclockwise) {
			if (Math.abs(da) >= Math.PI * 2) {
				da = Math.PI * 2;
			} else {
				while (da < 0.0) {
					da += Math.PI * 2;
				}
			}
		} else {
			if (Math.abs(da) >= Math.PI * 2) {
				da = -Math.PI * 2;
			} else {
				while (da > 0.0) {
					da -= Math.PI * 2;
				}
			}
		}
		var sx: number = this.getMatScaleX();
		var sy: number = this.getMatScaleY();
		var sr: number = r * (sx > sy ? sx : sy);
		var cl: number = 2 * Math.PI * sr;
		ndivs = (Math.max(cl / 10, 10)) | 0;

		hda = (da / ndivs) / 2.0;
		kappa = Math.abs(4 / 3 * (1 - Math.cos(hda)) / Math.sin(hda));
		if (counterclockwise)
			kappa = -kappa;

		nvals = 0;
		var tPath: Path = this._getPath();
		var _x1: number, _y1: number;
		for (i = 0; i <= ndivs; i++) {
			a = startAngle + da * (i / ndivs);
			dx = Math.cos(a);
			dy = Math.sin(a);
			x = cx + dx * r;
			y = cy + dy * r;
			if (x != this._path._lastOriX || y != this._path._lastOriY) {
				//var _tx1:Number = x, _ty1:Number = y;
				//x = _curMat.a * _tx1 + _curMat.c * _ty1 + _curMat.tx;
				//y = _curMat.b * _tx1 + _curMat.d * _ty1 + _curMat.ty;
				tPath.addPoint(x, y);
			}
		}
		dx = Math.cos(endAngle);
		dy = Math.sin(endAngle);
		x = cx + dx * r;
		y = cy + dy * r;
		if (x != this._path._lastOriX || y != this._path._lastOriY) {
			//var _x2:Number = x, _y2:Number = y;
			//x = _curMat.a * _x2 + _curMat.c * _y2 + _curMat.tx;
			//y = _curMat.b * _x2 + _curMat.d * _y2 + _curMat.ty;
			tPath.addPoint(x, y);
		}
	}

	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
		var tBezier: Bezier = Bezier.I;
		var tResultArray: any[] = [];
		//var _x1:Number = x, _y1:Number = y;
		//x = _curMat.a * _x1 + _curMat.c * _y1 ;// + _curMat.tx;
		//y = _curMat.b * _x1 + _curMat.d * _y1;// + _curMat.ty;
		//_x1 = cpx, _y1 = cpy;
		//cpx = _curMat.a * _x1 + _curMat.c * _y1;// + _curMat.tx;
		//cpy = _curMat.b * _x1 + _curMat.d * _y1;// + _curMat.ty;
		var tArray: any[] = tBezier.getBezierPoints([this._path._lastOriX, this._path._lastOriY, cpx, cpy, x, y], 30, 2);
		for (var i: number = 0, n: number = tArray.length / 2; i < n; i++) {
			this.lineTo(tArray[i * 2], tArray[i * 2 + 1]);
		}
		this.lineTo(x, y);
	}


	/**
	 * ???????????????????????????alpha??????
	 * @return
	 */
	mixRGBandAlpha(color: number): number {
		return this._mixRGBandAlpha(color, this._shader2D.ALPHA);
	}
	/**@internal */
	_mixRGBandAlpha(color: number, alpha: number): number {
		if (alpha >= 1) {
			return color;
		}
		var a: number = ((color & 0xff000000) >>> 24);
		//TODO ???????????????????????????????????????alpha???????????????0???????????????????????????0??????????????????????????????alpha?????????????????????alpha????????????????????????
		if (a != 0) {
			a *= alpha;
		} else {
			a = alpha * 255;
		}
		return (color & 0x00ffffff) | (a << 24);
	}

	strokeRect(x: number, y: number, width: number, height: number, parameterLineWidth: number): void {
		var tW: number = parameterLineWidth * 0.5;
		//line(x - tW, y, x + width + tW, y, parameterLineWidth, _curMat);
		//line(x + width, y, x + width, y + height, parameterLineWidth, _curMat);
		//line(x, y, x, y + height, parameterLineWidth, _curMat);
		//line(x - tW, y + height, x + width + tW, y + height, parameterLineWidth, _curMat);
		/**
		 * p1-------------------------------p2
		 * |  x,y                      x+w,y|
		 * |     p4--------------------p3   |
		 * |     |                     |    |
		 * |     p6--------------------p7   |
		 * |  x,y+h                  x+w,y+h|
		 * p5-------------------------------p8
		 * 
		 * ?????????
		 * ???????????????4???fillrect????????????????????????fillrect?????????????????????????????????
		 */
		//TODO ???????????????????????????stroke????????????
		if (this.lineWidth > 0) {
			var rgba: number = this.mixRGBandAlpha(this.strokeStyle._color.numColor);
			var hw: number = this.lineWidth / 2;
			this._fillRect(x - hw, y - hw, width + this.lineWidth, this.lineWidth, rgba);				//???
			this._fillRect(x - hw, y - hw + height, width + this.lineWidth, this.lineWidth, rgba);		//???
			this._fillRect(x - hw, y + hw, this.lineWidth, height - this.lineWidth, rgba);					//???
			this._fillRect(x - hw + width, y + hw, this.lineWidth, height - this.lineWidth, rgba);			//???
		}
	}

	clip(): void {
	}

	/*******************************************end????????????***************************************************/
	//TODO:coverage
	drawParticle(x: number, y: number, pt: any): void {
		pt.x = x;
		pt.y = y;
		this._submits[this._submits._length++] = pt;
	}

	private _getPath(): Path {
		return this._path || (this._path = new Path());
	}

	/**??????canvas*/
	//???????????????????????????
	get canvas(): HTMLCanvas {
		return this._canvas;
	}
	//=============??????==================	
	/* ?????????????????????bug??????canvas?????????save???restore????????????????????????????????????bug????????????????????????
	public function saveTransform(matrix:Matrix):void {
		this._curMat.copyTo(matrix);
	}
	
	public function restoreTransform(matrix:Matrix):void {
		matrix.copyTo(this._curMat);
	}
	
	public function transformByMatrix(matrix:Matrix,tx:Number,ty:Number):void {
		var mat:Matrix = _curMat;
		matrix.setTranslate(tx, ty);
		Matrix.mul(matrix, mat, mat);
		matrix.setTranslate(0, 0);
		mat._bTransform = true;
	}
	*/

	/* ?????????????????????????????????????????????
	public function transformByMatrix(matrix:Matrix, tx:Number, ty:Number):void {
		SaveTransform.save(this);			
		Matrix.mul(matrix, _curMat, _curMat);	
		_curMat.tx += tx;
		_curMat.ty += ty;
		_curMat._checkTransform();
	}
			
	public function transformByMatrixNoSave(matrix:Matrix, tx:Number, ty:Number):void {
		Matrix.mul(matrix, _curMat, _curMat);	
		_curMat.tx += tx;
		_curMat.ty += ty;
		_curMat._checkTransform();
	}
	*/

	private static tmpuv1: any[] = [0, 0, 0, 0, 0, 0, 0, 0];
	/**
	 * ????????????????????????????????????????????????
	 * @param	tex
	 * @param	bmpid
	 * @param	uv		????????????????????????uv
	 * @param	oriw
	 * @param	orih
	 * @param	x
	 * @param	y
	 * @param	w
	 */
	private _fillTexture_h(tex: Texture, imgid: number, uv: ArrayLike<number>, oriw: number, orih: number, x: number, y: number, w: number): void {
		if(oriw<=0) 
			console.error('_fillTexture_h error: oriw must>0');

		var stx: number = x;
		var num: number = Math.floor(w / oriw);
		var left: number = w % oriw;
		for (var i: number = 0; i < num; i++) {
			this._inner_drawTexture(tex, imgid, stx, y, oriw, orih, this._curMat, uv, 1, false);
			stx += oriw;
		}
		// ???????????????
		if (left > 0) {
			var du: number = uv[2] - uv[0];
			var uvr: number = uv[0] + du * (left / oriw);
			var tuv: any[] = Context.tmpuv1;
			tuv[0] = uv[0]; tuv[1] = uv[1]; tuv[2] = uvr; tuv[3] = uv[3];
			tuv[4] = uvr; tuv[5] = uv[5]; tuv[6] = uv[6]; tuv[7] = uv[7];
			this._inner_drawTexture(tex, imgid, stx, y, left, orih, this._curMat, tuv, 1, false);
		}
	}

	/**
	 * ????????????????????????????????????????????????
	 * @param	tex
	 * @param	imgid
	 * @param	uv
	 * @param	oriw
	 * @param	orih
	 * @param	x
	 * @param	y
	 * @param	h
	 */
	private _fillTexture_v(tex: Texture, imgid: number, uv: ArrayLike<number>, oriw: number, orih: number, x: number, y: number, h: number): void {
		if(orih<=0) 
			console.error('_fillTexture_v error: orih must>0');
		var sty: number = y;
		var num: number = Math.floor(h / orih);
		var left: number = h % orih;
		for (var i: number = 0; i < num; i++) {
			this._inner_drawTexture(tex, imgid, x, sty, oriw, orih, this._curMat, uv, 1, false);
			sty += orih;
		}
		// ???????????????
		if (left > 0) {
			var dv: number = uv[7] - uv[1];
			var uvb: number = uv[1] + dv * (left / orih);
			var tuv: any[] = Context.tmpuv1;
			tuv[0] = uv[0]; tuv[1] = uv[1]; tuv[2] = uv[2]; tuv[3] = uv[3];
			tuv[4] = uv[4]; tuv[5] = uvb; tuv[6] = uv[6]; tuv[7] = uvb;
			this._inner_drawTexture(tex, imgid, x, sty, oriw, left, this._curMat, tuv, 1, false);
		}
	}

	private static tmpUV: any[] = [0, 0, 0, 0, 0, 0, 0, 0];
	private static tmpUVRect: any[] = [0, 0, 0, 0];
	drawTextureWithSizeGrid(tex: Texture, tx: number, ty: number, width: number, height: number, sizeGrid: any[], gx: number, gy: number): void {
		if (!tex._getSource())
			return;
		tx += gx;
		ty += gy;

		var uv = tex.uv, w: number = tex.bitmap.width, h: number = tex.bitmap.height;

		var top: number = sizeGrid[0];
		var left: number = sizeGrid[3];
		var right: number = sizeGrid[1];
		var bottom: number = sizeGrid[2];
		var repeat: boolean = sizeGrid[4];
		var needClip: boolean = false;

		if (width == w) {
			left = right = 0;
		}
		if (height == h) {
			top = bottom = 0;
		}

		var d_top: number = top / h;
		var d_left: number = left / w;
		var d_right: number = right / w;
		var d_bottom: number = bottom / h;

		//?????????????????????????????????
		if (left + right > width) {
			var clipWidth: number = width;
			needClip = true;
			width = left + right;
			this.save();
			this.clipRect(0 + tx, 0 + ty, clipWidth, height);
		}

		var imgid: number = (tex.bitmap as Texture2D).id;
		var mat: Matrix = this._curMat;
		var tuv = this._tempUV;
		// ?????????uv
		// ????????????????????????uv????????????????????????
		var uvl: number = uv[0];
		var uvt: number = uv[1];
		var uvr: number = uv[4];
		var uvb: number = uv[5];

		// ?????????uv
		var uvl_: number = uvl;
		var uvt_: number = uvt;
		var uvr_: number = uvr;
		var uvb_: number = uvb;

		//???????????????
		// ??????uv
		if (left && top) {
			uvr_ = uvl + d_left;
			uvb_ = uvt + d_top;
			tuv[0] = uvl, tuv[1] = uvt, tuv[2] = uvr_, tuv[3] = uvt,
				tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl, tuv[7] = uvb_;
			this._inner_drawTexture(tex, imgid, tx, ty, left, top, mat, tuv, 1, false);
		}
		if (right && top) {
			uvl_ = uvr - d_right; uvt_ = uvt;
			uvr_ = uvr; uvb_ = uvt + d_top;
			tuv[0] = uvl_, tuv[1] = uvt_, tuv[2] = uvr_, tuv[3] = uvt_,
				tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl_, tuv[7] = uvb_;
			this._inner_drawTexture(tex, imgid, width - right + tx, 0 + ty, right, top, mat, tuv, 1, false);
		}
		if (left && bottom) {
			uvl_ = uvl; uvt_ = uvb - d_bottom;
			uvr_ = uvl + d_left; uvb_ = uvb;
			tuv[0] = uvl_, tuv[1] = uvt_, tuv[2] = uvr_, tuv[3] = uvt_,
				tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl_, tuv[7] = uvb_;
			this._inner_drawTexture(tex, imgid, 0 + tx, height - bottom + ty, left, bottom, mat, tuv, 1, false);
		}
		if (right && bottom) {
			uvl_ = uvr - d_right; uvt_ = uvb - d_bottom;
			uvr_ = uvr; uvb_ = uvb;
			tuv[0] = uvl_, tuv[1] = uvt_, tuv[2] = uvr_, tuv[3] = uvt_,
				tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl_, tuv[7] = uvb_;
			this._inner_drawTexture(tex, imgid, width - right + tx, height - bottom + ty, right, bottom, mat, tuv, 1, false);
		}
		//?????????????????????
		if (top) {
			uvl_ = uvl + d_left; uvt_ = uvt;
			uvr_ = uvr - d_right; uvb_ = uvt + d_top;
			tuv[0] = uvl_, tuv[1] = uvt_, tuv[2] = uvr_, tuv[3] = uvt_,
				tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl_, tuv[7] = uvb_;
			if (repeat) {
				this._fillTexture_h(tex, imgid, tuv, tex.width - left - right, top, left + tx, ty, width - left - right);
			} else {
				this._inner_drawTexture(tex, imgid, left + tx, ty, width - left - right, top, mat, tuv, 1, false);
			}

		}
		if (bottom) {
			uvl_ = uvl + d_left; uvt_ = uvb - d_bottom;
			uvr_ = uvr - d_right; uvb_ = uvb;
			tuv[0] = uvl_, tuv[1] = uvt_, tuv[2] = uvr_, tuv[3] = uvt_,
				tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl_, tuv[7] = uvb_;
			if (repeat) {
				this._fillTexture_h(tex, imgid, tuv, tex.width - left - right, bottom, left + tx, height - bottom + ty, width - left - right);
			} else {
				this._inner_drawTexture(tex, imgid, left + tx, height - bottom + ty, width - left - right, bottom, mat, tuv, 1, false);
			}
		}
		//??????????????????
		if (left) {
			uvl_ = uvl; uvt_ = uvt + d_top;
			uvr_ = uvl + d_left; uvb_ = uvb - d_bottom;
			tuv[0] = uvl_, tuv[1] = uvt_, tuv[2] = uvr_, tuv[3] = uvt_,
				tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl_, tuv[7] = uvb_;
			if (repeat) {
				this._fillTexture_v(tex, imgid, tuv, left, tex.height - top - bottom, tx, top + ty, height - top - bottom);
			} else {
				this._inner_drawTexture(tex, imgid, tx, top + ty, left, height - top - bottom, mat, tuv, 1, false);
			}
		}
		if (right) {
			uvl_ = uvr - d_right; uvt_ = uvt + d_top;
			uvr_ = uvr; uvb_ = uvb - d_bottom;
			tuv[0] = uvl_, tuv[1] = uvt_, tuv[2] = uvr_, tuv[3] = uvt_,
				tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl_, tuv[7] = uvb_;
			if (repeat) {
				this._fillTexture_v(tex, imgid, tuv, right, tex.height - top - bottom, width - right + tx, top + ty, height - top - bottom);
			} else {
				this._inner_drawTexture(tex, imgid, width - right + tx, top + ty, right, height - top - bottom, mat, tuv, 1, false);
			}
		}
		//????????????
		uvl_ = uvl + d_left; uvt_ = uvt + d_top;
		uvr_ = uvr - d_right; uvb_ = uvb - d_bottom;
		tuv[0] = uvl_, tuv[1] = uvt_, tuv[2] = uvr_, tuv[3] = uvt_,
			tuv[4] = uvr_, tuv[5] = uvb_, tuv[6] = uvl_, tuv[7] = uvb_;
		if (repeat) {
			var tuvr: any[] = Context.tmpUVRect;
			tuvr[0] = uvl_; tuvr[1] = uvt_;
			tuvr[2] = uvr_ - uvl_; tuvr[3] = uvb_ - uvt_;
			// ??????????????????????????????????????????????????????filltexture???????????????????????????????????????
			this._fillTexture(tex, tex.width - left - right, tex.height - top - bottom, tuvr, left + tx, top + ty, width - left - right, height - top - bottom, 'repeat', 0, 0);
		} else {
			this._inner_drawTexture(tex, imgid, left + tx, top + ty, width - left - right, height - top - bottom, mat, tuv, 1, false);
		}

		if (needClip) this.restore();
	}
}


/** @internal */
class ContextParams {
	static DEFAULT: ContextParams;

	lineWidth: number = 1;
	textAlign: string;
	textBaseline: string;

	clear(): void {
		this.lineWidth = 1;
		this.textAlign = this.textBaseline = null;
	}

	make(): ContextParams {
		return this === ContextParams.DEFAULT ? new ContextParams() : this;
	}
}
