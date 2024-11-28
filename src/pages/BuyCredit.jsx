import { useContext, useState } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function BuyCredit() {
  const { user, backendUrl, loadCreditsData, token, setShowLogin } =
    useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order?.amount,
      currency: order?.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order?.id,
      receipt: order?.receipt,
      handler: async (response) => {
        console.log("response in handler in initPay : ", response);
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razor`,
            response,
            { headers: token }
          );

          if (data?.success) {
            console.log("razor pay successful in initPay");
            await loadCreditsData();
            toast.success(data?.message);
            navigate("/");
          } else {
            console.log("razor pay failed in initPay");
            toast.error(data?.message);
          }
        } catch (err) {
          console.log("Error in handler in initPay : ", err);
          toast.error(err?.message);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true);
      }
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/user/pay-razor`,
        { planId },
        { headers: { token } }
      );

      if (data?.success) {
        initPay(data?.order);
      }
    } catch (err) {
      console.log("Error in paymentRazorpay in BuyCredit.jsx : ", err);
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-[80vh] text-center pt-14 mb-10"
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Choose the plan
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
            key={index}
          >
            <img src={assets.logo_icon} width={40} alt="logo_icon" />
            <p className="mt-3 mb-1 font-semibold">{item?.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price}</span> /{" "}
              {item.credits} Credits available
            </p>
            <button
              onClick={() => paymentRazorpay(item?.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
              disabled={loading}
            >
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default BuyCredit;