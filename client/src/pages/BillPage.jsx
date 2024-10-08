import { Table, Button,Input, Space, Spin } from "antd";
import { FileExcelFilled,SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import React,{ useEffect, useState, useRef } from "react";
import PrintBill from "../components/bills/PrintBill";
import CheckOrder from "../components/bills/CheckOrder";
import Header from "../components/header/Header";
import { DownloadTableExcel } from "react-export-table-to-excel";
import {message} from "antd"


const BillPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isbillChecked, setIsbillChecked] = useState(false)
  const [billItems, setBillItems] = useState();
  const [customer, setCustomer] = useState();
  const tableRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    const getBills = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_SERVER_URL + "/bills/get-all");
        const data = await res.json();
        const reversed = data.reverse();
        //console.log('reversed', reversed)
        setBillItems(data);
      } catch (error) {
        console.log(error);
      }
    };
    const intervalId = setInterval(() => {
      getBills(); // Fetch bills every 10 seconds
    }, 10000);
  
    return () => clearInterval(intervalId);
    getBills();
  }, []);

  const MakeOrderSeen = async(id) => {
    try {
      fetch(process.env.REACT_APP_SERVER_URL +"/bills/update-bill", {
        method: "PUT",
        body: JSON.stringify({ _id : id , checked: true }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      message.success("Order Checked Successfully");
    } catch (error) {
      message.error("Something went wrong.");
      console.log(error);s
    }
  }
  // console.log(billItems);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showModal1 = () => {
    setIsbillChecked(true);
  };

  const columns = [
    {
      title: "Table Number",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps('customerName'),
    },
    {
      title: "Telephone Number",
      dataIndex: "customerPhoneNumber",
      key: "customerPhoneNumber",
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        return <span>{text.substring(0, 10)}</span>;
      },
    },
    {
      title: "Payment",
      dataIndex: "paymentMode",
      key: "paymentMode",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => {
        return <span>{text} &#2547;</span>;
      },
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Status",
      dataIndex: "checked",
      key: "checked",
      render: (checked , record) => {
        return (
          <span>
            {checked ? "Completed" : (
          <Button
            type="link"
            className="pl-0"
            onClick={() => {
              setIsbillChecked(true);
              setCustomer(record);
              MakeOrderSeen(record._id)
            }}
          >
            Check Order
          </Button>
        )}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Button
            type="link"
            className="pl-0"
            onClick={() => {
              setIsModalOpen(true);
              setCustomer(record);
            }}
          >
            Print Reciept
          </Button>
        );
      },
    },
  ];

  return (
    <>
    <Header/>
    <h1 className="text-4xl font-bold text-center mb-4">Order List</h1>
     {billItems ? (
       <div className="px-6">
      
         <div className="cursor-pointer">
           {" "}
           <DownloadTableExcel
             filename="users table"
             sheet="users"
             currentTableRef={tableRef.current}
           >
             <FileExcelFilled className="ml-2" />
             <span className="pl-2 ">Download in Excel</span>
           </DownloadTableExcel>
         </div>
         <Table
           ref={tableRef}
           name="user-table"
           dataSource={billItems}
           columns={columns}
           bordered
           scroll={{ x: 1000, y: 300 }}
           rowKey="_id"
         />
       </div>
     ): <Spin size="large" style={{
      width: '100%' 
    }} className=" absolute top-1/2 h-screen w-screen flex  justify-center" direction="vertical" />}

      <PrintBill
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        showModal={showModal}
        customer={customer}
      />

      <CheckOrder
        isModalOpen={isbillChecked}
        setIsModalOpen={setIsbillChecked}
        showModal={showModal1}
        customer={customer}
      />
    </>
  );
};

export default BillPage;
