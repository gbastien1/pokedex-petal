import React from 'react';
import { Provider } from 'react-redux';
import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <App/>
    </Provider>
  );
}

export default App;
