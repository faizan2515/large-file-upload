function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const chunkSize = 5 * 1024 * 1024; // 5MB (adjust based on your requirements)
  const totalChunks = Math.ceil(file.size / chunkSize);
  const chunkProgress = 100 / totalChunks;
  let chunkNumber = 0;
  let start = 0;
  let end = 0;

  const uploadNextChunk = async () => {
    if (end <= file.size) {
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("chunkNumber", chunkNumber);
      formData.append("totalChunks", totalChunks);
      formData.append("originalname", file.name);

      fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log({ data });
          const temp = `Chunk ${
            chunkNumber + 1
          }/${totalChunks} uploaded successfully`;
          updateProgressBar(temp, Number((chunkNumber + 1) * chunkProgress));
          console.log(temp);
          chunkNumber++;
          start = end;
          end = start + chunkSize;
          uploadNextChunk();
        })
        .catch((error) => {
          console.error("Error uploading chunk:", error);
        });
    }
  };
  uploadNextChunk();
}

function updateProgressBar(status, progress) {
  const progressBar = document.getElementById("progressBar");
  const statusEl = document.getElementById("status");
  progressBar.style.width = progress + "%";
  progressBar.innerText = `${progress.toFixed(2)}%`;
  statusEl.innerText = status;
}
