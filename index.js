let path =require('path')
let fs = require('fs')
let vm = require('vm');
function Module(id) {
  this.id=id
  this.exports={}
}
Module._extensions={
  '.js'(module) {
    let content = fs.readFileSync(module.id, 'utf8');
    let moduleWrap = ['(function(exports,module,require,__filename,__dirname){', '})'];
    // 给字符串添加了一个函数
    let script = moduleWrap[0] + content + moduleWrap[1];
    //  exports是module.exports的别名
    vm.runInThisContext(script).call(module.exports, module.exports, module, req); // expors上 就有了js 导出的内容了
  },
  '.json'(module){
    module.exports=JSON.parse(fs.readFileSync(module.id,'utf8'))
  }
}
Module._resolveFilename=function(filename){
  let r=path.resolve(__dirname,filename)
  if(!path.extname(r)){
    let extnames=Object.keys(Module._extensions);
    for(let i=0;i<extnames.length;i++){
      let p=r+extnames[i];
      try{
        fs.accessSync(p);
        return p
      }catch(e){

      }
    }
  }
}
Module._load=function (filename) {
  let asbPath =Module._resolveFilename(filename)
  let module =new Module(asbPath)
  let ext=path.extname(module.id)
  Module._extensions[ext](module);
  return module.exports

}
function myRequire(id) {
  return Module._load(id)
}
