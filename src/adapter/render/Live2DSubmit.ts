import { Live2DModel } from "../model/Live2DModel";
import { Live2DTime } from "../core/Live2DTime";
import { ISubmit } from "laya/webgl/submit/ISubmit";
import { Laya } from "Laya";
import { Pool } from "laya/utils/Pool";
import { WebGLContext } from "laya/webgl/WebGLContext";

export class Live2DSubmit implements ISubmit{
    static TYPE_LIVE2D:number = 11000;
    private _model:Live2DModel;
    _key:any = {};
    private saveParameter:any;
    private static _gl:WebGLRenderingContext;
    private static isMark:boolean = true;
    private static _curAB:WebGLBuffer;
    private static _curEAB:WebGLBuffer;
    public static __init__(gl:WebGLRenderingContext){
        Live2DSubmit._gl =gl;
        var _originBindBuffer = gl.bindBuffer;
        function bindBuffer (target: GLenum, buffer: WebGLBuffer | null):void{
            if(Live2DSubmit.isMark){
                if(target == Live2DSubmit._gl.ARRAY_BUFFER){
                    Live2DSubmit._curAB = buffer;
                }else if(target == Live2DSubmit._gl.ELEMENT_ARRAY_BUFFER){
                    Live2DSubmit._curEAB = buffer;
                }
            }
            _originBindBuffer.call(Live2DSubmit._gl,target,buffer);
        }
        gl.bindBuffer = bindBuffer;
    }
    constructor(){
    }
    public init(model){
        this._model = model;
        this.saveParameter = {};
        this.saveParameter.vertexs = [];
    }
    renderSubmit():number{
        Live2DTime.updateTime();
        Live2DSubmit.isMark = false;
        this.start()
        this._model.update(Live2DTime.getDeltaTime());
        this.end();
        Live2DSubmit.isMark = true;
        return 1;
    }

    getRenderType(): number{
        return Live2DSubmit.TYPE_LIVE2D;
    }

    releaseRender(): void{
        this._model = null;
        this.saveParameter = null;
        Pool.recover("Live2DSubmit_Pool",this);
    }
    /**
     * 保存会被修改的状态
     */
    start():void{
        let gl:WebGLRenderingContext = (WebGLContext as any).mainContext
        // debugger
        this.saveParameter.BLEND = gl.getParameter(gl.BLEND);
        this.saveParameter.CULL_FACE = gl.getParameter(gl.CULL_FACE);
        this.saveParameter.SCISSOR_TEST = gl.getParameter(gl.SCISSOR_TEST);
        this.saveParameter.STENCIL_TEST = gl.getParameter(gl.STENCIL_TEST);
        this.saveParameter.DEPTH_TEST = gl.getParameter(gl.DEPTH_TEST);
        //记录bindtexture
        this.saveParameter.bindTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
        //记录bindprogram
        this.saveParameter.program = gl.getParameter(gl.CURRENT_PROGRAM);

        this.saveParameter.frontFace = gl.getParameter(gl.FRONT_FACE);
        //记录bindbuffer
        this.saveParameter.ARRAY_BUFFER_BINDING = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
        this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
        //记录混合方式
        this.saveParameter.BLEND_DST_ALPHA = gl.getParameter(gl.BLEND_DST_ALPHA);
        this.saveParameter.BLEND_DST_RGB = gl.getParameter(gl.BLEND_DST_RGB);
        this.saveParameter.BLEND_SRC_ALPHA = gl.getParameter(gl.BLEND_SRC_ALPHA);
        this.saveParameter.BLEND_SRC_RGB = gl.getParameter(gl.BLEND_SRC_RGB);
        //记录bindframebuffer
        this.saveParameter.FRAMEBUFFER_BINDING = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        //记录vertexAttribPointer

        let enable:GLboolean,data:any;
        let vertexs = this.saveParameter.vertexs
        vertexs.length = 0;
        let max = gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
        for (let index = 0; index < max; index++) {
            enable = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_ENABLED);
            if(enable){
                data = vertexs[index] = {};
                data.index = index;
                data.buffer = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
                data.size = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_SIZE);
                data.type = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_TYPE);
                data.normalized = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_NORMALIZED);
                data.stride = gl.getVertexAttrib(index,gl.VERTEX_ATTRIB_ARRAY_STRIDE);
                data.offset = gl.getVertexAttribOffset(index,gl.VERTEX_ATTRIB_ARRAY_POINTER);
            }else
            {
                // console.log(`${index},is disable`);
                break;
            }
        }
    }
    /**
     * 还原状态
     */
    end():void{
        let _webglContext:any = WebGLContext;
        let gl:WebGLRenderingContext = _webglContext.mainContext
        if(this.saveParameter.BLEND){
            gl.enable(gl.BLEND);
        }else
            gl.disable(gl.BLEND);

        if(this.saveParameter.CULL_FACE){
            gl.enable(gl.CULL_FACE);
        }else
            gl.disable(gl.CULL_FACE);

        if(this.saveParameter.SCISSOR_TEST){
            gl.enable(gl.SCISSOR_TEST);
        }

        if(this.saveParameter.STENCIL_TEST)
        {
            gl.enable(gl.STENCIL_TEST);
        }

        if(this.saveParameter.DEPTH_TEST){
            gl.enable(gl.DEPTH_TEST);
        }
        
        if(this.saveParameter.bindTexture){
            gl.bindTexture(gl.TEXTURE_2D,this.saveParameter.bindTexture);
        }else{
            gl.bindTexture(gl.TEXTURE_2D, _webglContext._activeTextures[_webglContext._activedTextureID - gl.TEXTURE0])
        }
        
        gl.blendFuncSeparate(this.saveParameter.BLEND_SRC_RGB,this.saveParameter.BLEND_DST_RGB,this.saveParameter.BLEND_SRC_ALPHA,this.saveParameter.BLEND_DST_ALPHA);
        gl.frontFace(this.saveParameter.frontFace);

        // if(this.saveParameter.program){
        //     gl.useProgram(this.saveParameter.program);
        // }else{
            gl.useProgram(_webglContext._useProgram);
        // }

        if(this.saveParameter.ARRAY_BUFFER_BINDING){
            gl.bindBuffer(gl.ARRAY_BUFFER,this.saveParameter.ARRAY_BUFFER_BINDING);
        }else{
            gl.bindBuffer(gl.ARRAY_BUFFER,Live2DSubmit._curAB);
        }
        
        let vertexs = this.saveParameter.vertexs;
        for (let index = 0; index < vertexs.length; index++) {
            const element = vertexs[index];
            // gl.bindBuffer(gl.ARRAY_BUFFER,element.buffer);
            if(element.buffer == this.saveParameter.ARRAY_BUFFER_BINDING||!this.saveParameter.ARRAY_BUFFER_BINDING){
                gl.enableVertexAttribArray(element.index);
                gl.vertexAttribPointer(element.index,element.size,element.type,element.normalized,element.stride,element.offset);
            }
        }
        
        if(this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING){
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.saveParameter.ELEMENT_ARRAY_BUFFER_BINDING);
        }else{
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,Live2DSubmit._curEAB);
        }
    }

    static create(model:Live2DModel):Live2DSubmit{
        let o:Live2DSubmit = Pool.getItemByClass("Live2DSubmit_Pool",Live2DSubmit);
        o.init(model);
        return o;
    }
}