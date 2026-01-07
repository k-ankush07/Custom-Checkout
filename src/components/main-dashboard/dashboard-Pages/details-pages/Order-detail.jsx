import { useParams, useLocation } from "react-router-dom";
import odrderImage from '../../../../images/white-order.webp';
import orders from '../../../../images/order1.webp';
import nameorder from '../../../../images/name1.webp';
import phoneorder from '../../../../images/phone1.webp';
import orderemail from '../../../../images/email1.webp';
import addressorder from '../../../../images/address1.webp';
import ziporder from '../../../../images/zip1.webp';
import countryorder from '../../../../images/country1.webp';
import price1 from '../../../../images/price1.webp';
import total1 from '../../../../images/total1.webp';
import discount from '../../../../images/discount1.webp';
import copen from '../../../../images/copen.webp';
import shipping from '../../../../images/shipping.webp';

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  console.log(order)

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalDiscount = order.discount_applications?.reduce(
    (total, disc) => total + Number(disc.value || 0),
    0
  ) || 0;

  if (!order) {
    return <p>No order data found. Try navigating from Orders list.</p>;
  }

  return (
    <div className="checkout-order-section detils">
      <div className="order-header sections">
        <div className="summary-card-img" >
          <img src={odrderImage} alt="" />
        </div>
        <h3>ORDER {order.name}</h3>
      </div>
      <div className="order-basic-detils">
        <h4>Basic Detils</h4>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={orders} alt="" /></div>
          <div className="order-basic-text"><p>Order ID:</p> <span className="dync-order-detils">{order.id}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={nameorder} alt="" /></div>
          <div className="order-basic-text"><p>Name:</p> <span className="dync-order-detils">{order.customer?.first_name || order.billing_address?.first_name}{" "}
            {order.customer?.last_name || order.billing_address?.last_name}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={phoneorder} alt="" /></div>
          <div className="order-basic-text"><p>Phone:</p> <span className="dync-order-detils">{order.customer?.phone || "N/A"}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={orderemail} alt="" /></div>
          <div className="order-basic-text"><p>Email:</p> <span className="dync-order-detils">{order.customer?.email || "N/A"}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={addressorder} alt="" /></div>
          <div className="order-basic-text address"><p>Address:</p> <span className="dync-order-detils">{order.billing_address?.address1 || "N/A"},
            {order.billing_address?.province || "N/A"}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={ziporder} alt="" /></div>
          <div className="order-basic-text"><p>Zipcode:</p> <span className="dync-order-detils"> {order.billing_address?.zip || "N/A"}</span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={countryorder} alt="" /></div>
          <div className="order-basic-text"><p>Country:</p> <span className="dync-order-detils">{order.billing_address?.country}</span></div>
        </div>
      </div>
      <div className="pricing-detials order-basic-detils">
        <h4>Pricing Details</h4>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={price1} alt="" /></div>
          <div className="order-basic-text"><p>Total Original Price:</p> <span className="dync-order-detils">
            ₹{formatCurrency(order.current_subtotal_price)}</span></div>
        </div>

        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={total1} alt="" /></div>
          <div className="order-basic-text"><p>Total Price:</p> <span className="dync-order-detils">
            ₹{formatCurrency(order.current_total_price)}
          </span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={discount} alt="" /></div>
          <div className="order-basic-text"><p>Discount Amount:</p> <span className="dync-order-detils">
            ₹{formatCurrency(totalDiscount)}
          </span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={copen} alt="" /></div>
          <div className="order-basic-text"><p>Discount Coupon Code:</p> <span className="dync-order-detils">
            {order.discount_applications?.length
              ? order.discount_applications.map(d => d.title).join(", ")
              : "N/A"}
          </span></div>
        </div>
        <div className="order-basic-wrapped">
          <div className="order-basic-img"><img src={shipping} alt="" /></div>
          <div className="order-basic-text"><p>Shipping Charges:</p> <span className="dync-order-detils">
               ₹{formatCurrency(order.total_shipping_price_set?.shop_money?.amount)}
          </span></div>
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
            {order.line_items?.map(item => (
              <tr key={item.id}>
                <td>{item.product_id}</td>
                <td className="orders-sku">{item.sku || "N/A"}</td>
                <td className="orders-variant-title">{item.variant_title || "N/A"}</td>
                <td className="orders-product-title">
                  {item.title.split(' ').length > 10
                    ? item.title.split(' ').slice(0, 10).join(' ') + '...'
                    : item.title}
                </td>
                <td>{item.quantity}</td>
                <td className="orders-final-line">₹{item.price}</td>
                <td>₹{formatCurrency(totalDiscount)}</td>
                 <td>₹{formatCurrency(item.price * item.quantity - (order.total_discounts || 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
