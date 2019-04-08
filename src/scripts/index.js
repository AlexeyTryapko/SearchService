'use strict'
import '../styles/index.scss';

const links = [
  "https://medium.com/{{route}}",
  "https://translate.google.com/?source=gtx#view=home&op=translate&sl=en&tl=ru&text={{route}}",
  "https://facebook.com/{{route}}",
  "https://github.com/{{route}}",
];

const linksList = document.querySelector('.links-list');

const updateList = data => {
  data.forEach(link => {
    const li = document.createElement('li');
    li.classList.add('links-item')
    li.innerHTML = link;
    linksList.appendChild(li);
  });
};
updateList(links);

const processing = (link, key) => link.split('{{route}}').join(key);

const openWindows = (links, key) => links.map(link => processing(link, key))
  .forEach(link => window.open(link));

const keyWordBtn = document.querySelector('.btn-key-word');
const KeyWordInput = document.querySelector('.input-key-word');

keyWordBtn.addEventListener('click', () => openWindows(links, KeyWordInput.value));
KeyWordInput.addEventListener('keypress', e => (
  e.keyCode === 13 ? openWindows(links, KeyWordInput.value) : ''
));
