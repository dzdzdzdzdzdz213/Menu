import React from 'react';
import FoodCard from '../components/FoodCard';
import './Home.css';

const HERITAGE_FOODS = [
  {
    id: 11,
    name: "Royal Honey Baklava",
    brand: "Sultans Treats",
    price: 4500,
    ingredients: ["Premium Pistachio", "Wild Honey", "Crisp Filo", "Rose Water"],
    specs: "Large Box • 800g",
    imageUrl: "/mock/baklava.png",
    rating: "4.9"
  },
  {
    id: 12,
    name: "Classic Makroud",
    brand: "Algerian Patisserie",
    price: 800,
    ingredients: ["Semolina", "Date Paste", "Honey Syrup", "Orange Blossom"],
    specs: "Box of 10",
    imageUrl: "/mock/pizza.png", // Reusing image due to limited mocks
    rating: "4.8"
  },
  {
    id: 13,
    name: "Pistachio Kunafa",
    brand: "Levantine Heritage",
    price: 1500,
    ingredients: ["Fresh Cheese", "Crispy Dough", "Pistachio Crumble", "Syrup"],
    specs: "2 Person Portion",
    imageUrl: "/mock/interior.png", // Reusing
    rating: "5.0"
  }
];

const Heritage = () => {
  return (
    <div className="home-page container">
      <section className="hero-section glass" style={{ minHeight: '300px' }}>
        <div className="hero-content">
          <h2 className="title-lg">Traditional <span className="text-red">Heritage</span></h2>
          <p className="hero-subtitle text-muted">
            The finest selection of classical Middle Eastern & North African sweets, meticulously curated.
          </p>
        </div>
      </section>

      <section className="main-content">
         <div className="bento-grid">
          {HERITAGE_FOODS.map(food => (
            <FoodCard key={food.id} item={food} />
          ))}
        </div>
      </section>
      
      <div className="mobile-nav-spacer"></div>
    </div>
  );
}

export default Heritage;
