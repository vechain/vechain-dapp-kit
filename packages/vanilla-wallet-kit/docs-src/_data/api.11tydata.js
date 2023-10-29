/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const fs = require('fs');

// eslint-disable-next-line no-undef
module.exports = () => {
  const customElements = JSON.parse(
    fs.readFileSync('custom-elements.json', 'utf-8')
  );
  return {
    customElements,
  };
};
