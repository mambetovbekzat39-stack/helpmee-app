if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker зарегистрирован'))
    .catch(err => console.error(err));
}

// Отслеживаем событие "beforeinstallprompt"
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Можно показать кнопку установки
  console.log('PWA можно установить!');
});
