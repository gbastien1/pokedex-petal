import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Index from './pokedex/Index/index.jsx';
import Detail from './pokedex/Detail/index.jsx';
import './App.scss';

function App() {
  return (
    
    <Router>
      <div>
        <Switch>
          <Route path="/detail/id/:id" component={Detail}/>
          <Route path="/" component={Index}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
