const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  login: (credentials) => ipcRenderer.invoke("login", credentials),

  // saveEditorContent: (content) =>
  //   ipcRenderer.invoke("save-editor-content", content),

  // Updated fetchNews
  fetchNews: (
    query,
    categoryName // Accept both query and categoryName
  ) => ipcRenderer.invoke("fetch-news", { query, categoryName }), // Pass as an object

  getImageBase64: (url) => ipcRenderer.invoke("get-image-base64", url),

  saveEditorContent: (
    noteDataObject // Expects an object now
  ) => ipcRenderer.invoke("save-editor-content", noteDataObject),
});
