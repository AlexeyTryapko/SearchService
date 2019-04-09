'use strict'

let data = {};
let links = [];
let selectedPreset = '';

const linksList = document.querySelector('.links-list');
const presetsList = document.querySelector('.presets-list');
const keyWordBtn = document.querySelector('.btn-key-word');
const KeyWordInput = document.querySelector('.input-key-word');
const PresetInput = document.querySelector('.input-preset-title');
const LinkInput = document.querySelector('.input-link');
const addPreset = document.querySelector('.preset-add');
const deletePreset = document.querySelector('.preset-delete');
const addLink = document.querySelector('.link-add');
const deleteLink = document.querySelector('.link-delete');

const updateList = (data, parent, classes, clickCB) => {
  while (parent.firstChild) parent.removeChild(parent.firstChild);
  data.forEach(value => {
    const li = document.createElement('li');
    li.classList.add(...classes)
    li.innerHTML = value;
    li.addEventListener('click', clickCB);
    parent.appendChild(li);
  });
};

const processing = (link, key) => link.split('{{route}}').join(key);

const openWindows = (links, key) => links.map(link => processing(link, key))
  .forEach(link => window.open(link));

const linkItemClick = item => {
  const value = item.target.outerText;
  LinkInput.value = value;
};

const presetItemClick = preset => {
  const value = preset.target.outerText;
  selectedPreset = value;
  PresetInput.value = value;
  links = data[value];
  updateList(links, linksList, ['links-item'], linkItemClick);
};

const config = {
  apiKey: "AIzaSyB1jaS834z_XSQ9YHQ2L-N7aPsUjWHYc30",
  authDomain: "searchservice-d0e77.firebaseapp.com",
  databaseURL: "https://searchservice-d0e77.firebaseio.com",
  projectId: "searchservice-d0e77",
  storageBucket: "searchservice-d0e77.appspot.com",
  messagingSenderId: "663524939814"
};

firebase.initializeApp(config);

const database = firebase.database();
firebase.database().ref().on('value', snapshot => {
  data = Object.assign({}, snapshot.val());
  const presetsData = Object.keys(data);
  updateList(presetsData, presetsList, ['preset-item'], presetItemClick);
});

addPreset.addEventListener('click', () => {
  const key = PresetInput.value;
  if (key && !data[key]) {
    firebase.database().ref().update({
      [key]: ['https://en.wikipedia.org/wiki/{{route}}']
    });
    PresetInput.value = "";
  }
});

deletePreset.addEventListener('click', () => {
  const key = PresetInput.value;
  if (key && data[key]) {
    firebase.database().ref().update({
      [key]: null
    });
    PresetInput.value = "";
    firebase.database().ref().once('value').then(snapshot => {
      data = Object.assign({}, snapshot.val());
      const presetsData = Object.keys(data);
      updateList(presetsData, presetsList, ['preset-item'], presetItemClick);
    });
  }
});

addLink.addEventListener('click', () => {
  const key = LinkInput.value;
  const preset = data[selectedPreset];
  if (key && preset) {
    const index = Object.keys(preset).length;
    firebase.database().ref('/' + selectedPreset).update({
      [index]: key,
    });
    LinkInput.value = "";
    firebase.database().ref('/' + selectedPreset).once('value').then(snapshot => {
      links = snapshot.val();
      updateList(links, linksList, ['links-item'], linkItemClick);
    });
  }
});

deleteLink.addEventListener('click', () => {
  const key = LinkInput.value;
  const preset = data[selectedPreset];
  if (key && preset) {
    const index = links.indexOf(key);
    firebase.database().ref('/' + selectedPreset).update({
      [index]: null
    });
    LinkInput.value = "";
    firebase.database().ref('/' + selectedPreset).once('value').then(snapshot => {
      links = snapshot.val();
      updateList(links, linksList, ['links-item'], linkItemClick);
    });
  }
});

keyWordBtn.addEventListener('click', () => openWindows(links, KeyWordInput.value));
KeyWordInput.addEventListener('keypress', e => (
  e.keyCode === 13 ? openWindows(links, KeyWordInput.value) : ''
));