
const typescript = require('rollup-plugin-typescript2');
const glsl = require('rollup-plugin-glsl');
// const forcebinding = require('rollup-plugin-force-binding');
const rollup = require("rollup");
const path = require("path");
const matched = require('matched');
const fs = require("fs");

var curPackFiles = null;  //当前包的所有的文件
var mentry = 'multientry:entry-point.ts';
function myMultiInput() {
    var include = [];
    var exclude = [
        "cubismrenderer_webgl.ts",
        "cubismusermodel.ts"
    ];
    function configure(config) {
        if (typeof config === 'string') {
            include = [config];
        } else if (Array.isArray(config)) {
            include = config;
        } else {
            include = config.include || [];
            exclude = config.exclude || [];

            if (config.exports === false) {
                exporter = function exporter(p) {
                    if (p.substr(p.length - 3) == '.ts') {
                        p = p.substr(0, p.length - 3);
                    }
                    return `import ${JSON.stringify(p)};`;
                };
            }
        }
    }

    var exporter = function exporter(p) {
        if (exclude.length) {
            for (let i = 0; i < exclude.length; i++) {
                let e = exclude[i];
                if (p.indexOf(e) != -1) {
                    return "";
                }
            }
        }
        if (p.substr(p.length - 3) == '.ts') {
            p = p.substr(0, p.length - 3);
        }
        return `export * from ${JSON.stringify(p)};`;
    };

    return (
        {
            options(options) {
                console.log('===', options.input)
                configure(options.input);
                options.input = mentry;
            },

            resolveId(id, importer) {//entry是个特殊字符串，rollup并不识别，所以假装这里解析一下
                if (id === mentry) {
                    return mentry;
                }
                if (mentry == importer)
                    return;
                var importfile = path.join(path.dirname(importer), id);
                var ext = path.extname(importfile);
                if (ext != '.ts' && ext != '.glsl' && ext != '.vs' && ext != '.ps' && ext != '.fs') {
                    importfile += '.ts';
                }
                //console.log('import ', importfile);
                if (curPackFiles.indexOf(importfile) < 0) {
                    //其他包里的文件
                    // console.log('other pack:',id,'importer=', importer);
                    return 'Laya';
                }
            },
            load(id) {
                if (id === mentry) {
                    if (!include.length) {
                        return Promise.resolve('');
                    }

                    var patterns = include.concat(exclude.map(function (pattern) {
                        return '!' + pattern;
                    }));
                    return matched.promise(patterns, { realpath: true }).then(function (paths) {
                        curPackFiles = paths;   // 记录一下所有的文件
                        paths.sort();
                        let result = paths.map(exporter).join('\n');
                        // fs.writeFileSync("test.js",result,"utf8") //测试入口
                        return result;
                    });
                } else {
                    //console.log('load ',id);
                }
            }
        }
    )
}

async function compile() {
    const subTask = await rollup.rollup({
        input: [
            "../src/adapter/**/*.*",
            "../src/framework/**/*.*"
        ],
        output: {
            extend: true,
            globals: { 'Laya': 'Laya' }
        },
        external: ['Laya'],
        // shimMissingExports
        plugins: [
            myMultiInput(),
            typescript({
                // include:/.*(.ts|.d.ts|.tsx)$/,
                tsconfig: "../src/tsconfig.json",
                check: false,
                tsconfigOverride: { compilerOptions: { removeComments: true } }
            }),
            glsl({
                include: /.*(.glsl|.vs|.fs)$/,
                sourceMap: false,
                compress: false
            }),
        ]
        // ,
        // onwarn:(warn)=>{
        //     debugger
        // }
    });

    let out ="../dist/live2d_adapter.js";
    await subTask.write({
        file: out,
        format: 'iife',
        name: 'Laya',
        interop:"esModule",
        sourcemap: false,
        extend: true,
        globals: { 'Laya': 'Laya' },
        intro:"var Live2DCubismFramework = window.Live2DCubismFramework = {};\nexports.Live2DCubismFramework = Live2DCubismFramework;"//可以修改，目前会往window上挂Live2DCubismFramework对象
    });
    let srcContents = fs.readFileSync(out,"utf-8");
    let destContents = srcContents.replace(/var Laya /, "window.Laya");
    destContents = destContents.replace(/\(this.Laya = this.Laya \|\| {}, Laya\)\);/, "(window.Laya = window.Laya || {}, Laya));");
    destContents = destContents.replace(/Live2DCubismFramework\$([A-Z]|[a-z]|[0-9])/g,"Live2DCubismFramework");
    destContents = destContents.replace(/var Live2DCubismFramework\;/g,"");
    fs.writeFileSync(out,destContents,"utf8");
}

compile();