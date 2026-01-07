import whiteMethods from '../../../../images/white-Methods.webp';
import card from '../../../../images/card.png';

export default function SettingMethod({ paymentData }) {
  const maskedCardNumber = paymentData?.card_number
    ? `**** **** **** ${paymentData.card_number}`
    : '**** **** **** ****';

  const cardHolder = paymentData?.card_name || 'User';
  const expiry = paymentData?.expiry
    ? (() => {
      const [month, year] = paymentData.expiry.split('/');
      const paddedMonth = month.padStart(2, '0');
      const shortYear = year.slice(-2);
      return `${paddedMonth}/${shortYear}`;
    })()
    : '--/--';

  return (
    <div className="checkout-setting-wrp">
      <div className="checkout-setting-navgate">
        <p><span>Settings/</span>Payment Methods</p>
      </div>
      <div className="checkout-setting-webp">
        <div className="checkout-img active account">
          <img src={whiteMethods} alt="" />
        </div>
        <div className="setting-title">
          <p>Payment Methods</p>
        </div>
      </div>
      <div className="payment-card-details">
        <img src={card} alt="Card" />
        <div className="payment-card-overlay">
          <div className="payment-card-csv">{maskedCardNumber}</div>
          <div className="payment-card-info">
            <div>
              <div className="payment-card-holder">Card Holder</div>
              <div className="payment-card-holder">{cardHolder}</div>
            </div>
            <div className='payment-card-expires'>
              <div className="payment-card-holder">Expires</div>
              <div className="payment-card-holder">{expiry}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



