import { createApp } from 'vue';
import app from '~/app.vue';
import '~/style.css';
import router from '~/router';

const cApp = createApp(app);

cApp.use(router).mount('#app');
