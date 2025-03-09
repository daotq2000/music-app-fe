import React from 'react';
import './App.css';
import { Route, Router, Switch, HashRouter } from 'react-router-dom';
import history from './router/history';
import ClientRouter from './pages/Home/Home';
import Dashboard from './componentAdmin/Dashboard/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import PrivateRouter from './router/PrivateRouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={5}>
          <div className='App'>
            <Router history={history}>
              <Switch>
                <Route
                  path='/admin'
                  component={() => <PrivateRouter component={Dashboard} />}
                />
                <Route path='/' component={ClientRouter} />
              </Switch>
            </Router>
          </div>
        </SnackbarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
