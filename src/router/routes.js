import AppLayout from '@/layouts/AppLayout.vue';
import Workbench from '@/pages/Workbench.vue';
export const routes = [
    {
        path: '/',
        component: AppLayout,
        redirect: '/dashboard',
        children: [
            { path: 'dashboard', name: 'dashboard', component: Workbench },
        ],
    },
];
