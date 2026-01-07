import { Link } from "react-router-dom";
export default function Navbar() {

    return (
        <div className='checkout-navbar'>
            <div className="container">
                <div className="checkout-navbar-wrap">
                    <div>Menu</div>
                    <div>Logo</div>
                    <div><Link to='/login' target="_blank"><button>Log in</button></Link></div>
                </div>
            </div>
        </div>
    )
}
