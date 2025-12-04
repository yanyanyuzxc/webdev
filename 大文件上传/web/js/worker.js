importScripts("./createChunk.js");
onmessage = async (e) => {
  let result = [];
  const { file, start, end, CHUNKSIZE, uploadedChunk } = e.data;
  for (let i = start; i < end; i++) {
    // 如果该分片已经上传过，则跳过
    if (uploadedChunk.includes(i)) {
      result.push({
        chunkIndex: i,
        isuploaded: true,
      });
      continue;
    }
    const chunk = createChunk(file, i, CHUNKSIZE);
    result.push(chunk);
  }
  // 等待所有分片创建完成（并行处理，效率更高）
  const chunks = await Promise.all(result);

  // 向主线程发送结果
  postMessage(chunks);
};
