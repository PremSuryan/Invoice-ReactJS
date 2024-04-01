import "./sass/main.scss";
import { NavBar, Main, InvoiceDetails } from "./components";
import { BrowserRouter as Router,Route, BrowserRouter } from "react-router-dom";
import {Register} from "./components";
import LoginPage from "./components/loginpage";


function App() {
  return (
   <>
    <BrowserRouter>
      <Route>
        <Route path ="/" children = {<LoginPage/>} />
        <Route path ="/register" children = {<Register/>} />
        <Route exact path="/:id" children={<InvoiceDetails />} />
      </Route>
    </BrowserRouter>
   </>
  );
}

export default App;

