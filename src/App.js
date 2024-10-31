import React from 'react';
import './App.css';
import { Route, Router, Switch } from "react-router-dom";
import history from './router/history'
import ClientRouter from './pages/Home/Home'
import Dashboard from './componentAdmin/Dashboard/Dashboard'
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import PrivateRouter from './router/PrivateRouter'
import { HashRouter } from 'react-router-dom'
function App() {
  return (
    <HashRouter>
    <BrowserRouter>
     <SnackbarProvider maxSnack={3}>
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route path="/admin" component={()=><PrivateRouter component={Dashboard} />} />
            <Route path="/" component={ClientRouter} />
          </Switch>
        </Router>
      </div>
      </SnackbarProvider>
    </BrowserRouter>
    </HashRouter>
  );
}

export default App;
