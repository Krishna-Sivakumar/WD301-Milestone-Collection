import Header from './Header'
import AppContainer from './AppContainer';

const formFields = [
  {
    field: "firstname",
    label: "first name",
  },
  {
    field: "lastname",
    label: "last name",
  },
  {
    field: "email",
    label: "email",
    type: "email"
  },
  {
    field: "dob",
    label: "date of birth",
    type: "date"
  },
  {
    field: "tel",
    label: "phone number",
    type: "tel"
  }
]

function App() {
  return (
    <AppContainer>
      <Header 
        title={"welcome to lesson 5 of #react-typescript with #tailwindcss"}
      />
      {formFields.map(field => <div key={field.field}>
        <label className="font-semibold capitalize">{field.label}</label>
        <input type={field.type ?? "text"} className="border-2 border-gray-200 rounded-lg p-2 w-full"/>
      </div>)}
      <input type="submit" value="Submit" className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-xl text-white font-bold w-fit p-2 active:shadow-none" />
    </AppContainer>
  );
}

export default App;
