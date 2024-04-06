// jest.setup.js
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html>');
global.document = dom.window.document;
global.window = dom.window;
global.navigator = dom.window.navigator;
