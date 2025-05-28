// src/views/Editor.vue (or wherever it's located)
<template>
  <div class="editor-view">
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <button @click="gotoDashboard" class="toolbar-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5Z"></path></svg>
          Dashboard
        </button>
        <span v-if="noteTitle" class="note-title-display">{{ noteTitle }}</span>
      </div>
      <div class="toolbar-right">
        <span class="language-display" v-if="currentLanguageLabel">{{ currentLanguageLabel }}</span>
        <button @click="saveTheContent" class="toolbar-btn save-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17 3H5C3.89 3 3 3.9 3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4Zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3Zm3-10H5V5h10v4Z"></path></svg>
          Save
        </button>
      </div>
    </div>
    <div class="editor-wrapper">
      <MonacoEditor 
        theme="vs-dark" 
        :language="monacoLanguage" 
        v-model:value="content" 
        :options="monacoOptions"
        @editorDidMount="handleEditorMount"
      />
    </div>
  </div>
</template>

<script setup>
import MonacoEditor from 'monaco-editor-vue3';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const noteTitle = ref('');
const noteType = ref('plaintext'); // Default if not provided
const content = ref(''); // Default content

const monacoLanguage = computed(() => {
  // Map friendly names to Monaco language identifiers
  switch (noteType.value) {
    case 'javascript': return 'javascript';
    case 'python': return 'python';
    case 'php': return 'php';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'markdown': return 'markdown';
    case 'plaintext':
    default: return 'plaintext';
  }
});

const currentLanguageLabel = computed(() => {
  switch(noteType.value) {
    case 'javascript': return 'JavaScript';
    case 'python': return 'Python';
    case 'php': return 'PHP';
    case 'html': return 'HTML';
    case 'css': return 'CSS';
    case 'markdown': return 'Markdown';
    case 'plaintext': return 'Text';
    default: return noteType.value;
  }
});

const monacoOptions = ref({
  automaticLayout: true,
  fontSize: 14,
  minimap: { enabled: true },
  wordWrap: 'on',
  scrollBeyondLastLine: false,
  glyphMargin: true,
  // Add more options as needed
});

const editorInstance = ref(null);
const handleEditorMount = (editor) => {
  editorInstance.value = editor;
  // You can now access the editor instance if needed, e.g., editor.focus()
  console.log('Monaco Editor Mounted');
};


onMounted(() => {
  noteTitle.value = route.query.title || 'Untitled Note';
  noteType.value = route.query.type || 'plaintext';

  // You might want to load existing content here if this note was saved before
  // For a new note, content can remain empty or have a template
  if (noteType.value === 'markdown') {
    content.value = `# ${noteTitle.value}\n\nStart writing your markdown here...`;
  } else if (noteType.value === 'javascript') {
    content.value = `// ${noteTitle.value}\n\nconsole.log('Hello, JavaScript!');`;
  } else {
    content.value = ``; // Default empty content
  }

});

const gotoDashboard = () => {
  router.push('/dashboard');
};

const saveTheContent = async () => {
  if (window.electron && typeof window.electron.saveEditorContent === 'function') {
    try {
      const response = await window.electron.saveEditorContent({
        title: noteTitle.value,
        type: noteType.value,
        content: content.value,
        // You might want to add an ID if it's an existing note being updated
      });
      console.log('Save response:', response);
      if (response && response.status === 'ok') {
        alert('Note saved successfully!'); // Replace with a proper notification
      } else {
        alert(`Error saving note: ${response.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Error calling saveEditorContent:", err);
      alert(`Failed to save note: ${err.message}`);
    }
  } else {
    console.warn('window.electron.saveEditorContent is not available.');
    alert('Save functionality is not available in this environment.');
  }
};
</script>

<style scoped>
/* Assuming global CSS variables are available */
.editor-view {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Full viewport height */
  overflow: hidden; /* Prevent scrollbars on the view itself */
  background-color: var(--bg-color); /* Match your app's theme */
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background-color: var(--bg-color-lightened); /* Darker than editor, or same as card-bg */
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color-muted);
  flex-shrink: 0; /* Prevent toolbar from shrinking */
  height: 50px; /* Fixed height */
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toolbar-btn {
  background: transparent;
  border: 1px solid transparent; /* Keep space, but transparent */
  color: var(--text-color-muted);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}
.toolbar-btn:hover {
  background-color: rgba(255,255,255,0.05);
  color: var(--text-color);
  border-color: var(--border-color);
}
.toolbar-btn.save-btn {
  color: var(--accent-tertiary); /* Using a green accent for save */
}
.toolbar-btn.save-btn:hover {
  background-color: rgba(63, 185, 80, 0.1); /* Green accent color */
  color: var(--accent-tertiary);
  border-color: var(--accent-tertiary);
}

.note-title-display {
  font-weight: 500;
  color: var(--text-color-headings);
  font-size: 1rem;
  max-width: 300px; /* Prevent very long titles from breaking layout */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.language-display {
  font-size: 0.85rem;
  padding: 4px 8px;
  background-color: rgba(255,255,255,0.05);
  border-radius: 4px;
  color: var(--text-color-muted);
}

.editor-wrapper {
  flex-grow: 1; /* Monaco editor takes remaining space */
  overflow: hidden; /* Important for Monaco not to create its own scrollbars outside its container */
  height: calc(100vh - 50px); /* Full height minus toolbar height */
}
/* MonacoEditor itself is a component, its internal styling is handled by its theme (vs-dark) */
</style>