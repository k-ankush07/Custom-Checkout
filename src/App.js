import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Banner from "./components/home-page/Banner";
import { CartProvider } from "./components/checkout-V1/CartContext";
import Checkout from "./Main-checkout";
import Login from "./components/log in/Log-in&sign-up";
import Store from "./components/store-details/Store";
import ResetPassword from "./components/log in/ResetPassword";
import Dashboard from "./components/main-dashboard/Dashboard";
import Subscription from "./components/subscription/Subscription";
import { ShopifyProvider } from "./components/main-dashboard/dashboard-Pages/ShopifyContext";
import Executive from "./components/main-dashboard/dashboard-Pages/Executive";
import Orders from "./components/main-dashboard/dashboard-Pages/Orders";
import CheckoutPage from "./components/main-dashboard/dashboard-Pages/Checkout";
import Abandoned from "./components/main-dashboard/dashboard-Pages/Abandoned";
import Customers from "./components/main-dashboard/dashboard-Pages/Customers";
import OrderDetail from "./components/main-dashboard/dashboard-Pages/details-pages/Order-detail";
import CustomerDetail from "./components/main-dashboard/dashboard-Pages/details-pages/Customer-detail";
import AbandonedDetail from "./components/main-dashboard/dashboard-Pages/details-pages/Abandoned.detail";
import PaymentCheck from "./components/subscription/PaymentCheck";
import CheckoutV2 from "./components/checkout-V2/Checkout";
import AdminLayout from "./components/admin/Admin-Layout";
import LoginAdmin from "./components/admin/login/Login";
import DashBoardAdmin from "./components/admin/dashBoard/DashBoard";
import PrivateRoute from "./components/admin/login/PrivateRoute";
import CheckoutGuard from "./components/subscription/CheckOutPayment";

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <ShopifyProvider>
          <CartProvider>
            <PaymentCheck />
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Banner />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/details" element={<Store />} />
              <Route
                path="/checkout"
                element={
                  <CheckoutGuard>
                    <Checkout />
                  </CheckoutGuard>
                }
              />
              <Route
                path="/checkoutv2"
                element={
                  <CheckoutGuard>
                    <CheckoutV2 />
                  </CheckoutGuard>
                }
              />
              <Route path="/payment" element={<Subscription />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route index element={<Executive />} />
                <Route path="executive" element={<Executive />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                <Route path="abandoned" element={<Abandoned />} />
                <Route path="abandoned/:id" element={<AbandonedDetail />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetail />} />
                <Route path="checkout-setup" element={<CheckoutPage />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="checkoutv2" element={<CheckoutV2 />} />
              </Route>
              <Route path="/admin/login" element={<LoginAdmin />} />
              <Route
                path="/admin/dashBoard"
                element={
                  <PrivateRoute>
                    <DashBoardAdmin />
                  </PrivateRoute>
                }
              />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </CartProvider>
        </ShopifyProvider>
      </Router>
    </div>
  );
}

export default App;