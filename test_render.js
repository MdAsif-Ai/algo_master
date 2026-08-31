import { renderToString } from 'react-dom/server';
import React from 'react';
import App from './src/App.jsx';

try {
  console.log("Rendering App...");
  const html = renderToString(React.createElement(App));
  console.log("Render successful!");
} catch (e) {
  console.error("Render failed with error:");
  console.error(e);
}
