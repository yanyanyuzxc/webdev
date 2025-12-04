const CHUNKSIZE = 1024 * 100; // 1MB
const THEAD_COUNT = navigator.hardwareConcurrency || 4; // 4线程

export const cutFile = (file, uploadedChunk) => {
  return new Promise((resolve, reject) => {
    let result = [];
    let doneThreads = 0;
    const chunkCount = Math.ceil(file.size / CHUNKSIZE);
    const theadChunkCount = Math.ceil(chunkCount / THEAD_COUNT);
    for (let i = 0; i < THEAD_COUNT; i++) {
      let start = i * theadChunkCount;
      let worker = new Worker("./../../js/worker.js");

      let end = (i + 1) * theadChunkCount;
      if (end > chunkCount) {
        end = chunkCount;
      }

      worker.onerror = (e) => {
        reject(e);
      };
      worker.postMessage({
        file,
        start,
        end,
        CHUNKSIZE,
        uploadedChunk,
      });
      // 启动worker
      worker.onmessage = (e) => {
        e.data.forEach((item) => {
          result[item.chunkIndex] = item;
        });
        doneThreads++;
        worker.terminate();
        if (doneThreads === THEAD_COUNT) {
          resolve(result);
        }
      };
    }
  });
};
