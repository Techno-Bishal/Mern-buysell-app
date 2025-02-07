
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QoKj9ADtkLMVSeYeFWcAWpT9CLnnOOpz5FKO1gaBLEbKbsdEiTQNxMwcpnSy6hHNSwgPE86kFud455W0YlSQ0nT00qaSdZdca");

createRoot(document.getElementById('root')).render(
 
   
   <Elements  stripe={stripePromise}>
   <BrowserRouter>
  <App />
  </BrowserRouter>
 </Elements>
  
)
