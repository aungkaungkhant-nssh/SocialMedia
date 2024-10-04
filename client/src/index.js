import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemedApp from './ThemedApp';
import store from './app/store';
import {Provider} from 'react-redux';
import { checkAuth } from './features/authSlice';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));

store.dispatch(checkAuth({}));
// store.dispatch(fetchLatest({page:0}));
root.render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
          <Provider store={store}>
              <ThemedApp />
          </Provider>
     </QueryClientProvider>
  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
