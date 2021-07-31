// Middleware qui redirige vers la route Login si l'utilisateur n'est pas connecté
export default function auth({ next, router }) {
    if (! (JSON.parse(localStorage.getItem('user')).id && localStorage.getItem('userToken')) ){
        console.log('test')
        return router.push({ name: 'Login' });
    }
    return next();
  }