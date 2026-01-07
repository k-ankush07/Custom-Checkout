import { useNavigate } from "react-router-dom";
import { useShopify } from "./ShopifyContext";
import totoalImg from '../../../images/totoalImg.webp';
import ordersImg from '../../../images/ordersImg.webp';
import codImg from '../../../images/codImg.webp';
import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const totalOrder = payload.find(p => p.dataKey === "total")?.value || 0;
    const rtoOrder = payload.find(p => p.dataKey === "rto")?.value || 0;
    const rtoPercent = totalOrder ? Math.round((rtoOrder / totalOrder) * 100) : 0;

    return (
      <div className="order-graph-sections-item" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {[
          { label: 'Total Orders', value: totalOrder, color: '#23C66D' },
          { label: 'RTO Orders', value: rtoOrder, color: '#D9383B' },
          { label: 'RTO %', value: `${rtoPercent}%`, color: '#3dadff' }
        ].map((item, index) => (
          <div key={index} className="order-graph-sections">
            <div className="order-graph-wrap">
              <div className="order-graph" style={{ borderColor: item.color, backgroundColor: '#fff' }}></div>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Executive() {
  const navigate = useNavigate();
  const { allOrders, rtoOrders } = useShopify();
  const [fontSize, setFontSize] = useState(15);
  useEffect(() => {
    const handleResize = () => setFontSize(window.innerWidth <= 840 ? 12 : 15);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalOrders = useMemo(() => allOrders?.length || 0, [allOrders]);
  const totalRto = useMemo(() => rtoOrders?.length || 0, [rtoOrders]);
  const prepaidOrders = useMemo(() => allOrders?.filter(o => o.financial_status === "paid").length || 0, [allOrders]);
  const codOrders = useMemo(() => allOrders?.filter(o => o.financial_status === "pending").length || 0, [allOrders]);

  const combinedChartData = useMemo(() => {
    const monthlyTotal = Array(12).fill(0);
    const monthlyRTO = Array(12).fill(0);

    allOrders?.forEach(order => {
      if (order.created_at) {
        const month = new Date(order.created_at).getMonth();
        monthlyTotal[month] += 1;
      }
    });

    rtoOrders?.forEach(order => {
      if (order.created_at) {
        const month = new Date(order.created_at).getMonth();
        monthlyRTO[month] += 1;
      }
    });

    return monthlyTotal.map((total, index) => {
      const rto = monthlyRTO[index] || 0;
      return {
        name: new Date(0, index).toLocaleString("default", { month: "short" }),
        total,
        rto,
        rtoPercent: total ? Math.round((rto / total) * 100) : 0,
      };
    });
  }, [allOrders, rtoOrders]);

  const cardSummary = [
    { title: "Total Orders", value: totalOrders, img: totoalImg, color: "#015E6B", change: "+12%", desc: "than last week" },
    { title: "Prepaid Orders", value: prepaidOrders, img: ordersImg, color: "#015E6B", change: "+8%", desc: "than yesterday" },
    { title: "Cash on Delivery", value: codOrders, img: codImg, color: "#015E6B", change: "-5%", desc: "than last month" }
  ]

  const cardDetails = [
    { title: "Total Orders", value: totalOrders, stroke: "#23C66D", description: "Overall number of orders placed", footer: "Updated 5 minutes ago" },
    { title: "RTO Orders", value: totalRto, stroke: "#D9383B", description: "Orders returned to origin", footer: "Last sync 1 hour ago" },
    { title: "RTO %", value: totalOrders ? Math.round((totalRto / totalOrders) * 100) : 0, stroke: "#3dadff", description: "Percentage of orders returned", footer: "Calculated from today’s orders" }
  ]
  const yValues = combinedChartData.map(d => Math.max(d.total, d.rto, d.rtoPercent));

  const maxValue = Math.max(...yValues);
  const yAxisWidth = maxValue.toString().length * 10;
  return (
    <div className="executive-wrapper">
      <div className="executive-title"><h3>Dashboard</h3></div>
      <div className="executive-subtitle">
        Analyze completed orders, average order value, and checkout conversion rates by location.
      </div>

      <div className="executive-order-types">
        {cardSummary.map((card, idx) => (
          <div key={idx} className="summary-card">
            <div className="summary-card-actions">
              <div className="summary-card-text">
                <p className="order-test">{card.title}</p>
                <span>{card.value}</span>
              </div>
              <div className="summary-card-img"><img src={card.img} alt={card.title} /></div>
            </div>
            <div className="summary-description">
              <span style={{ color: card.color }}>{card.change}</span><p>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-section">
        <div className="overview-header"><h3>Orders Overview</h3></div>
        <div className="chart-box">
          <p className="title">Checkout Performance</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedChartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#636363" strokeWidth={1} strokeDasharray="2 2" horizontal vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#888", fontSize }} />
              <YAxis axisLine={false} tickLine={false} orientation="left" width={40} tick={{ fill: "#888", fontSize: 15, className: "custom-y-tick", }} tickFormatter={(value) => value.toFixed(2)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#23c66d" fill="rgba(35,198,109,0.2)" strokeWidth={3}
                dot={{ r: 6, fill: "#fff", stroke: "#1FA64F", strokeWidth: 2 }}
                activeDot={{ r: 8, fill: "#fff", stroke: "#1FA64F", strokeWidth: 3 }}
              />
              <Line type="monotone" dataKey="total" stroke="#23c66d" strokeWidth={4} dot={{ r: 5, fill: "#fff", stroke: "#1FA64F", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#fff", stroke: "#1FA64F", strokeWidth: 3 }} />
              <Line type="monotone" dataKey="rto" stroke="#D9383B" strokeWidth={3} dot={{ r: 5, fill: "#fff", stroke: "#D9383B", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#fff", stroke: "#D9383B", strokeWidth: 3 }} />
              <Line type="monotone" dataKey="rtoPercent" stroke="#3dadff" strokeWidth={3} dot={{ r: 5, fill: "#fff", stroke: "#3dadff", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#fff", stroke: "#3dadff", strokeWidth: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="details-section">
        {cardDetails.map((item, index) => (
          <div key={index} className="detail-card">
            <div className="detail-title"><p>{item.title}</p></div>
            <div
              className={`detail-des ${index === 0
                ? "custom-one"
                : index === 1
                  ? "custom-two"
                  : index === 2
                    ? "custom-three"
                    : ""
                }`}
            >
              <p>{item.description}</p>
            </div>

            <div className="detail-graph-circle">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="70" stroke="#dfdfdf" strokeWidth="10" fill="none" />
                <circle
                  cx="75"
                  cy="75"
                  r="70"
                  stroke={item.stroke}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={
                    2 * Math.PI * 70 *
                    (1 - (item.title === "RTO %" ? (totalOrders ? totalRto / totalOrders : 0) : item.value / 100))
                  }
                  transform="rotate(-90 75 75)"
                />

                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="500"
                >
                  {item.value}{item.title === "RTO %" ? "%" : ""}
                </text>
              </svg>
            </div>

            <div className="detail-open-wrapper">
              <div className={`detail-open-circle ${item.title === "RTO Orders" ? "rto" : item.title === "RTO %" ? "rto-order" : ""}`}></div>
              <span className="detail-open-text">Open</span>
            </div>

            <div className="detail-wrap">{item.footer}</div>
          </div>
        ))}
      </div>

    </div>
  );
}