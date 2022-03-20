import { useState } from 'react';
import Form from './Form';
import AppContainer from './AppContainer';
import { Home } from './components/Home';


function App() {

  const [formOpen, setFormOpen] = useState(false);
  const [formId, setFormId] = useState(0);

  const openForm = (id: number) => {
    setFormId(id);
    setFormOpen(true);
  }

  const closeForm = () => {
    setFormOpen(false);
  }

  return (
    <AppContainer>
      {
        !formOpen ? <Home openFormCB={openForm}/> : <Form id={formId} closeFormCB={closeForm}/>
      }
    </AppContainer>
  );
}

export default App;
