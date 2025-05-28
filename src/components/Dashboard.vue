// src/views/Dashboard.vue (or wherever it's located)
<template>
  <div class="dashboard-layout">
    <DashboardHeader /> 
    <main class="dashboard-content">
      <!-- This is where your LatestNews and potentially other dashboard widgets will go -->
      <LatestNews />
      <!-- You could add more sections or components here -->
      <!-- For example:
      <section class="quick-stats"> ... </section>
      <section class="recent-activity"> ... </section>
      -->
    </main>
    <!-- <footer class="dashboard-footer">
      <p>© {{ new Date().getFullYear() }} Your App Name. All rights reserved.</p>
    </footer> -->
  </div>
</template>

<script setup>
import LatestNews from '../components/LatestNews.vue'; // Adjust path if needed
import DashboardHeader from '../components/DashboardHeader.vue'; // Adjust path if needed
// Import other dashboard components/widgets here if you add them
</script>

<style scoped>
/* Assuming global CSS variables are available */
.dashboard-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure it takes full viewport height */
  background-color: var(--bg-color); /* Main background from your theme */
  color: var(--text-color); /* Default text color */
  font-family: var(--font-family-main); /* Assuming --font-family-main is defined */
}

/* The DashboardHeader component will be styled by its own scoped styles */
/* We just ensure it's placed correctly within the layout. */

.dashboard-content {
  flex-grow: 1; /* Allows content to take up available space */
  padding: 20px 30px; /* Add padding around the main content area */
  /*
  If you want a max-width for the content area within the dashboard (like LatestNews container):
  max-width: 1200px; 
  margin: 0 auto; 
  width: 100%;
  */
}

/*
.dashboard-footer {
  padding: 15px 30px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-color-muted);
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-color-lightened);
}
*/

/* Example of how you might style additional sections if you add them */
/*
.quick-stats, .recent-activity {
  background-color: var(--card-bg);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  margin-bottom: 20px;
  box-shadow: var(--shadow-md);
}
.quick-stats h2, .recent-activity h2 {
  color: var(--text-color-headings);
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}
*/
</style>