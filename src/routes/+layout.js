import { browser } from '$app/environment';

export async function load({ url }) {
  if (browser) {
    const username = sessionStorage.getItem('username');
    
    if (!username && url.pathname !== '/') {
      return {
        status: 302,
        redirect: '/'
      };
    }

    return {
      props: {
        username
      }
    };
  }

  return {
    props: {}
  };
}