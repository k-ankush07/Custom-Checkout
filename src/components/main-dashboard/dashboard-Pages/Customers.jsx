import { useState, useEffect } from "react";
import { useShopify } from "./ShopifyContext";
import { useNavigate } from "react-router-dom";
import whitecustomers from '../../../images/white-customers.webp';
import whiteorder from '../../../images/white-order.webp';
import dollar from '../../../images/dollar.webp';
import down from '../../../images/down.webp';
import bar from '../../../images/bar.webp';
import { saveAs } from "file-saver";
import left from '../../../images/Vector (2).png';
import right from '../../../images/right-mode.png';
import customer from '../../../images/customer11.webp';

export default function Customers() {
  const { filteredCustomers, allOrders } = useShopify();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const handleRowClick = (customer) => {
    navigate(`/dashboard/customers/${customer.id}`, { state: { customer } });
  };

  const searchedCustomers = filteredCustomers.filter((customer) => {
    const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
    const email = customer.email?.toLowerCase() || "";
    return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const totalCustomers = searchedCustomers.length;
  const indexOfLastCustomer = currentPage * rowsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
  const currentCustomers = searchedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(totalCustomers / rowsPerPage);

  const totalOrders = searchedCustomers.reduce((sum, customer) => sum + (customer.orders_count || 0), 0);
  const totalSpent = searchedCustomers.reduce((sum, customer) => sum + parseFloat(customer.total_spent || 0), 0);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [searchedCustomers, totalPages, currentPage]);

  const handleCheckboxChange = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter((id) => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  const handleSelectAll = () => {
    const allIds = currentCustomers.map((customer) => customer.id);
    if (selectedCustomers.length === currentCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(allIds);
    }
  };

  const downloadCSV = () => {
    if (selectedCustomers.length === 0) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    const customersToDownload = filteredCustomers.filter((customer) =>
      selectedCustomers.includes(customer.id)
    );

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Email",
      "Phone",
      "Address",
      "Zipcode",
      "Country",
      "Total Original Price",
      "Total Price",
      "Discount Amount",
      "Discount Coupon Code",
      "Shipping Charges",
      "Payment Status",
      "Product ID",
      "SKU",
      "Variant Title",
      "Product Name",
      "Quantity",
      "Final Line Price",
      "Total Discount",
      "Final Price",
    ];

    const rows = customersToDownload.flatMap((customer) => {
      const customerOrders = allOrders.filter(
        (order) => order.customer?.id === customer.id
      );

      if (customerOrders.length === 0) {
        return [[
          customer.name,
          customer.created_at,
          `${customer.first_name || ""} ${customer.last_name || ""}`,
          customer.email || "",
          customer.phone || "",
          customer.default_address?.address1 || "",
          customer.default_address?.zip || "",
          customer.default_address?.country || "",
          customer.total_spent || 0,
          customer.total_spent || 0,
          "", "", "", "", "", "", "", "", "", "", "", ""
        ]];
      }

      return customerOrders.flatMap((order) =>
        order.line_items?.map((item) => {
          const orderDate = order.created_at
            ? new Date(order.created_at).toISOString()
            : "";

          const totalDiscount =
            order.total_discounts ||
            order.discount_applications?.reduce(
              (total, disc) => total + Number(disc.value || 0),
              0
            ) ||
            0;

          const discountCode =
            order.discount_applications?.map((d) => d.code).join(", ") || "";

          const shippingPrice = order.shipping_lines?.[0]?.price || 0;

          const finalLinePrice =
            item.final_line_price ||
            item.price * item.quantity ||
            0;

          const finalPrice =
            order.total_price ||
            (order.total_line_items_price || 0) + shippingPrice - totalDiscount;

          const paymentStatus =
            order.financial_status ||
            order.payment_gateway_names?.join(", ") ||
            "N/A";

          return [
            order.name || order.id || "",
            orderDate,
            `${customer.first_name || ""} ${customer.last_name || ""}`,
            customer.email || "",
            customer.phone || "",
            customer.default_address?.address1 || "",
            customer.default_address?.zip || "",
            customer.default_address?.country || "",
            order.total_line_items_price || "",
            order.total_price || "",
            totalDiscount,
            discountCode,
            shippingPrice,
            paymentStatus,
            item.product_id || "",
            item.sku || "",
            item.variant_title || "",
            item.title || "",
            item.quantity || "",
            finalLinePrice,
            totalDiscount,
            finalPrice,
          ];
        })
      );
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "selected_customers.csv");
  };

  return (
    <div className="checkout-order-section customer">
      <div className="order-banner wrpedd">
        <div className="order-sections">
          <div className="order-summary">
            <p className="order-test section">Customers</p>
            <div className="summary-card-img"><img src={whitecustomers} alt="" /></div>
          </div>
          <div className="order-show-details">{totalCustomers}</div>
        </div>
        <div className="order-sections">
          <div className="order-summary">
            <p className="order-test section">Orders</p>
            <div className="summary-card-img"><img src={whiteorder} alt="" /></div>
          </div>
          <div className="order-show-details">{totalOrders}</div>
        </div>
        <div className="order-sections">
          <div className="order-summary">
            <p className="order-test section">Total Spent</p>
            <div className="summary-card-img"><img src={dollar} alt="" /></div>
          </div>
          <div className="order-show-details">
            ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

        </div>
      </div>

      <div className="order-items-section">
        <div className="order-wrapped">
          <div className="summary-card-img"><img src={whitecustomers} alt="" /></div>
          <div className="summary-card-title"><h3>Customers</h3></div>
        </div>
        <div className="orders-optins">
          <div className="orders-optins-left-side">
            <div className="order-summary options">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="summary-card-img"><img src={bar} alt="" /></div>
            </div>
          </div>
          <div className="order-search-bar" onClick={downloadCSV} style={{ cursor: "pointer" }}>
            <div className="order-summary options">
              <p className="order-test section">CSV</p>
              <div className="summary-card-img"><img src={down} alt="" /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-table-wrap">
        {currentCustomers.length === 0 ? (
          <div className="order-table-empty">
            <div className="no-orders-img"><img src={customer} alt="" /></div>
            <p className="no-orders">No matching orders found.</p>
          </div>
        ) : (
          <>
            <table className="orders-table">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>
                    <input
                      type="checkbox"
                      className="custom-checkbox-order item"
                      onChange={handleSelectAll}
                      checked={selectedCustomers.length === currentCustomers.length && currentCustomers.length > 0}
                    />
                  </th>
                  <th className="customer-items" style={{ width: "15.75%" }}>Customer Name</th>
                  <th className="customer-email" style={{ width: "20.75%" }}>Email Subscription</th>
                  <th className="customer-items" style={{ width: "20.75%" }}>Location</th>
                  <th className="customer-items" style={{ width: "20.75%" }}>Orders</th>
                  <th className="customer-items" style={{ width: "20.75%" }}>Amount Spent</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((customer) => (
                  <tr key={customer.id} onClick={() => handleRowClick(customer)} style={{ cursor: "pointer" }}>
                    <td>
                      <input
                        type="checkbox"
                        className="custom-checkbox-order"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleCheckboxChange(customer.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td>{customer.first_name} {customer.last_name}</td>
                    <td className="customer-email">
                      {customer.email_marketing_consent
                        ? customer.email_marketing_consent.state
                        : "N/A"}
                    </td>
                    <td>
                      {customer.default_address
                        ? `${customer.default_address.city}, ${customer.default_address.province_code}, ${customer.default_address.country}`
                        : "N/A"}
                    </td>
                    <td>
                      {customer.orders_count} {customer.orders_count === 1 ? "order" : "orders"}
                    </td>
                    <td>
                      ₹{parseFloat(customer.total_spent || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-checkout">
              <button className="btn-pagination"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <img src={left} alt="" />
              </button>
              <span className="pagination-wraped">
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <div
                      key={pageNum}
                      className={`pagination-page ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </div>
                  );
                })}
              </span>
              <button className="btn-pagination"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <img src={right} alt="" />
              </button>
            </div>
          </>
        )}
      </div>
      {showPopup && (
        <div className="popup-error">
          <p>Please select at least one order.</p>
        </div>
      )}
    </div>
  );
}
