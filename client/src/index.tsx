import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import 'bootstrap/dist/css/bootstrap.min.css';
import FacesStore from './store/FacesStore';
import ImagesStore from './store/ImagesStore';
export const Context = createContext<{ faces: FacesStore, images: ImagesStore }>({ faces: new FacesStore(), images: new ImagesStore() });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  <Context.Provider value={{
    faces: new FacesStore(),
    images: new ImagesStore()
  }}>
    <App />
  </Context.Provider>

);


