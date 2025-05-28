// src/components/NewNoteModal.vue
<template>
    <transition class="modal--fade" name="modal-fade">
        <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Create New Note</h3>
                    <button @click="closeModal" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="handleCreateNote">
                        <div class="form-group">
                            <label for="noteTitle">Title</label>
                            <input type="text" id="noteTitle" v-model.trim="title" placeholder="Enter note title..."
                                required />
                        </div>
                        <div class="form-group">
                            <label for="noteType">Type</label>
                            <div class="select-wrapper">
                                <select id="noteType" v-model="selectedType">
                                    <option value="plaintext">Text</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="php">PHP</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
                                    <option value="markdown">Markdown</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                            <button type="submit" class="btn btn-primary">Create Note</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    isVisible: Boolean,
});

const emit = defineEmits(['close', 'create-note']);

const title = ref('');
const selectedType = ref('plaintext'); // Default type

watch(() => props.isVisible, (newValue) => {
    if (newValue) {
        // Reset form when modal becomes visible
        title.value = '';
        selectedType.value = 'plaintext';
    }
});

const closeModal = () => {
    emit('close');
};

const handleCreateNote = () => {
    if (title.value) {
        emit('create-note', { title: title.value, type: selectedType.value });
        closeModal(); // Close modal after emitting
    }
};
</script>

<style scoped>
/* Assuming global CSS variables like --bg-color, --accent-primary, etc. are defined */
/* If not, replace with your actual values */
.modal--fade {
    --bg-color: #0D1117;
    --bg-color-lightened: #161B22;
    --card-bg: #171E29;
    --border-color: rgba(200, 220, 255, 0.1);
    --text-color: #C9D1D9;
    --text-color-muted: #8B949E;
    --text-color-headings: #E6EDF3;
    --accent-primary: #58A6FF;
    --accent-secondary: #F778BA;
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);

}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
    transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
    transform: translateY(-30px) scale(0.95);
}


.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}

.modal-container {
    background-color: var(--card-bg);
    padding: 25px 30px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    width: 100%;
    max-width: 500px;
    color: var(--text-color);
    transform: translateY(0) scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text-color-headings);
    font-weight: 600;
}

.close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--text-color-muted);
    cursor: pointer;
    line-height: 1;
    padding: 0;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: var(--accent-secondary);
}

.modal-body .form-group {
    margin-bottom: 20px;
}

.modal-body label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--text-color-muted);
    font-size: 0.9rem;
}

.modal-body input[type="text"],
.modal-body select {
    width: 100%;
    padding: 12px 15px;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    background-color: var(--bg-color-lightened);
    color: var(--text-color);
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.modal-body input[type="text"]:focus,
.modal-body select:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.2);
}

.modal-body input[type="text"]::placeholder {
    color: var(--text-color-muted);
    opacity: 0.7;
}

.select-wrapper {
    position: relative;
}

.select-wrapper::after {
    /* Custom arrow for select */
    content: '▼';
    font-size: 0.8em;
    color: var(--text-color-muted);
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.modal-body select {
    appearance: none;
    /* Remove default arrow */
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 35px;
    /* Space for custom arrow */
}


.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 25px;
}

.modal-actions .btn {
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: none;
}

.modal-actions .btn-secondary {
    background-color: var(--bg-color-lightened);
    color: var(--text-color-muted);
    border: 1px solid var(--border-color);
}

.modal-actions .btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: var(--text-color-muted);
    color: var(--text-color);
}

.modal-actions .btn-primary {
    background-color: var(--accent-primary);
    color: var(--bg-color);
}

.modal-actions .btn-primary:hover {
    background-color: lighten(var(--accent-primary), 10%);
    box-shadow: 0 2px 8px rgba(88, 166, 255, 0.3);
}
</style>