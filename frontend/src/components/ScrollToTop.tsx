import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTop } from '../lib/util';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === '') {
      scrollToTop();
    }
    // else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 500);
    }
  }, [pathname, hash]);

  return null;
}
