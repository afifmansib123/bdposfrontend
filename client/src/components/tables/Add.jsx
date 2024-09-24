import React from "react";
import { Button, Form, Input, Modal, message } from "antd";

import "./style.css";

const Add = ({ isAddModalOpen, setIsAddModalOpen, tables, setTables }) => {
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        console.log(values)
        try {
            fetch(process.env.REACT_APP_SERVER_URL + "/tables/add-tables", {
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-type": "application/json; charset=UTF-8" },
            });
            message.success(`${values.tableNumber} successfully Added.`);
            form.resetFields();
            setTables([...tables, {
                _id: Math.random(),
                tableNumber: values.tableNumber
            }])
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Modal
                title="Add new Table"
                open={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                footer={false}
            >
                <Form layout="vertical" onFinish={onFinish} form={form}>
                    <Form.Item
                        name="tableNumber"
                        label="Add Table Number"
                        rules={[
                            { required: true, message: "Table number Cannot be empty!" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item className="flex justify-end mb-0">
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Add