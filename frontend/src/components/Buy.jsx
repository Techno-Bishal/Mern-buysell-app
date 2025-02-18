import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js"

const Buy = () => {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;  //using optional chaining to avoid crashing incase token is not there!!!

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  if (!token) {
    navigate("/login");
  }
  // Retrieve token from localStorage on component mount
 

  useEffect(()=>{
    const fetchBuyCourseData = async()=>{
      console.log("Final Token before request:", token); // Debugging step

      if (!token) {
        setError("Please login to purchase the course");
        return;
      }
  
      try {
    
        const response = await axios.post(
          `http://localhost:3000/api/v1/course/buy/${courseId}`, // Backend API URL
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
       console.log(response.data)
       setCourse(response.data.course)
       setClientSecret(response.data.clientSecret)
       setLoading(false)

      } catch (error) {
        if (error.response?.status === 400) {
          toast.error("You have already purchased the course!");
        } else {
          setError(error?.response?.data?.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBuyCourseData()
  },[courseId])

  const handlePurchase = async (event) => {
    event.preventDefault();
    console.log("🚀 Payment process started...");

    if (!stripe || !elements) {
        console.log("❌ Stripe or Elements not found.");
        return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (!card) {
        console.log("❌ CardElement not found.");
        setLoading(false);
        return;
    }

    console.log("📝 Creating Payment Method...");
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
    });

    if (error) {
        console.log("❌ Stripe PaymentMethod Error:", error.message);
        setCardError(error.message);
        setLoading(false);
        return;
    }
    console.log("✅ Payment Method created:", paymentMethod);

    if (!clientSecret) {
        console.log("❌ No client secret found.");
        setLoading(false);
        return;
    }

    console.log("🔄 Confirming payment with Stripe...");
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: user?.user?.firstName,
                email: user?.user?.email,
            },
        },
    });

    console.log("⏳ Payment Intent response:", paymentIntent, confirmError);

    if (confirmError) {
        console.log("❌ Payment confirmation error:", confirmError.message);
        setCardError(confirmError.message);
        setLoading(false);
        return;
    }

    if (paymentIntent.status === "succeeded") {
        console.log("🎉 Payment succeeded. ID:", paymentIntent.id);

        const paymentInfo = {
            email: user?.user?.email,
            userId: user.user._id,
            courseId: courseId,
            paymentId: paymentIntent.id,
            amount: paymentIntent.amount,
            status: paymentIntent.status,
        };

        console.log("📤 Sending payment info to backend...", paymentInfo);

        try {
            const response = await axios.post("http://localhost:3000/api/v1/order", paymentInfo, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            console.log("✅ Backend response:", response.data);
            toast.success("Payment Successful!");
            navigate("/purchases");
        } catch (err) {
            console.log("❌ Error sending payment info:", err);
            toast.error("Error in making payment");
        }
    } else {
        console.log("❌ Payment not successful.");
        setCardError("Payment failed. Please try again.");
    }

    setLoading(false);
    console.log("✅ Payment process completed.");
};



  return (
    <>
    {error ? (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-semibold">{error}</p>
          <Link
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
            to={"/purchases"}
          >
            Purchases
          </Link>
        </div>
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row my-40 container mx-auto">
        <div className="w-full md:w-1/2">
          <h1 className="text-xl font-semibold underline">Order Details</h1>
          <div className="flex items-center text-center space-x-2 mt-4">
            <h2 className="text-gray-600 text-sm">Total Price</h2>
            <p className="text-red-500 font-bold">${course.price}</p>
          </div>
          <div className="flex items-center text-center space-x-2">
            <h1 className="text-gray-600 text-sm">Course name</h1>
            <p className="text-red-500 font-bold">{course.title}</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Process your Payment!
            </h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="card-number"
              >
                Credit/Debit Card
              </label>
              <form onSubmit={handlePurchase}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />

                <button
                  type="submit"
                  disabled={!stripe || loading} // Disable button when loading
                  className="mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                >
                  {loading ? "Processing..." : "Pay"}
                </button>
              </form>
              {cardError && (
                <p className="text-red-500 font-semibold text-xs">
                  {cardError}
                </p>
              )}
            </div>

            <button className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center">
              <span className="mr-2">🅿️</span> Other Payments Method
            </button>
          </div>
        </div>
      </div>
    )}
  </>
);
}

export default Buy;
