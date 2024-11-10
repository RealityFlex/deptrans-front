import './style.scss';

import { type App, type DirectiveBinding } from 'vue';

const svgSpinner = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v3m0 15v-3m-7.794-1.5L6.804 15M21 12h-3m-1.5 7.794L15 17.196M3 12h3m1.5-7.794L9 6.804m-1.5 12.99L9 17.196m10.794-.696L17.196 15M4.206 7.5L6.804 9"/></svg>`;

const setup = (app: App): void => {
  app.directive(
    'loading',
    (parent: HTMLElement, binding: DirectiveBinding<boolean>) => {
      if (binding.value) {
        if (parent.getElementsByClassName('loading-overlay').length === 0) {
          const spinner = document.createElement('div');
          spinner.insertAdjacentHTML('beforeend', svgSpinner);
          parent.style.position = 'relative';
          spinner.className = 'loading-overlay';
          parent.appendChild(spinner);
        }
      } else {
        const spinner = parent.getElementsByClassName('loading-overlay')[0];
        if (spinner && spinner.parentElement === parent) {
          parent.removeChild(spinner);
          parent.style.removeProperty('position');
        }
      }
    },
  );
};

export default setup;
