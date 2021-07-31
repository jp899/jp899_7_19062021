// Middleware qui redirige vers la route Login si l'utilisateur n'est pas connecté
export default function auth({ next, router }) {
    if (! ( localStorage.getItem('user')
            && JSON.parse(localStorage.getItem('user')).id 
            && localStorage.getItem('userToken')) ){
        return router.push({ name: 'Login' }).catch(err => {
            // Ignorer l'erreur de redirection vers Login lorsque l'on est déja sur Login.
            if (
              err.name !== 'NavigationDuplicated' &&
              !err.message.includes('Avoided redundant navigation to current location')
            ) {
              // But print any other errors to the console
              console.error(err);
            }
          });
    }
    return next();
  }