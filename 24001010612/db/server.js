/*
  作者：葛佳磊
  建立时间：2026-11-12 13:46
  使用模型：DeepSeek-V4.1-Flash
  功能名称及简介：db 数据服务器 —— 读取同目录下的 db.json，在 3004 端口提供 poems 数据接口，
  并允许跨域访问，供「上图下文」页面通过 fetch 获取图片、标题与正文
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3004;                               // 服务端口号
const DB_FILE = path.join(__dirname, 'db.json'); // 数据文件路径（与本文件同级）

/* 作者：葛佳磊 | 建立时间：2026-11-12 13:46 | 使用模型：DeepSeek-V4.1-Flash
   功能：gjl_sendJson —— 统一输出 JSON 响应，并附带跨域头，避免浏览器 CORS 拦截 */
function gjl_sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

/* 作者：葛佳磊 | 建立时间：2026-11-12 13:46 | 使用模型：DeepSeek-V4.1-Flash
   功能：gjl_readDb —— 读取 db.json 并解析为对象，读取或解析失败时把错误交给回调 */
function gjl_readDb(callback) {
  fs.readFile(DB_FILE, 'utf8', function (err, text) {
    if (err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(text));
    } catch (parseErr) {
      callback(parseErr);
    }
  });
}

const server = http.createServer(function (req, res) {
  // 跨域预检请求直接放行
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const requestUrl = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));

  // 接口一：/api/poems —— 只返回 poems 数组，供页面渲染使用
  if (requestUrl.pathname === '/api/poems') {
    gjl_readDb(function (err, data) {
      if (err) {
        gjl_sendJson(res, 500, { message: '读取 db.json 失败：' + err.message });
        return;
      }
      gjl_sendJson(res, 200, data.poems || []);
    });
    return;
  }

  // 接口二：/db.json 或 / —— 返回完整原始数据，方便在浏览器里直接查看
  if (requestUrl.pathname === '/db.json' || requestUrl.pathname === '/') {
    gjl_readDb(function (err, data) {
      if (err) {
        gjl_sendJson(res, 500, { message: '读取 db.json 失败：' + err.message });
        return;
      }
      gjl_sendJson(res, 200, data);
    });
    return;
  }

  gjl_sendJson(res, 404, { message: '接口不存在，可用接口：/api/poems 、/db.json' });
});

server.listen(PORT, function () {
  console.log('数据服务器已启动：http://localhost:' + PORT);
  console.log('  · poems 数据：http://localhost:' + PORT + '/api/poems');
  console.log('  · 原始数据：  http://localhost:' + PORT + '/db.json');
});
