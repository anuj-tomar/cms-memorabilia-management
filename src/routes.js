import requireAuth from './hoc/requireAuth';
import App from './App';
import Login from './pages/login';
import Home from './pages/home';


export default [
  {
    component: App,
    routes: [
      {
        component: Login,
        path: '/login',
        exact: true
      },
      {
        component: Home,
        path: '/home',
        auth: true,
        exact: true
      }
    ]
  }
];
