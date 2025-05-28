// src/components/DashboardHeader.vue
<template>
  <header class="page-header">
    <div class="app-branding">
      <!-- You can add an App Logo or Title here -->
      <!-- <img src="/path/to/logo.svg" alt="App Logo" class="app-logo"/> -->
      <h1 class="app-title">My Dashboard</h1>
    </div>
    <div class="btn-group main-actions">
      <button @click="openNewNoteModal" class="btn btn-primary btn-sm app-btn">
        <!-- SVG icon for New Note -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6Zm-1 9h-2v2H9v-2H7v-2h2V9h2v2h2v2Zm2-7V4l4 4h-4Z"></path></svg>
        New Note
      </button>
      <button @click="logoutUser" class="btn btn-danger btn-sm app-btn">
        <!-- SVG icon for Logout -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path></svg>
        Logout
      </button>
    </div>
    <NewNoteModal 
      :is-visible="isModalVisible" 
      @close="closeNewNoteModal" 
      @create-note="handleCreateNote" 
    />
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NewNoteModal from './NewNoteModal.vue'; // Import the modal

const router = useRouter();
const isModalVisible = ref(false);

const openNewNoteModal = () => {
  isModalVisible.value = true;
};

const closeNewNoteModal = () => {
  isModalVisible.value = false;
};

const handleCreateNote = (noteData) => {
  // noteData will be { title: '...', type: '...' }
  console.log('Creating note:', noteData);
  router.push({ 
    path: '/editor', 
    query: { title: noteData.title, type: noteData.type } 
  });
  // Modal is closed by itself after emitting 'create-note'
};

const logoutUser = () => {
  console.log("Logout button clicked");
  alert("Logout functionality to be implemented (potentially via IPC)!");
  router.push('/');
};
</script>

<style scoped> /* Changed from global to scoped */
/* Assuming global CSS variables are available */
.page-header {
  display: flex;
  justify-content: space-between; /* Changed from flex-end */
  align-items: center;
  padding: 15px 0; /* Adjusted padding */
  /* border-bottom: 1px solid var(--border-color); /* Optional: add a bottom border */
  /* margin-bottom: 20px; /* Optional: space below header */
}

.app-branding {
  display: flex;
  align-items: center;
  gap: 10px;
}
.app-logo {
  height: 32px; /* Adjust as needed */
}
.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color-headings);
  margin: 0;
}


.main-actions { /* This class was in your previous example, ensure it's defined or remove if not used */
  display: flex;
  gap: 12px;
}

.app-btn {
  background: var(--bg-color-lightened);
  border: 1px solid var(--border-color);
  color: var(--text-color-muted);
  padding: 10px 18px; /* Slightly larger */
  border-radius: 8px; /* More rounded */
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-sm); /* Assuming --shadow-sm is defined globally */
}

.app-btn svg {
  transition: color 0.2s ease-in-out; /* SVG color already transitions */
}

.app-btn:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md), 0 0 15px rgba(88, 166, 255, 0.2); /* Assuming --shadow-md is defined */
}
.app-btn:hover svg {
  color: var(--accent-primary);
}

.app-btn.btn-danger:hover { /* Target specific class for danger button */
  border-color: var(--accent-secondary);
  color: var(--accent-secondary);
  box-shadow: var(--shadow-md), 0 0 15px rgba(247, 120, 186, 0.2);
}
.app-btn.btn-danger:hover svg {
  color: var(--accent-secondary);
}
</style>