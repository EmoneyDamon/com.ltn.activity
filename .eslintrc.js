module.exports = {
  env: {
    browser: true,
    node: true
  },
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  rules: {
    'react/jsx-filename-extension': [1, {
      extensions: ['.js', '.jsx']
    }],
    'react/no-danger': [0],
    'react/forbid-prop-types': [0],
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', 120, 2],
    'jsx-a11y/no-static-element-interactions': [0],
    'class-methods-use-this': [0],
  }
};
