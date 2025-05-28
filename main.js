try {
  require("electron-reloader")(module);
} catch (_) {}

const fs = require('fs').promises; // For saving files
const path = require('path');
const { app, dialog, BrowserWindow, ipcMain } = require("electron");
const { saveContent } = require('./electron/db');
const { default: axios } = require("axios");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.setMenuBarVisibility(false);
  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// const isDev = !app.isPackaged

// win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
//   callback({
//     responseHeaders: {
//       ...details.responseHeaders,
//       'Content-Security-Policy': isDev
//         ? ["default-src 'self' 'unsafe-eval' 'unsafe-inline' data: blob:;"]
//         : ["default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"],
//     },
//   })
// })

/********* ======================================================= */

ipcMain.handle("login", async (event, { username, password }) => {
  console.log("Received login:", username, password);

  if (username === "admin" && password === "admin") {
    return { success: true, token: "fake-token" };
  } else {
    return { success: false, error: "Invalid credentials" };
  }
});

const NEWS_API_KEY = "-----------------";

ipcMain.handle('fetch-news', async (event, payload) => {
  // payload will be { query, categoryName } from the preload script
  const { query, categoryName } = payload; // Destructure the query and categoryName

  if (!NEWS_API_KEY) {
    console.error('News API Key is not configured in .env file.');
    return {
      status: 'error',
      message: 'News service configuration error on server.',
    };
  }

  try {
    console.log(`Fetching news for query: "${query}", category hint: "${categoryName}"`);
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: query, // Use the query from the payload
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 15 // Fetch a bit more to allow for filtering/deduplication on client
      }
    });

    // NewsAPI on success returns data with a 'status: "ok"' and 'articles' array
    if (response.data && response.data.status === 'ok') {
      return {
        status: 'ok',
        articles: response.data.articles,
      };
    } else {
      // If NewsAPI returns a non-"ok" status in its data payload
      return {
        status: 'error',
        message: response.data.message || 'Received non-OK status from News API.',
      };
    }

  } catch (error) {
    console.error('Error fetching news from API:', error.message);
    let errorMessage = 'Failed to fetch news due to a network or API issue.';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Data:', error.response.data);
      console.error('API Error Status:', error.response.status);
      errorMessage = `API Error (${error.response.status}): ${error.response.data.message || error.message}`;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      errorMessage = 'No response from the news server. Check internet connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
    }
    return {
      status: 'error',
      message: errorMessage,
    };
  }
});


ipcMain.handle('get-image-base64', async (event, imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const mimeType = response.headers['content-type'];
    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    return null;
  }
});






ipcMain.handle('save-editor-content', async (event, noteData) => {
  // noteData = { title, type, content }
  const { title, type, content } = noteData;

  if (!title || typeof content !== 'string') {
    return { status: 'error', message: 'Invalid note data received.' };
  }

  // Determine file extension
  let extension = '.txt';
  switch (type) {
    case 'javascript': extension = '.js'; break;
    case 'python': extension = '.py'; break;
    case 'php': extension = '.php'; break;
    case 'html': extension = '.html'; break;
    case 'css': extension = '.css'; break;
    case 'markdown': extension = '.md'; break;
  }

  // Sanitize title for filename (basic example)
  const safeFileName = title.replace(/[^a-z0-9_\-\s]/gi, '_').replace(/\s+/g, '_');
  const fileName = `${safeFileName}${extension}`;

  try {
    // Suggest a save location (e.g., Documents/YourAppName/Notes)
    const defaultNotesPath = path.join(app.getPath('documents'), 'YourAppName', 'Notes');
    await fs.mkdir(defaultNotesPath, { recursive: true }); // Ensure directory exists

    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'Save Note',
      defaultPath: path.join(defaultNotesPath, fileName),
      filters: [
        { name: type.charAt(0).toUpperCase() + type.slice(1) + ' Files', extensions: [extension.substring(1)] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (canceled || !filePath) {
      return { status: 'canceled', message: 'Save operation canceled.' };
    }

    await fs.writeFile(filePath, content, 'utf8');
    console.log('Note saved to:', filePath);
    return { status: 'ok', message: 'Note saved successfully.', filePath };

  } catch (error) {
    console.error('Error saving note:', error);
    return { status: 'error', message: `Failed to save note: ${error.message}` };
  }
});