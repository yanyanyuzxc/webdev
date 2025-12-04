// createChunk.js（传统脚本，不支持 export，供 Worker 内部调用）
importScripts("./spark-md5.js"); // 导入 SparkMD5

// 定义函数（不导出，在当前脚本上下文可用）
function createChunk(file, index, chunkSize) {
  return new Promise((resolve, reject) => {
    const start = index * chunkSize;
    // 关键：限制 end 不超过文件大小，避免越界
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end); // 切割分片

    const reader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer(); // 初始化 ArrayBuffer 哈希器

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result; // 正确获取 ArrayBuffer
        spark.append(arrayBuffer); // 累加二进制数据
        resolve({
          chunkStart: start,
          chunkEnd: end,
          chunkBlob: arrayBuffer, // 分片二进制数据
          chunkHash: spark.end(), // 分片单独的哈希（按需保留）
          chunkIndex: index,
          chunkSize: end - start, // 实际分片大小（最后一片可能小于 chunkSize）
          isuploaded: false, // 标记分片未上传
        });
      } catch (err) {
        reject(new Error(`分片 ${index} 处理失败：${err.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error(`分片 ${index} 读取失败`));
    };

    // 正确方法：读取为 ArrayBuffer
    reader.readAsArrayBuffer(chunk);
  });
}
