import React, { useEffect, useState } from "react";
import Header from "../components/header/Header.jsx";
import StatisticCard from "../components/statistics/StaticticCard";
import { Area, Pie } from "@ant-design/plots";
import { Spin } from "antd";

const StatisticPage = () => {
  const [data, setData] = useState();
  const [products, setProducts] = useState();
  const user = JSON.parse(localStorage.getItem("posUser"));

  useEffect(() => {
    asyncFetch();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/products/get-all");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
  }, []);


  const asyncFetch = () => {
    fetch(process.env.REACT_APP_SERVER_URL + "/bills/get-all")
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };

  // Transform data to group by item title and aggregate sales
  const transformDataByTitle = () => {
    if (!data) return [];
    const titleMap = {};

    data.forEach((bill) => {
      bill.cartItems.forEach((item) => {
        if (!titleMap[item.title]) {
          titleMap[item.title] = 0;
        }
        titleMap[item.title] += item.price * item.quantity; // Aggregating sales based on item price and quantity
      });
    });

    return Object.keys(titleMap).map((title) => ({
      title: title,
      totalSales: titleMap[title],
    }));
  };

  const transformedData = transformDataByTitle();

  const config = {
    data: transformedData,
    xField: "title",
    yField: "totalSales",
    xAxis: {
      range: [0, 1],
    },
  };

  const config2 = {
    appendPadding: 10,
    data: transformedData,
    angleField: "totalSales",
    colorField: "title",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "Total Value",
      },
    },
  };

  const totalAmount = () => {
    const amount = data.reduce((total, bill) => bill.totalAmount + total, 0);
    return `${amount.toFixed(2)} ৳`;
  };

  return (
    <div>
      <Header />
      <h1 className="text-4xl font-bold text-center mb-4">Sales Statistics</h1>
      {data && products ? (
        <div className="px-6 md:pb-0 pb-20">
          <div className="statistic-section">
            <h2 className="text-lg">
              Welcome{" "}
              <span className="text-green-700 font-bold text-xl">
                {user.username}
              </span>
              .
            </h2>
            <div className="statistic-cards grid xl:grid-cols-4 md:grid-cols-2 my-10 md:gap-10 gap-4">
              <StatisticCard
                title={"Total Customers"}
                amount={data?.length}
                img={"images/user.png"}
              />
              <StatisticCard
                title={"Total Sales"}
                amount={totalAmount()}
                img={"images/money.png"}
              />
              <StatisticCard
                title={"Total Orders"}
                amount={data?.length}
                img={"images/sale.png"}
              />
              <StatisticCard
                title={"Total Items"}
                amount={products?.length}
                img={"images/product.png"}
              />
            </div>
            <div className="flex justify-between gap-10 lg:flex-row flex-col items-center">
              <div className="lg:w-1/2 lg:h-80 h8h-80">
                <Area {...config} />
              </div>
              <div className="lg:w-1/2 lg:h-80 h-72">
                <Pie {...config2} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Spin
          size="large"
          style={{
            width: "100%",
          }}
          className=" absolute top-1/2 h-screen w-screen flex  justify-center"
          direction="vertical"
        />
      )}
    </div>
  );
};

export default StatisticPage;
