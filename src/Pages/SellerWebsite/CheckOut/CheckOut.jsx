import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WebDataDisContext } from "../../../Context/WebDataDisContext";
import { AuthContext } from "../../../Provider/AuthProvider";
import axios from "axios";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import toast from "react-hot-toast";
import { Currency } from "lucide-react";

const Checkout = () => {
  const { confirmProduct, webData, name } = useContext(WebDataDisContext);
  const { user } = useContext(AuthContext);
  const email = user?.email;
  const sellerEmail = webData?.email;
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [mobileBankingOption, setMobileBankingOption] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  useEffect(() => {
    if (!confirmProduct) {
      navigate(-1);
    }
  }, [confirmProduct, navigate, name]); // Add dependencies
  console.log(confirmProduct);
  const [totalPrice, setTotalPrice] = useState(0); // Assume initial total without any extra fees

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get("totalAmount");
    if (amount) {
      setTotalPrice(parseFloat(amount));
    }
  }, [location.search]);
  // Function to handle card input changes
  const handleCardInputChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  // Function to calculate the total price based on payment method
  const calculateTotal = () => {
    let extraCharge = 0;
    if (paymentMethod === "cashOnDelivery") {
      extraCharge = 10; // Cash on Delivery charge is $10
    }
    return totalPrice + extraCharge;
  };

  const handlePayment = async () => {
    // Ensure confirmProduct is an array, even if it's a single object
    const productData = Array.isArray(confirmProduct)
      ? confirmProduct
      : [confirmProduct];

    // Map over the productData to append additional payment information
    const updatedProductData = productData.map((product) => ({
      ...product,
      paymentStatus:
        paymentMethod === "cashOnDelivery" ? "pending" : "completed",
      buyerEmail: email,
      sellerEmail: sellerEmail,
    }));

    // Iterate over each product and send a separate API call for each
    try {
      for (const product of updatedProductData) {
        const response = await axiosPublic.post("/payment", {
          ...product, // Sending individual product object
          paymentMethod,
        });
        toast.success(`Payment for product ${product.name} succeeded`);
        navigate(`/w/${name}`);
      }
      // Handle successful payments here (e.g., navigate to a success page)
    } catch (error) {
      console.error("Payment failed for one or more products", error);
      // Handle payment failure (e.g., show error message)
    }
  };
  const handleSSLPayment = async () => {
    const data = {
      Amount: calculateTotal().toFixed(2),
      Currency: "BDT",
      productId: confirmProduct.map((product) => product._id),
    };
    console.log(data);
    const res = await axiosPublic.post("/paymentSSL", data);

    console.log(res.data.sslCommerzResponse.GatewayPageURL);
    const redirectURL = res.data.sslCommerzResponse.GatewayPageURL
    console.log(redirectURL)
    if(redirectURL !== ""){
      window.location.replace(redirectURL)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* Left Side - Payment Methods */}
        <div className="col-span-8 bg-white p-6 shadow-lg rounded-md">
          <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
          <div className="flex space-x-4 mb-6">
            <button
              className={`py-2 px-4 rounded ${
                paymentMethod === "cashOnDelivery"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setPaymentMethod("cashOnDelivery")}
            >
              Cash on Delivery
            </button>
            <button
              className={`py-2 px-4 rounded ${
                paymentMethod === "mobileBanking"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setPaymentMethod("mobileBanking")}
            >
              Mobile Banking
            </button>
            <button
              className={`py-2 px-4 rounded ${
                paymentMethod === "cardPayment"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setPaymentMethod("cardPayment")}
            >
              Card Payment
            </button>
          </div>

          {/* Payment Method Content */}
          {paymentMethod === "cashOnDelivery" && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p>
                Cash on Delivery is selected. A $10 charge will be added to your
                total.
              </p>
            </div>
          )}

          {paymentMethod === "mobileBanking" && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-lg font-semibold mb-2">
                Select Mobile Banking Option
              </h4>
              <div className="space-x-4">
                <button
                  className={`py-2 px-4 rounded ${
                    mobileBankingOption === "bikash"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setMobileBankingOption("bikash")}
                >
                  Bkash
                </button>
                <button
                  className={`py-2 px-4 rounded ${
                    mobileBankingOption === "nogod"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setMobileBankingOption("nogod")}
                >
                  Nogod
                </button>
                <button
                  className={`py-2 px-4 rounded ${
                    mobileBankingOption === "upay"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setMobileBankingOption("upay")}
                >
                  Upay
                </button>
              </div>
            </div>
          )}

          {paymentMethod === "cardPayment" && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-lg font-semibold mb-2">Enter Card Details</h4>
              <div>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardInputChange}
                  placeholder="Card Number"
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardInputChange}
                  placeholder="Expiry Date (MM/YY)"
                  className="w-full p-2 border rounded mb-2"
                />
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  placeholder="CVV"
                  className="w-full p-2 border rounded mb-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Order Summary */}
        <div className="col-span-4 bg-white p-6 shadow-lg rounded-md">
          <h4 className="font-semibold text-lg mb-2">Order Summary</h4>
          <div className="flex justify-between mb-2">
            <span>Items Total</span>
            <span>$ {totalPrice.toFixed(2)}</span>
          </div>
          {paymentMethod === "cashOnDelivery" && (
            <div className="flex justify-between mb-2">
              <span>Cash on Delivery Fee</span>
              <span>$ 10.00</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-orange-600 text-lg">
            <span>Total</span>
            <span>$ {calculateTotal().toFixed(2)}</span>
          </div>

          {/* Proceed to Pay */}
          <button
            onClick={handleSSLPayment}
            className="w-full bg-orange-500 text-white font-bold py-3 mt-6 rounded hover:bg-orange-600"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;