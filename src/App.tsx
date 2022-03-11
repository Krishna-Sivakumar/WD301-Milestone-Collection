import { useState } from 'react';
import Form from './Form';
import AppContainer from './AppContainer';
import { Home } from './Home';


function App() {

  const [formOpen, setFormOpen] = useState(false)

  const openForm = () => {
    setFormOpen(true);
  }

  const closeForm = () => {
    setFormOpen(false);
  }

  return (
    <AppContainer>
      {
        !formOpen ? <Home openFormCB={openForm}/> : <Form closeFormCB={closeForm}/>
      }
    </AppContainer>
  );
}

export default App;
