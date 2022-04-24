import Form from './Form';
import AppContainer from './components/AppContainer';
import { Home } from './components/Home';

import { useRoutes } from "raviger";
import Preview from './components/Preview';
import Login from './Login';
import { useEffect, useState } from 'react';
import { me } from "./ApiUtils"
import { User } from './interfaces/UserActions';

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const getCurrentUser = async (setCurrentUser: (user: User) => void) => {
  const currentUser = await me();
  setCurrentUser(currentUser);
}


function App() {

  const routes = {
    "/": () => <Home />,
    "/form/:formId": ({formId} : {formId: string}) => <Form id={formId} />,
    "/preview/:formId": ({formId}: {formId: string}) => <Preview id={formId} page="0"/>,
    "/preview/:formId/:page": ({formId, page}: {formId: string, page: string}) => <Preview id={formId} page={page} />,
    "/login": () => <Login/>
  }

  const [currentUser, setCurrentUser] = useState<User>(null);

  const token = localStorage.getItem("token");

  useEffect(
    () => {
      getCurrentUser(setCurrentUser);
    }, [token]
  )

  return (
    <>
      <AppContainer currentUser={currentUser}>
        {useRoutes(routes)}
      </AppContainer>
      <ToastContainer
        position="top-right"
        theme="dark"
        autoClose={500}
        hideProgressBar={true}
      />
    </>
  );
}

export default App;
