import React, { useEffect, useState } from "react";
import { PlusOutlined, TableOutlined, DeleteOutlined } from "@ant-design/icons";
import { message } from "antd";
import QrModal from "./QrModal";
import Add from "./Add";

export default function Tables() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [tables, setTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState(null);

    useEffect(() => {
        const getTables = async () => {
            const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/tables/get-all`);
            const data = await res.json();
            setTables(data.map(item => ({ ...item, value: item.tableNumber })));
        };
        getTables();
    }, []);

    const deleteTable = async (tableId) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/tables/del-table/${tableId}`, {
                    method: 'DELETE',
                });
                if (res.ok) {
                    setTables(tables.filter(table => table._id !== tableId));
                    message.success(`Table Deleted successfully`);
                } else {
                    console.log("Failed to delete table");
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <>
            <div className="home px-6 flex md:flex-col flex-col justify-between gap-10 md:pb-0 pb-24">
                <span className="font-bold inline-block text-center mb-5">Table Management</span>
                <ul className="products-wrapper grid grid-cols-card gap-4">
                    <li
                        className="product-item border hover:shadow-lg cursor-pointer transition-all select-none bg-blue-600 flex justify-center items-center hover:opacity-90 min-h-[180px] rounded-lg"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <PlusOutlined className="md:text-2xl" />
                    </li>

                    <Add
                        isAddModalOpen={isAddModalOpen}
                        setIsAddModalOpen={setIsAddModalOpen}
                        tables={tables}
                        setTables={setTables}
                    />
                    {tables.map((x) => (
                        <li
                            className="table-item bg-blue-400"
                            key={x._id}
                        >
                            <div className="!bg-blue-400 hover:bg-blue-800 min-w-[145px] min-h-[180px] grid grid-rows-3 grid-cols-1 gap-2">
                                <div className="flex items-center justify-center">
                                    <TableOutlined className="md:text-2xl text-xl mr-2" />
                                    <span style={{color:"white"}}>Table No {x.tableNumber}</span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button
                                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-green-400 group-hover:to-green-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                                        onClick={() => {
                                            setSelectedTableId(x.tableNumber);
                                            setIsQrModalOpen(true);
                                        }}
                                    >
                                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            Generate QR
                                        </span>
                                    </button>
                                </div>
                                <div className="flex items-center justify-center">
                                    <button
                                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-green-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 ml-2"
                                        onClick={() => deleteTable(x._id)}
                                    >
                                        <DeleteOutlined className="md:text-2xl text-xl" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <QrModal
                    isAddModalOpen={isQrModalOpen}
                    setIsAddModalOpen={setIsQrModalOpen}
                    tableId={selectedTableId}
                />
            </div>
        </>
    );
}
