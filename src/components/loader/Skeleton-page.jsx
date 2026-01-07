const SkeletonPage = () => {
  return (
    <>
      <style>{`
        .skeleton-page {
          background: #f9fafb;
          min-height: 100vh;
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .skeleton-top-bar {
          width: 80px;
          height: 20px;
          background: #e3e6ea;
          border-radius: 4px;
          margin-bottom: 30px;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-main {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 30px;
          width: 100%;
          max-width: 1200px;
        }

        .skeleton-left,
        .skeleton-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .skeleton-card {
          background: #fff;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .skeleton-line {
          height: 12px;
          background: #e3e6ea;
          border-radius: 4px;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-line.short { width: 60%; }
        .skeleton-line.small { width: 50%; }
        .skeleton-line.smaller { width: 40%; }
        .skeleton-line.long { width: 90%; }

        .skeleton-image {
          width: 50px;
          height: 50px;
          background: #e3e6ea;
          border-radius: 6px;
          margin-bottom: 15px;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-footer {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .skeleton-box {
          height: 30px;
          flex: 1;
          background: #e3e6ea;
          border-radius: 6px;
          animation: shimmer 1.5s infinite linear;
        }

        .skeleton-box.large { flex: 3; }
        .skeleton-box.small { flex: 1; }

        @keyframes shimmer {
          0% { background-color: #e3e6ea; }
          50% { background-color: #f0f2f5; }
          100% { background-color: #e3e6ea; }
        }

        @media (max-width: 900px) {
          .skeleton-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="skeleton-page">
        <div className="skeleton-top-bar"></div>

        <div className="skeleton-main">
          <div className="skeleton-left">
            <div className="skeleton-card">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>

            <div className="skeleton-card">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line small"></div>
              <div className="skeleton-footer">
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-box"></div>
              </div>
            </div>
          </div>

          <div className="skeleton-right">
            <div className="skeleton-card big">
              <div className="skeleton-image"></div>
              <div className="skeleton-line short"></div>
              <div className="skeleton-line smaller"></div>
              <div className="skeleton-line small"></div>
              <div className="skeleton-line long"></div>
              <div className="skeleton-footer">
                <div className="skeleton-box large"></div>
                <div className="skeleton-box small"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SkeletonPage;