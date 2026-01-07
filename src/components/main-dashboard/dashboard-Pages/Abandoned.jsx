import { useState, useEffect, useRef } from "react";
import { useShopify } from "./ShopifyContext";
import { useNavigate } from "react-router-dom";
import whiteabandoned from '../../../images/white-abandoned.webp';
import boot from '../../../images/boot.webp';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import today from '../../../images/today1.webp';
import down from '../../../images/down.webp';
import bar from '../../../images/bar.webp';
import left from '../../../images/Vector (2).png';
import right from '../../../images/right-mode.png';
import abandond from '../../../images/abandond11.webp';

export default function Abandoned() {
  const { allCheckout } = useShopify();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const rowsPerPage = 10;
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [appliedRange, setAppliedRange] = useState({ from: null, to: null });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const dropDateRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [openPicker, setOpenPicker] = useState("from");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isFromOpen = windowWidth > 540 ? true : openPicker === "from";
  const isToOpen = windowWidth > 540 ? true : openPicker === "to";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDateRef.current && !dropDateRef.current.contains(event.target)) {
        setIsDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRowClick = (order) => {
    navigate(`/dashboard/abandoned/${order.id}`, { state: { order } });
  };

  const filteredOrders = allCheckout.filter((order) => {
    const matchesSearch =
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const orderDate = new Date(order.created_at);

    const matchesDate = appliedRange.from && appliedRange.to
      ? orderDate >= appliedRange.from && orderDate <= appliedRange.to
      : true;

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [filteredOrders, currentPage, totalPages]);

  const applyDateFilter = () => {
    setAppliedRange({ from: fromDate, to: toDate });
    setIsDateOpen(false);
    if (windowWidth <= 540) setOpenPicker("from");
  };

  const clearDateFilter = () => {
    setFromDate(null);
    setToDate(null);
    setAppliedRange({ from: null, to: null });
    setIsDateOpen(false);
    if (windowWidth <= 540) setOpenPicker("from");
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageOrders = filteredOrders
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        .map((order) => order.id);
      setSelectedOrders([...new Set([...selectedOrders, ...pageOrders])]);
    } else {
      const pageOrders = filteredOrders
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        .map((order) => order.id);
      setSelectedOrders(selectedOrders.filter((id) => !pageOrders.includes(id)));
    }
  };

  const downloadCSV = () => {
    if (selectedOrders.length === 0) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

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

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return "";
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = filteredOrders
      .filter((order) => selectedOrders.includes(order.id))
      .flatMap((order) => {
        const customer = order.customer || {};
        const address = order.billing_address || order.shipping_address || {};

        const discountApplicationsTotal =
          order.discount_applications?.reduce(
            (total, disc) => total + Number(disc.value || 0),
            0
          ) || 0;

        const discountCodesTotal =
          order.discount_codes?.reduce(
            (total, disc) => total + Number(disc.amount || 0),
            0
          ) || 0;

        const lineItemDiscountsTotal =
          order.line_items?.reduce(
            (total, item) =>
              total +
              (item.applied_discounts?.reduce(
                (sum, d) => sum + Number(d.amount || 0),
                0
              ) || 0),
            0
          ) || 0;

        const totalDiscount =
          discountApplicationsTotal + discountCodesTotal + lineItemDiscountsTotal;

        const allDiscountCodes = [
          ...(order.discount_applications?.map((d) => d.title) || []),
          ...(order.discount_codes?.map((d) => d.code) || []),
          ...(order.line_items?.flatMap(
            (item) =>
              item.applied_discounts?.map((d) => d.description) || []
          ) || []),
        ].join(", ");

        const shippingCharges =
          order.shipping_lines?.reduce(
            (total, line) => total + Number(line.price || 0),
            0
          ) || 0;

        const baseRow = [
          escapeCSV(order.name || ""),
          escapeCSV(order.created_at || ""),
          escapeCSV(
            `${customer.first_name || address.first_name || ""} ${customer.last_name || address.last_name || ""
              }`.trim()
          ),
          escapeCSV(customer.email || ""),
          escapeCSV(customer.phone || address.phone || "N/A"),
          escapeCSV(
            `${address.address1 || ""} ${address.address2 || ""}, ${address.city || ""
              }, ${address.province || ""}`.trim()
          ),
          escapeCSV(address.zip || ""),
          escapeCSV(address.country || ""),
          escapeCSV(order.subtotal_price || ""),
          escapeCSV(order.total_price || ""),
          escapeCSV(totalDiscount || ""),
          escapeCSV(allDiscountCodes || ""),
          escapeCSV(shippingCharges || ""),
          escapeCSV(
            order.financial_status === "pending"
              ? "Payment Pending"
              : order.financial_status || ""
          ),
        ];

        if (order.line_items && order.line_items.length > 0) {
          return order.line_items.map((item) => {
            const finalLinePrice = Number(item.price) * Number(item.quantity);
            const finalPriceAfterDiscount =
              finalLinePrice - Number(totalDiscount || 0);

            return [
              ...baseRow,
              escapeCSV(item.product_id || ""),
              escapeCSV(item.sku || ""),
              escapeCSV(item.variant_title || ""),
              escapeCSV(item.title || ""),
              escapeCSV(item.quantity || ""),
              escapeCSV(finalLinePrice.toFixed(2)),
              escapeCSV(item.total_discount || ""),
              escapeCSV(finalPriceAfterDiscount.toFixed(2)),
            ];
          });
        } else {
          return [
            [
              ...baseRow,
              escapeCSV("No items"), "", "", "", "", "", "", "",
            ],
          ];
        }
      });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "selected_orders.csv");
  };

  return (
    <div className="checkout-order-section abandoned">
      <div className="order-wrapped">
        <div className="summary-card-img"><img src={whiteabandoned} alt="" /></div>
        <div className="summary-card-title"><h3>Abandoned Cart</h3></div>
      </div>
      <div className="orders-optins">
        <div className="orders-optins-left-side">
          <div ref={dropDateRef} className="order-summary options" >
            <div onClick={() => setIsDateOpen(!isDateOpen)} className="order-summary options-items">
              <p className="order-test section">Date Filter</p>
              <div className="summary-card-img">
                <img src={boot} alt="" />
              </div>
            </div>
            {isDateOpen && (
              <div
                className={`custom-dropdown date-filter ${isDateOpen ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()} >
                <div style={{ display: "flex", gap: "10px" }} className="custom-order-data-filter">
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="option-label"> <label>From</label></div>
                    <div className="custom-calender left">
                      <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        placeholderText="From"
                        className="custom-date-input"
                        open={isFromOpen}
                        onClickOutside={() => setOpenPicker(null)}
                        onInputClick={() =>
                          setOpenPicker((prev) => (prev === "from" ? null : "from"))
                        }
                      />
                      <div className="summary-card-img" >
                        <img src={today} alt="" />
                      </div>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="option-label"> <label>To</label></div>
                    <div className="custom-calender right">
                      <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        placeholderText="To"
                        className="custom-date-input"
                        open={isToOpen}
                        onClickOutside={() => setOpenPicker(null)}
                        onInputClick={() =>
                          setOpenPicker((prev) => (prev === "to" ? null : "to"))
                        }
                      />
                      <div className="summary-card-img" >
                        <img src={today} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dropdown-buttons">
                  <button className="drop-btn" onClick={applyDateFilter}>Apply</button>
                  <button className="drop-btn cancle" onClick={clearDateFilter}>Clear</button>
                </div>
              </div>
            )}
          </div>
          <div className="order-summary options" onClick={downloadCSV}>
            <p className="order-test section" >CSV</p>
            <div className="summary-card-img"><img src={down} alt="" /></div>
          </div>
        </div>
        <div className="order-search-bar">
          <div className="order-summary options">
            <p className="order-test section"> <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            /></p>
            <div className="summary-card-img"><img src={bar} alt="" /></div>
          </div>
        </div>
      </div>
      <div className="order-table-wrap">
        {filteredOrders.length === 0 ? (
          <div className="order-table-empty">
            <div className="no-orders-img"><img src={abandond} alt="" /></div>
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
                      checked={
                        filteredOrders
                          .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                          .every((order) => selectedOrders.includes(order.id))
                      } />
                  </th>
                  <th className="abandoned-item" style={{ width: "20.75%" }}>Order ID</th>
                  <th className=" abandoned-item abandoned-product-line-item" style={{ width: "60.75%" }}>Line Item</th>
                  <th className="abandoned-item" style={{ width: "23.75%" }}>Customer</th>
                  <th className="abandoned-item" style={{ width: "23.75%" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                  .map((order) => (
                    <tr key={order.id} onClick={() => handleRowClick(order)}>
                      <td> <input
                        type="checkbox"
                        className="custom-checkbox-order"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleCheckboxChange(order.id)}
                        onClick={(e) => e.stopPropagation()} /></td>
                      <td className="abandoned-item">{order.name}</td>
                      <td className="abandoned-product-line-item">
                        {order.line_items?.map(item => {
                          const words = item.title.split(" ");
                          const shortTitle =
                            words.length > 10 ? words.slice(0, 10).join(" ") + "..." : item.title;

                          return `${shortTitle}${item.variant_title ? ` (${item.variant_title})` : ""}`;
                        }).join(", ") || "No items"}
                      </td>

                      <td className="abandoned-item">
                        {order.customer
                          ? `${order.customer.first_name || ""} ${order.customer.last_name || ""}`
                          : "Guest"}
                      </td>
                      <td className="abandoned-item">
                        ₹{Number(order.current_total_price || order.total_price).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td >
                      <td className="abandoned-item">{order.financial_status === "pending" ? "Payment pending" : order.financial_status}</td>
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