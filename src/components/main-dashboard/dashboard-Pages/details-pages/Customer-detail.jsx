import { useParams, useLocation } from "react-router-dom";
import whitecustomers from '../../../../images/white-customers.webp';
import orders from '../../../../images/order1.webp';
import nameorder from '../../../../images/name1.webp';
import phoneorder from '../../../../images/phone1.webp';
import orderemail from '../../../../images/email1.webp';
import addressorder from '../../../../images/address1.webp';
import ziporder from '../../../../images/zip1.webp';
import countryorder from '../../../../images/country1.webp';
import price1 from '../../../../images/price1.webp';
import total1 from '../../../../images/total1.webp';

import { format } from "date-fns";
import { useShopify } from "../ShopifyContext";

export default function CustomerDetail() {
  const { id } = useParams();
  const location = useLocation();
  const customer = location.state?.customer;
  const { allOrders } = useShopify();

  const customerOrders = allOrders.filter(
    order => order.customer?.id === customer.id
  );

  if (!customer) {
    return <p>No customer data found. Try navigating from customers list.</p>;
  }

  const customerSince = customer.created_at
    ? format(new Date(customer.created_at), "dd MMM yyyy")
    : "N/A";

  const totalSpent = parseFloat(customer.total_spent || 0);
  const ordersCount = customer.orders_count || 0;

  let rfmGroup = "Low";
  if (ordersCount >= 5 && totalSpent > 1000) rfmGroup = "Champion";
  else if (ordersCount >= 3 && totalSpent > 500) rfmGroup = "Loyal";
  else if (ordersCount >= 1 && totalSpent > 100) rfmGroup = "Potential";
  else rfmGroup = "At Risk";

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="checkout-order-section detils">
      <div className="order-header sections">
        <div className="summary-card-img">
          <img src={whitecustomers} alt="" />
        </div>
        <h3>{customer.first_name} {customer.last_name} </h3>
      </div>

      <div className="customer-options sections">
        <div className="customer-wrapped">
          <span>Amount spent</span> 
          <span> ₹{formatCurrency(totalSpent)}</span>
        </div>
        <div className="customer-wrapped">
          <span>Orders</span> 
          <span>{ordersCount}</span>
        </div>
        <div className="customer-wrapped">
          <span>Customer Since</span> 
          <span>{customerSince}</span>
        </div>
        <div className="customer-wrapped group">
          <span>RFM Group</span> 
          <span>{rfmGroup}</span>
        </div>
      </div>

      <div className="order-basic-detils">
        <h4>Basic Detils</h4>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={orders} alt="" /></div>
          <div className="order-basic-text"><p>Order ID:</p> <span className="dync-order-detils">{id}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={nameorder} alt="" /></div>
          <div className="order-basic-text"><p>Name:</p> <span className="dync-order-detils">{customer.last_order_name}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={phoneorder} alt="" /></div>
          <div className="order-basic-text"><p>Phone:</p> <span className="dync-order-detils">{customer.phone || "N/A"}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={orderemail} alt="" /></div>
          <div className="order-basic-text"><p>Email:</p> <span className="dync-order-detils">{customer.email || "N/A"}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={addressorder} alt="" /></div>
          <div className="order-basic-text"><p>Address:</p> <span className="dync-order-detils">{customer.default_address?.address1 || "N/A"}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={ziporder} alt="" /></div>
          <div className="order-basic-text"><p>Zipcode:</p> <span className="dync-order-detils">{customer.default_address?.zip || "N/A"}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={countryorder} alt="" /></div>
          <div className="order-basic-text"><p>Country:</p> <span className="dync-order-detils">{customer.default_address?.country || "N/A"}</span></div>
        </div>
      </div>

      <div className="pricing-detials order-basic-detils">
        <h4>Pricing Details</h4>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={price1} alt="" /></div>
          <div className="order-basic-text">
            <p>Total Original Price:</p>
            <span className="dync-order-detils">₹{formatCurrency(customer.total_spent || 0)}</span>
          </div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={total1} alt="" /></div>
          <div className="order-basic-text">
            <p>Total Price:</p>
            <span className="dync-order-detils">₹{formatCurrency(customer.total_spent || 0)}</span>
          </div>
        </div>
      </div>

      <div className="order-table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th className="orders-sku">SKU</th>
              <th className="orders-variant-title">Variant Title</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th className="orders-final-line">Final Line Price</th>
              <th>Total Discount</th>
              <th>Final Price</th>
            </tr>
          </thead>
          <tbody>
            {customerOrders.length > 0 ? (
              customerOrders.map(order =>
                order.line_items.map(item => (
                  <tr key={item.id}>
                    <td>{item.product_id}</td>
                    <td className="orders-sku">{item.sku || "N/A"}</td>
                    <td className="orders-variant-title">{item.variant_title || "N/A"}</td>
                    <td className="orders-product-title">{item.title.split(' ').length > 10 ? item.title.split(' ').slice(0, 10).join(' ') + '...' : item.title}</td>
                    <td>{item.quantity}</td>
                    <td className="orders-final-line">₹{formatCurrency(item.price)}</td>
                    <td>₹{formatCurrency(order.discount_applications?.reduce((total, disc) => total + Number(disc.value || 0), 0) || 0)}</td>
                    <td>₹{formatCurrency(item.price * item.quantity - (order.total_discounts || 0))}</td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
