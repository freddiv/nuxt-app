import {
  configure
} from '@storybook/vue';

import Vue from 'vue';
import Vuex from 'vuex'; // Vue plugins
import '../assets/index.css'

const req = require.context('../components', true, /\.stories\.js$/)

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
