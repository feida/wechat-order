/**
 * 全局的配置环境
 */

let serverRoot= null;//配置IP 陈泽
let root= null;

if (process.env.NODE_ENV === 'development') {
  console.log("-----开发模式");
  serverRoot="http://dianji.tt.com:8081";
  root="http://139.196.106.198:8082";
} else if (process.env.NODE_ENV === 'production') {
  console.log("-----生产模式");
  // serverRoot="dianji.restoplus.cn";
  serverRoot = '';
}

export {
  serverRoot,
  root
};
