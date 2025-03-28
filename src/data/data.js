import Dosa from "../images/dosa.jpg";
import Chola from "../images/chhola.jpg";
import Idli from "../images/idli.jpg";
import MasalaDosa from "../images/masala.jpg";
import Paneer from "../images/paneer.jpg";
import Gujrati from "../images/gujrati.jpeg";
import CoffeeMug from "../images/coffee.jpg";
import Sandwich from "../images/sandwich.jpg";
import Samosa from "../images/samosa.jpg";
import ChickenBiryani from "../images/veg biryani.jpg";
import VegThali from "../images/veg thali.jpeg";
import PavBhaji from "../images/pav bhaji.jpg";
import AlooParatha from "../images/aloo paratha.jpg";
import FruitSalad from "../images/fruit salad.jpg";
import Lassi from "../images/lassi.jpg";
import ChocolateCake from "../images/chocolate cake.jpg";
import FrenchFries from "../images/fries.jpg";
import VegBurger from "../images/veg burger.jpg";
import Masalachai from "../images/masala chai.jpg";
import Vadasambar from "../images/vada sambar.jpg";

export const MenuList = [
  // South Indian Category - mapping to "Breakfast" and "Lunch"
  {
    name: "Dosa",
    description:
      "A crispy and savory South Indian pancake made from fermented rice and lentil batter.",
    image: Dosa,
    price: 60,
    category: "Breakfast",
  },
  {
    name: "Masala Dosa",
    description:
      "A popular South Indian dish consisting of a crispy dosa filled with a spiced potato mixture.",
    image: MasalaDosa,
    price: 80,
    category: "Breakfast",
  },
  {
    name: "Idli Sambhar",
    description:
      "Soft and fluffy steamed rice cakes served with a tangy lentil-based vegetable stew.",
    image: Idli,
    price: 40,
    category: "Breakfast",
  },
  {
    name: "Vada Sambhar",
    description:
      "Crispy, savory doughnut-shaped fritters made from lentils, served with sambhar and chutney.",
    image: Vadasambar, // Replace with actual Vada image
    price: 45,
    category: "Breakfast",
  },

  // North Indian Category - mapping to "Lunch"
  {
    name: "Chole Puri",
    description:
      "A flavorful North Indian dish made with spiced chickpeas served with deep-fried puffy bread.",
    image: Chola,
    price: 70,
    category: "Lunch",
  },
  {
    name: "Paneer Butter Masala",
    description:
      "A rich and creamy North Indian dish made with paneer (Indian cottage cheese) in a tomato-based gravy.",
    image: Paneer,
    price: 120,
    category: "Lunch",
  },
  {
    name: "Aloo Paratha",
    description:
      "Whole wheat flatbread stuffed with spiced mashed potatoes, served with yogurt and pickle.",
    image: AlooParatha,
    price: 50,
    category: "Breakfast",
  },
  {
    name: "Pav Bhaji",
    description:
      "A thick vegetable curry served with a soft bread roll, butter, and chopped onions.",
    image: PavBhaji,
    price: 70,
    category: "Fastfood",
  },

  // Thali/Meals Category - mapping to "Lunch"
  {
    name: "Gujarati Thali",
    description:
      "A traditional Gujarati meal consisting of various dishes like dal, kadhi, shaak, rotis, rice and dessert served on a single platter.",
    image: Gujrati,
    price: 150,
    category: "Lunch",
  },
  {
    name: "Veg Executive Thali",
    description:
      "A complete meal with rice, dal, 2 vegetables, 3 rotis, salad, papad, raita, and dessert.",
    image: VegThali,
    price: 180,
    category: "Lunch",
  },
  
  // Breakfast Category
  {
    name: "Sandwich",
    description:
      "Fresh vegetable sandwich with cucumber, tomato, onion and cheese between slices of bread spread with chutney and butter.",
    image: Sandwich,
    price: 40,
    category: "Breakfast",
  },
  {
    name: "Fruit Salad",
    description:
      "A refreshing mix of seasonal fruits like apple, banana, papaya, and grapes with a honey and lime dressing.",
    image: FruitSalad,
    price: 60,
    category: "Snacks",
  },

  // Snacks/Fast Food Category
  {
    name: "Samosa",
    description:
      "Deep-fried pastry filled with spiced potatoes and peas, served with mint and tamarind chutney.",
    image: Samosa,
    price: 20,
    category: "Snacks",
  },
  {
    name: "Veg Burger",
    description:
      "A delicious vegetable patty with fresh lettuce, tomato, onion and special sauce in a toasted bun.",
    image: VegBurger,
    price: 60,
    category: "Fastfood",
  },
  {
    name: "French Fries",
    description:
      "Crispy golden potato fries, lightly salted and perfect for snacking, served with tomato ketchup.",
    image: FrenchFries,
    price: 50,
    category: "Fastfood",
  },

  // Main Course Category - mapping to "Lunch"
  {
    name: "Veg Biryani",
    description:
      "Fragrant basmati rice cooked with mixed vegetables, aromatic herbs and special biryani spices, served with raita.",
    image: ChickenBiryani,
    price: 120,
    category: "Lunch",
  },
  
  // Desserts Category
  {
    name: "Chocolate Cake",
    description:
      "Rich, moist chocolate cake with creamy chocolate frosting, perfect for satisfying your sweet cravings.",
    image: ChocolateCake,
    price: 60,
    category: "Desserts",
  },
  
  // Beverages Category - mapping to appropriate categories
  {
    name: "Masala Chai",
    description:
      "Traditional Indian spiced tea with milk, cardamom, cinnamon, and ginger - perfect for any time of day.",
    image: Masalachai, // Replace with actual Chai image
    price: 20,
    category: "Breakfast",
  },
  {
    name: "Mango Lassi",
    description:
      "A refreshing yogurt-based drink with sweet mango pulp and a hint of cardamom, garnished with mint.",
    image: Lassi,
    price: 45,
    category: "Desserts",
  },
  {
    name: "Filter Coffee",
    description:
      "South Indian style coffee brewed with a metal filter, mixed with hot milk and served frothy.",
    image: CoffeeMug,
    price: 30,
    category: "Breakfast",
  }
];