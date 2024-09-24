import React, { useState, useEffect } from "react";
import Header from "../components/header/Header";
import Tables from "../components/tables/Tables";
import { Spin } from 'antd';

const HomePage = () => {
  return (
    <>
      <Header />
      <Tables/>
    </>
  );
};

export default HomePage;
