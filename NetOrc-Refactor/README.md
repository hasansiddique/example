# NetOrc
> Visual network orchestration build using `React`, `Google Maps`, `node`, and `d3`

### Required Dependencies

- `node -v 4/4+`

## Getting Started

### 1. Clone Respository
  Using `HTTPS`
  ```
  https://github.com/Wanclouds/netOrc.git
  ```
  OR using `SSH`
  ```
  git@github.com:Wanclouds/netOrc.git
  ```
### 2. Setup web app
  ```
  npm install
  ```
### 3. Build and Launch web app
#### Development Mode
  ```
  npm start
  ```
#### Production Mode
  ```
  npm run prod
  ```
  >   tip: run commands with `-s` flag for reduced webpack noise
  
## Contributing

Before submitting a pull request, run `npm run lint` && `npm run test`. This ensures that there are no lint errors or failing unit tests.

## Unit Tests
### 1. Running Unit tests
  ```
  npm run test
  ```
> tip: Unit tests are run using `mocha`.

### 2. Getting Unit test Coverage
  ```
  npm run coverage
  ```
  
  > Note: when developing, npm run test:watch may be useful as it will watch for file changes and re-run tests.

## Tests for React Components

[Enzyme](http://airbnb.io/enzyme/) is used as the primary tool for testing React components.
See [Enzyme documentation](http://airbnb.io/enzyme/docs/api/index.html), specifically [shallow render documentation](http://airbnb.io/enzyme/docs/api/shallow.html).

## Technologies
- [React](https://facebook.github.io/react/)
- [Google Maps](https://developers.google.com/maps/documentation/javascript/)
- [Node](http://nodejs.org/api/)
- [Hapi](http://hapijs.com/)
- [jQuery](http://jquery.com/)
- [Webpack](https://webpack.github.io/)
- [Lo-Dash](http://lodash.com/)
- [Sass](http://sass-lang.com/)
- [Foundation](http://foundation.zurb.com/docs/)
- [D3](http://d3js.org/)
