import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Input, message } from "antd";
import {
  SearchOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  CopyOutlined,
  UserOutlined,
  BarChartOutlined,
  LogoutOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import "./index.css";
import { useState, useEffect } from "react";
import { useRef } from "react";


const Header = ({ setSearch }) => {
  const cart = useSelector((state) => state.cart);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const logOut = () => {
    if (window.confirm("Are You sure You want to Logout?")) {
      localStorage.removeItem("posUser");
      navigate("/login");
      message.success("Logged Out Successfully.");
    }
  };

  const audioRef = useRef(new Audio('sounds/notification.mp3'));

  const [orders, setorders] = useState([])


  useEffect(() => {
    const getBills = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/bills/get-all");
        const data = await res.json();
        const reversed = data.reverse();
        //console.log('reversed', reversed)
        const ActiveOrders = data.filter((x)=>x.checked === false)
        setorders(ActiveOrders);
        console.log(ActiveOrders)
      } catch (error) {
        console.log(error);
      }
    };
    const intervalId = setInterval(() => {
      getBills(); // Fetch bills every 10 seconds
    }, 10000);
  
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [orders]);

  console.log('orders', orders)
  return (
    <div className="border-b mb-6">
      <header className="py-4 px-6 flex justify-between items-center gap-10">
        <div className="logo">
          <Link to="/">
            <h2 className="text-2xl font-bold md:text-4xl">POSitive</h2>
          </Link>
        </div>
        <div
          className="header-search flex-1 flex justify-center"
          onClick={() => {
            pathname !== "/" && navigate("/");
          }}
        >
          <Input
            size="large"
            placeholder="Search Items ... "
            prefix={<SearchOutlined />}
            className="rounded-full max-w-[800px]"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />
        </div>
        <div className="menu-links">
          <Link to={"/"} className={`menu-link ${
            pathname === "/" && "active"

          }`}>
            <HomeOutlined className="md:text-2xl text-xl" />
            <span className="md:text-xs text-[10px]">Home</span>
          </Link>
          <Badge
            count={cart.cartItems.length}
            offset={[0, 0]}
            className="md:flex hidden"
          >
            <Link to={"/cart"} className={`menu-link ${
              pathname === "/cart" && "active"

            }`}>
              <ShoppingCartOutlined className="md:text-2xl text-xl" />
              <span className="md:text-xs text-[10px]">Cart</span>
            </Link>
          </Badge>
          <Badge
          count={orders.length}
          offset={[0, 0]}
          className="md:flex hidden"
          >
          <Link to={"/bills"} className={`menu-link ${
            pathname === "/bills" && "active"

          }`}>
            <CopyOutlined className="md:text-2xl text-xl" />
            <span className="md:text-xs text-[10px]">Orders</span>
          </Link>
          </Badge>
          <Link to={"/customers"} className={`menu-link ${
            pathname === "/customers" && "active"

          }`}>
            <UserOutlined className="md:text-2xl text-xl" />
            <span className="md:text-xs text-[10px]">Customers</span>
          </Link>
          <Link to={"/statistic"} className={`menu-link ${
            pathname === "/statistic" && "active"

          }`}>
            <BarChartOutlined className="md:text-2xl text-xl" />
            <span className="md:text-xs text-[10px]">Statistics</span>
          </Link>
          <Link to={"/tables"} className={`menu-link ${
            pathname === "/tables" && "active"

          }`}>
            <TableOutlined className="md:text-2xl text-xl" />
            <span className="md:text-xs text-[10px]">Tables</span>
          </Link>
          <div onClick={logOut}>
            <Link className="menu-link">
              <LogoutOutlined className="md:text-2xl text-xl" />
              <span className="md:text-xs text-[10px]">Logout</span>
            </Link>
          </div>
        </div>
        <Badge
          count={cart.cartItems.length}
          offset={[0, 0]}
          className="md:hidden flex"
        >
          <Link to={"/"} className={`menu-link ${
            pathname === "/cart" && "active"

          }`}>
            <ShoppingCartOutlined className="text-2xl" />
            <span className="md:text-xs text-[10px]">Cart</span>
          </Link>
        </Badge>
      </header>
    </div>
  );
};

export default Header;