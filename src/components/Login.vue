<template>
  <div class="login-container">
    <div class="scanline-overlay"></div>
    <div class="login-box">
      <div class="login-header">
        <h1 class="title">
          <span class="bracket">[</span>SYSTEM LOGIN<span class="bracket">]</span>
          <span class="cursor">_</span>
        </h1>
        <p class="subtitle">// Authenticate to establish secure connection</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <span class="prompt">></span> UID_FIELD:
          </label>
          <input v-model="username" type="text" id="username" class="form-control" placeholder="Enter Operator ID"
            autocomplete="username" required />
        </div>
        <div class="form-group">
          <label for="password" class="form-label">
            <span class="prompt">></span> AUTH_TOKEN_FIELD:
          </label>
          <input v-model="password" type="password" class="form-control" id="password"
            placeholder="Input Passphrase Sequence" autocomplete="current-password" required />
        </div>
        <button type="submit" class="btn-login" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>INITIATE_CONNECTION</span>
        </button>
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
      </form>
      <div class="login-footer">
        <p class="footer-text">SYSTEM STATUS: <span class="status-ok">ONLINE</span> // AWAITING_INPUT</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const loginError = ref('');

const handleLogin = async () => {
  if (!username.value || !password.value) {
    loginError.value = 'Operator ID and Passphrase Sequence are required.';
    return;
  }
  isLoading.value = true;
  loginError.value = ''; // Clear previous error

  try {
    const response = await window?.electron?.login({
      username: username.value,
      password: password.value,
    });

    console.log('IPC Login Response:', response);

    if (response && response.success) {
      // Simulate successful login effects before redirecting
      document.documentElement.classList.add('login-success-effect'); // For potential global effects
      setTimeout(() => {
        username.value = '';
        password.value = '';
        router.push('/dashboard'); // Navigate to dashboard
        document.documentElement.classList.remove('login-success-effect');
      }, 1000); // Delay for effect
    } else {
      loginError.value = response?.error || 'Authentication failed. Access denied.';
      // Shake animation for error
      const loginBox = document.querySelector('.login-box');
      if (loginBox) {
        loginBox.classList.add('shake-error');
        setTimeout(() => loginBox.classList.remove('shake-error'), 600);
      }
    }
  } catch (err) {
    console.error('Login system error:', err);
    loginError.value = 'System communication error. Try again.';
  } finally {
    // Keep loading true for a bit longer if success, for the effect
    if (!loginError.value) {
      // isLoading handled by timeout for success
    } else {
      isLoading.value = false;
    }
  }
};
</script>

<style scoped>
.login-container {
  --hacker-bg: #0a0f14;
  /* Very dark blue/black */
  --hacker-bg-translucent: rgba(10, 15, 20, 0.85);
  --hacker-form-bg: rgba(10, 25, 40, 0.75);
  /* Slightly lighter, translucent for form */
  --hacker-green: #00ff6a;
  /* Bright, classic hacker green */
  --hacker-green-dim: rgba(0, 255, 106, 0.6);
  --hacker-green-dark: #008035;
  --hacker-cyan: #00e0e0;
  --hacker-text: #c0c0c0;
  /* Light grey for less important text */
  --hacker-border: rgba(0, 255, 106, 0.25);
  --hacker-glow: rgba(0, 255, 106, 0.4);
  --hacker-error: #ff4136;

  --font-mono: 'Roboto Mono', 'Fira Code', 'Courier New', monospace;

  min-height: 100vh;
  width: 100vw;
  /* Changed from min-width */
  background-image: url("/images/bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: var(--hacker-bg);
  /* Fallback or base color */
  background-blend-mode: multiply;
  /* Blends the image with the dark background */

  display: flex;
  justify-content: center;
  align-items: center;
  font-family: var(--font-mono);
  color: var(--hacker-text);
  position: relative;
  overflow: hidden;
  /* Prevents scrollbars from pseudo-elements */
}

/* Subtle scanline effect overlay */
.scanline-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(to bottom,
      rgba(10, 15, 20, 0) 0%,
      /* Adjust opacity and color for scanline visibility */
      rgba(10, 15, 20, 0) 98%,
      rgba(0, 255, 106, 0.03) 99%,
      /* Faint green scanline */
      rgba(10, 15, 20, 0) 100%);
  background-size: 100% 3px;
  /* Adjust scanline thickness */
  animation: scanlines 20s linear infinite;
  z-index: 1;
}

@keyframes scanlines {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 0 100vh;
  }
}

.login-box {
  background: var(--hacker-form-bg);
  padding: 30px 40px;
  border-radius: 8px;
  border: 1px solid var(--hacker-border);
  box-shadow: 0 0 30px rgba(0, 255, 106, 0.1), 0 0 15px rgba(0, 0, 0, 0.5) inset;
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  /* For Safari */
  z-index: 2;
  /* Above scanlines */
  position: relative;
  /* For potential pseudo-elements for corners */
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Optional: Corner brackets for the login box */
.login-box::before,
.login-box::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--hacker-green-dim);
  border-style: solid;
  opacity: 0.7;
}

.login-box::before {
  top: -5px;
  left: -5px;
  border-width: 2px 0 0 2px;
}

.login-box::after {
  bottom: -5px;
  right: -5px;
  border-width: 0 2px 2px 0;
}


.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header .title {
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--hacker-green);
  margin: 0 0 5px 0;
  text-shadow: 0 0 8px var(--hacker-glow);
  letter-spacing: 1px;
}

.login-header .title .bracket {
  color: var(--hacker-green-dim);
}

.login-header .title .cursor {
  animation: blink 1s step-end infinite;
  display: inline-block;
  /* Important for the cursor to take space */
}

@keyframes blink {

  from,
  to {
    color: transparent;
  }

  50% {
    color: var(--hacker-green);
  }
}

.login-header .subtitle {
  font-size: 0.9rem;
  color: var(--hacker-text);
  margin: 0;
}

.login-form .form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-label {
  display: block;
  font-size: 0.85rem;
  color: var(--hacker-cyan);
  margin-bottom: 8px;
  font-weight: 500;
}

.form-label .prompt {
  color: var(--hacker-green-dim);
  margin-right: 5px;
}

.form-control {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--hacker-border);
  color: var(--hacker-green);
  padding: 12px 15px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 1rem;
  caret-color: var(--hacker-green);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-control::placeholder {
  color: rgba(0, 255, 106, 0.4);
  opacity: 1;
  /* Firefox */
}

.form-control:focus {
  outline: none;
  border-color: var(--hacker-green);
  box-shadow: 0 0 10px var(--hacker-glow), 0 0 0 1px var(--hacker-green);
}

.btn-login {
  width: 100%;
  padding: 12px 15px;
  background-color: var(--hacker-green-dark);
  color: var(--hacker-bg);
  border: 1px solid var(--hacker-green);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.1s ease;
  margin-top: 10px;
  /* Space above button */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-login:hover:not(:disabled) {
  background-color: var(--hacker-green);
  color: var(--hacker-bg);
  box-shadow: 0 0 15px var(--hacker-glow);
}

.btn-login:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: var(--hacker-green-dim);
}

.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  /* Darker border for contrast */
  border-radius: 50%;
  border-top-color: var(--hacker-bg);
  /* Matches button text color */
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


.error-message {
  color: var(--hacker-error);
  font-size: 0.85rem;
  text-align: center;
  margin-top: 15px;
  padding: 8px;
  background-color: rgba(255, 65, 54, 0.1);
  border: 1px solid rgba(255, 65, 54, 0.3);
  border-radius: 4px;
}

.login-footer {
  margin-top: 25px;
  text-align: center;
  font-size: 0.8rem;
  color: var(--hacker-text);
  border-top: 1px dashed var(--hacker-border);
  padding-top: 15px;
}

.login-footer .status-ok {
  color: var(--hacker-green);
  font-weight: bold;
}


/* Shake animation for error */
.shake-error {
  animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
}

@keyframes shake {

  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-3px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(3px, 0, 0);
  }
}

/* Success "glitch" or effect - can be expanded */
/* This is a placeholder. More complex effects might need JS or more CSS */
.login-success-effect .login-box {
  animation: success-pulse 1s ease-out;
}

@keyframes success-pulse {
  0% {
    box-shadow: 0 0 30px rgba(0, 255, 106, 0.1), 0 0 0 0 rgba(0, 255, 106, 0.5);
  }

  70% {
    box-shadow: 0 0 30px rgba(0, 255, 106, 0.4), 0 0 20px 30px rgba(0, 255, 106, 0);
  }

  100% {
    box-shadow: 0 0 30px rgba(0, 255, 106, 0.1), 0 0 0 0 rgba(0, 255, 106, 0);
  }
}
</style>