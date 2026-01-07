import { useState, useEffect, useRef } from "react";
import { useShopify } from "./ShopifyContext";
import { format, isToday, isYesterday, startOfToday, endOfToday, subDays, isWithinInterval } from "date-fns";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { saveAs } from "file-saver";
import today from '../../../images/today1.webp';
import orderimg from '../../../images/orderimg.webp';
import itemimg from '../../../images/itemimg.webp';
import padimg from '../../../images/padimg.webp';
import codimg from '../../../images/codimg1.webp';
import amountimg from '../../../images/amountimg.webp';
import boot from '../../../images/boot.webp';
import left from '../../../images/Vector (2).png';
import right from '../../../images/right-mode.png';
import bottomArrow from '../../../images/bottom-arrow.webp';
import down from '../../../images/down.webp';
import bar from '../../../images/bar.webp';
import ordercart from '../../../images/order00.webp';

export default function Orders() {
  const { allOrders } = useShopify();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [appliedRange, setAppliedRange] = useState({ from: null, to: null });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [orderTypeFilter, setOrderTypeFilter] = useState("");
  const [timeRange, setTimeRange] = useState("30days");
  const [isOpen, setIsOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const dropdownRef = useRef(null);
  const dropDateRef = useRef(null);
  const dropOrderRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [openPicker, setOpenPicker] = useState("from");

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isFromOpen = windowWidth > 540 ? true : openPicker === "from";
  const isToOpen = windowWidth > 540 ? true : openPicker === "to";

  const handleSelect = (value) => {
    setOrderTypeFilter(value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropOrderRef.current && !dropOrderRef.current.contains(event.target)) {
        setIsOrderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function formatOrderDate(dateString) {
    const date = new Date(dateString);
    if (isToday(date)) return `Today at ${format(date, "hh:mm a")}`;
    if (isYesterday(date)) return `Yesterday at ${format(date, "hh:mm a")}`;
    return `${format(date, "dd MMM yyyy hh:mm a")}`;
  }

  const handleRowClick = (order) => {
    navigate(`/dashboard/orders/${order.id}`, { state: { order } });
  };

  const filterByTimeRange = (orders) => {
    if (timeRange === "today") {
      const todayStart = startOfToday();
      const todayEnd = endOfToday();
      return orders.filter((order) =>
        isWithinInterval(new Date(order.created_at), {
          start: todayStart,
          end: todayEnd,
        })
      );
    }

    if (timeRange === "7days") {
      const start = subDays(new Date(), 7);
      return orders.filter((order) =>
        isWithinInterval(new Date(order.created_at), { start, end: new Date() })
      );
    }

    if (timeRange === "30days") {
      const start = subDays(new Date(), 30);
      return orders.filter((order) =>
        isWithinInterval(new Date(order.created_at), { start, end: new Date() })
      );
    }

    return orders;
  };

  const summaryOrders = filterByTimeRange(allOrders);

  const totalOrders = summaryOrders.length;
  const totalItems = summaryOrders.reduce((sum, order) => {
    const orderItemsCount = order.line_items?.reduce(
      (itemSum, item) => itemSum + (item.current_quantity || 0),
      0
    );
    return sum + orderItemsCount;
  }, 0);

  const paidOrders = summaryOrders.filter(
    (order) => order.financial_status === "paid"
  ).length;

  const codOrders = summaryOrders.filter(
    (order) => order.financial_status === "pending"
  ).length;

  const totalAmount = summaryOrders.reduce(
    (sum, order) => sum + parseFloat(order.current_total_price || 0),
    0
  );

  const tableOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const orderDate = new Date(order.created_at);

    const matchesDate =
      appliedRange.from && appliedRange.to
        ? orderDate >= appliedRange.from && orderDate <= appliedRange.to
        : true;

    const matchesOrderType = orderTypeFilter
      ? order.financial_status === orderTypeFilter
      : true;

    return matchesSearch && matchesDate && matchesOrderType;
  });

  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = tableOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(tableOrders.length / rowsPerPage);

  useEffect(() => {
    const totalPages = Math.ceil(tableOrders.length / rowsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [tableOrders, rowsPerPage, currentPage]);

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
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = () => {
    const allOrderIds = currentOrders.map((order) => order.id);
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(allOrderIds);
    }
  };

  const downloadCSV = () => {
    if (selectedOrders.length === 0) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    const ordersToDownload = allOrders.filter((order) =>
      selectedOrders.includes(order.id)
    );

    const csvRows = [];
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
    csvRows.push(headers.join(","));

    const escapeCSV = (value) => {
      if (value === null || value === undefined) return "";
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };

    ordersToDownload.forEach((order) => {
      const customer = order.customer || {};
      const address = order.shipping_address || {};

      const baseRow = [
        escapeCSV(order.name || ""),
        escapeCSV(order.created_at || ""),
        escapeCSV(`${customer.first_name || ""} ${customer.last_name || ""}`.trim()),
        escapeCSV(customer.email || ""),
        escapeCSV(address.phone || customer.phone || ""),
        escapeCSV(`${address.address1 || ""} ${address.address2 || ""}`.trim()),
        escapeCSV(address.zip || ""),
        escapeCSV(address.country || ""),
        escapeCSV(order.total_line_items_price || ""),
        escapeCSV(order.current_total_price || order.total_price || ""),
        escapeCSV(order.total_discounts || ""),
        escapeCSV(order.discount_codes?.map((d) => d.code).join("; ") || ""),
        escapeCSV(order.total_shipping_price_set?.shop_money?.amount || ""),
        escapeCSV(order.financial_status === "pending" ? "Payment Pending" : order.financial_status || ""),
      ];

      if (order.line_items && order.line_items.length > 0) {
        order.line_items.forEach((item) => {
          const row = [
            ...baseRow,
            escapeCSV(item.product_id || ""),
            escapeCSV(item.sku || ""),
            escapeCSV(item.variant_title || ""),
            escapeCSV(item.title || ""),
            escapeCSV(item.quantity || ""),
            escapeCSV(item.final_line_price || ""),
            escapeCSV(item.total_discount || ""),
            escapeCSV(item.price || ""),
          ];
          csvRows.push(row.join(","));
        });
      } else {
        csvRows.push([...baseRow, "", "", "", "", "", "", "", "", ""].map(escapeCSV).join(","));
      }
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "selected_orders.csv");
  };

  const formatCurrency = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="checkout-order-section">
      <div className="order-banner">
        <div ref={dropOrderRef} className="order-sections wraping">
          <div className="order-summary-options-items" onClick={() => setIsOrderOpen(!isOrderOpen)} >
            <div className="order-summary">
              <p className="order-test section">
                {timeRange === "today"
                  ? "Today"
                  : timeRange === "7days"
                    ? "Last 7 days"
                    : "Last 30 days"}
              </p>
              <div className="summary-card-img" >
                <img src={today} alt="" />
              </div>
            </div>
            <div className="order-show-details"></div>
            <span>Updated Now</span>
            <div className={`custom-dropdown ${isOrderOpen ? "open" : ""}`}>
              {["today", "7days", "30days"].map((option) => {
                const label =
                  option === "today" ? "Today" : option === "7days" ? "Last 7 days" : "Last 30 days";
                const description =
                  option === "today"
                    ? "Compared to yesterday up to current hour"
                    : option === "7days" ? "Compared to the previous 6 days" : "Compared to the previous 30 days";

                const isSelected = timeRange === option;
                return (
                  <div key={option}
                    className={`custom-option ${isSelected ? "selected" : ""}`}
                    onClick={() => { setTimeRange(option); setIsOrderOpen(false); }}
                  >
                    <div className="radio-box-wrapped">
                      <div className="radio-box-container">
                        {isSelected && <div className="radio-box"></div>}
                      </div>
                      <span className="option-label">{label}</span>
                    </div>
                    <div className="option-description">{description}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="order-sections">
          <div className="order-summary">
            <p className="order-test section">Orders</p>
            <div className="summary-card-img"><img src={orderimg} alt="" /></div>
          </div>
          <div className="order-show-details">{totalOrders}</div>
          <span>Last Day</span>
        </div>
        <div className="order-sections">
          <div className="order-summary">
            <p className="order-test section">Items Ordered</p>
            <div className="summary-card-img"><img src={itemimg} alt="" /></div>
          </div>
          <div className="order-show-details">{totalItems}</div>
          <span>Last Day</span>
        </div>
        <div className="order-sections">
          <div className="order-summary">
            <p className="order-test section">Paid</p>
            <div className="summary-card-img"><img src={padimg} alt="" /></div>
          </div>
          <div className="order-show-details">{paidOrders}</div>
          <span>Last Day</span>
        </div>
        <div className="order-sections">
          <div className="order-summary">
            <p className="order-test section">COD</p>
            <div className="summary-card-img"><img src={codimg} alt="" /></div>
          </div>
          <div className="order-show-details">{codOrders}</div>
          <span>Last Day</span>
        </div>
        <div className="order-sections">
          <div className="order-summary">
            <p className="order-test section">Amount</p>
            <div className="summary-card-img"><img src={amountimg} alt="" /></div>
          </div>
          <div className="order-show-details">₹{formatCurrency(totalAmount)}</div>
          <span>Updated Now</span>
        </div>
      </div>
      <div className="order-items-section">
        <div className="order-wrapped">
          <div className="summary-card-img"><img src={orderimg} alt="" /></div>
          <div className="summary-card-title"><h3>Orders</h3></div>
        </div>
        <div className="orders-optins">
          <div className="orders-optins-left-side">
            <div ref={dropDateRef} className="order-summary options date-filter" >
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
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }} >
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
            <div ref={dropdownRef} className="order-summary options">
              <div onClick={() => setIsOpen(!isOpen)} className="order-summary options-items">
                <p className="order-test section">Order type</p>
                <div className="summary-card-img">
                  <img src={bottomArrow} alt="arrow" />
                </div>
              </div>
              <div className={`custom-dropdown ${isOpen ? "open" : ""}`}>
                {["", "paid", "pending"].map((option) => {
                  let label = option === "" ? "All" : option === "paid" ? "Prepaid" : "COD";
                  const isSelected = orderTypeFilter === option;
                  return (
                    <div
                      key={option}
                      className={`custom-option ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelect(option)}
                    >
                      <div className="radio-box-container">
                        {isSelected && <div className="radio-box"></div>}
                      </div>
                      <span className="option-label">{label}</span>
                    </div>
                  );
                })}
              </div>
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
      </div>
      <div className="order-table-wrap">
        {tableOrders.length === 0 ? (
          <div className="order-table-empty">
            <div className="no-orders-img"><img src={ordercart} alt="" /></div>
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
                      checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                    />
                  </th>
                  <th className="orders-id" style={{ width: "15.75%" }}>Order id</th>
                  <th className="orders-date" style={{ width: "20.75%" }}>Date</th>
                  <th className="orders-item-table" style={{ width: "20.75%" }}>Customer</th>
                  <th className="orders-item-table" style={{ width: "20.75%" }}>Amount</th>
                  <th className="orders-item-table status" style={{ width: "20.75%" }}>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id} onClick={() => handleRowClick(order)}>
                    <td style={{ width: "10px" }}>
                      <input
                        type="checkbox"
                        className="custom-checkbox-order"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleCheckboxChange(order.id)}
                        onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td>{order.name}</td>
                    <td className="orders-date">{formatOrderDate(order.created_at)}</td>
                    <td>
                      {order.customer?.first_name} {order.customer?.last_name}
                    </td>
                    <td>₹{formatCurrency(order.current_total_price || order.total_price)}</td>
                    <td className="orders-item-table status" >
                      {order.financial_status === "pending"
                        ? "payment pending"
                        : order.financial_status}
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
