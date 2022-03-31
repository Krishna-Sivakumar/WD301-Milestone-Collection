import Form from './Form';
import AppContainer from './AppContainer';
import { Home } from './components/Home';

import { useRoutes } from "raviger";
import Preview from './components/Preview';

function App() {

  const routes = {
    "/": () => <Home />,
    "/form/:formId": ({formId} : {formId: string}) => <Form id={formId} />,
    "/preview/:formId": ({formId}: {formId: string}) => <Preview id={formId} page="0"/>,
    "/preview/:formId/:page": ({formId, page}: {formId: string, page: string}) => <Preview id={formId} page={page} />,
  }

  return (
    <AppContainer>
      {useRoutes(routes)}
    </AppContainer>
  );
}

export default App;
