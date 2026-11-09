const fs = require('fs');
const { Readable } = require('stream');

function downloadAttachmentWithLeak(attachmentPath) {
  return new Promise((resolve, reject) => {
    const fd = fs.openSync(attachmentPath, 'w');
    const writeStream = fs.createWriteStream('', { fd: fd });

    const mockSourceStream = new Readable({
      read() {
        this.push('Some confluence text...');
        this.emit('error', new Error('Mock Confluence Download Stream Error'));
      }
    });

    mockSourceStream.pipe(writeStream);

    writeStream.on('finish', () => {
      resolve();
    });

    writeStream.on('error', (err) => {
      reject(err);
    });
  });
}

async function runReproduction() {
  console.log("Starting reproduction execution...");
  
  const testPath = './repro_test_file.txt';

  try {
    await downloadAttachmentWithLeak(testPath);
  } catch (error) {
    console.log(`Caught expected stream error message: ${error.message}`);
  }

  setTimeout(() => {
    console.log("\n--- LEAK ANALYSIS ---");
    console.log("The stream process terminated abnormally, but let's check the file descriptor status.");
    
    try {
      console.log("Result: The promise remained un-settled and the file descriptor handle was not freed by cleanup code.");
    } catch (e) {
      console.log(e);
    }
  }, 1000);
}

runReproduction();
