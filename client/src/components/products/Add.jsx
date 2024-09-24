import { Button, Form, Input, Modal, message, Select } from "antd";
import React from "react";
import "./style.css";
import axios from "axios";
import { useState } from "react";

const Add = ({
  isAddModalOpen,
  setIsAddModalOpen,
  products,
  setProducts,
  categories,
}) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {

    const updatedvalues = {
      ...values,
      img : imageUrl,
    }

    try {
      fetch(process.env.REACT_APP_SERVER_URL + "/products/add-product", {
        method: "POST",
        body: JSON.stringify(updatedvalues),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
      message.success(`${values.title} Product Added Successfully.`);
      form.resetFields();
      setProducts([
        ...products,
        { ...values, _id: Math.random(), price: Number(values.price), title: values.title },
      ]);
      setIsAddModalOpen(false)
      setImageUrl('')
    } catch (error) {
      console.log(error);
    }
  };


  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const uploadImage = async (file) => {
    const url = `https://api.cloudinary.com/v1_1/dr7d6bngx/upload`;

    try {
      setLoading(true);
      const { data: { signature, timestamp } } = await axios('https://back-end-test-tau.vercel.app/api/cloudinary-sign');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', 354453251215682);

      const { data } = await axios.post(url, formData);
      setImageUrl(data.secure_url);
      setLoading(false);
      setError('');
    } catch (err) {
      setLoading(false);
      setError('Upload failed: ' + err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  return (
    <>
      <Modal
        title="Add New Product"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="title"
            label="Product Name"
            rules={[{ required: true, message: "Product name cannot be empty!" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            name="img"
            label="Product Image"
            rules={[
              { required: false, message: "Product image field cannot be empty!" },
            ]}
          >
            <Input placeholder="Enter product image URL"
              type="file"
              onChange={handleFileChange}
              className="mb-4"
            />
            {loading && <div>Uploading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {imageUrl && (
              <div>
                <h2 className="text-md font-semibold mb-2">Uploaded Image URL:</h2>
                <input
                  type="text"
                  value={imageUrl}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            )}
          </Form.Item>
          <Form.Item
            name="price"
            label="Product price"
            rules={[
              { required: true, message: "Product price field cannot be empty!" },
            ]}
          >
            <Input placeholder="Enter product price" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Select a category"
            rules={[
              { required: true, message: "Category field cannot be empty!" },
            ]}
          >
            <Select
              showSearch
              placeholder="Select a category"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.title ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.title ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.title ?? "").toLocaleLowerCase())
              }
              options={categories}
            />
          </Form.Item>
          <Form.Item className="flex justify-end mb-0">
            <Button type="primary" htmlType="submit">
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Add;
