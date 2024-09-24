import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import Add from "./Add.jsx";
import Edit from "./Edit.jsx";
import "./style.css";

const Categories = ({ categories, setCategories, setFiltered, products, setProducts }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("Tümü");

  useEffect(() => {
    if (categoryTitle === "Tümü") {
      setFiltered(products)
    } else {
      setFiltered(products?.filter((item) => item.category === categoryTitle))
    }

  }, [products, setFiltered, categoryTitle])


  return (
    <ul className="products-wrapper grid grid-cols-card gap-4">
      <li
        className="category-item border hover:shadow-lg cursor-pointer transition-all select-none bg-purple-800 flex justify-center items-center hover:opacity-90 min-h-[180px]"
        onClick={() => setIsAddModalOpen(true)}
      >
        <PlusOutlined className="md:text-2xl" />
      </li>
      <li
        className="category-item !bg-orange-800 hover:opacity-90"
        onClick={() => setIsEditModalOpen(true)}
      >
        <EditOutlined className="md:text-2xl" />
      </li>
      <li
        className="category-item !bg-green-700 hover:opacity-90"
        onClick={() => setCategoryTitle("Tümü")}
      >
        <p className="md:text-2xl">All</p>
      </li>
      <Add
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        categories={categories}
        setCategories={setCategories}
      />
      <Edit setIsEditModalOpen={setIsEditModalOpen} isEditModalOpen={isEditModalOpen} categories={categories}
        setCategories={setCategories} />
      
      {categories?.map((category, _id) => (
        <li className={`category-item ${category.title === categoryTitle ? ' !bg-pink-700' : 'bg-green-700'}`} key={category._id} onClick={() => setCategoryTitle(category.title)}>
          <span>{category.title}</span>
        </li>
      ))}
    </ul>
  );
};

export default Categories;
