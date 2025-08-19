import React, { useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Printer } from "lucide-react"; // Removed Plus icon import

interface AddOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
}

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
}

const AddOrder: React.FC<AddOrderProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedProduct, setSelectedProduct] = useState("Meals");
  const [quantity, setQuantity] = useState("");
  // Initialize salesFromDate to today and salesToDate to today + 2 days for a sensible default
  const [salesFromDate, setSalesFromDate] = useState(new Date());
  const [salesToDate, setSalesToDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today;
  });

  // Initial ingredients list - consider making this empty or fetching from a source
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "01", name: "Ingredient01", quantity: "2kg" },
    { id: "02", name: "Ingredient01", quantity: "3kg" },
    { id: "03", name: "Ingredient01", quantity: "2g" },
    { id: "04", name: "Ingredient01", quantity: "4kg" },
    { id: "05", name: "Ingredient01", quantity: "2kg" },
    { id: "06", name: "Ingredient01", quantity: "1g" },
    { id: "07", name: "Ingredient01", quantity: "2kg" },
    { id: "08", name: "Ingredient01", quantity: "2g" },
  ]);

  const [totalIngredients, setTotalIngredients] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  // Use a ref to keep track of the next ingredient ID
  // Initialize based on current ingredients length + 1
  const nextIngredientId = useRef(ingredients.length > 0 ? parseInt(ingredients[ingredients.length - 1].id) + 1 : 1);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    // getDay() returns 0 for Sunday, 1 for Monday, etc.
    // We want Monday to be 0 for our calendar grid (Mo, Tu, We, Th, Fr, Sa, Su)
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  };

  const navigateMonth = (date: Date, direction: 'prev' | 'next') => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    return newDate;
  };

  const selectDate = (day: number, isFromDate: boolean) => {
    const targetDate = isFromDate ? salesFromDate : salesToDate;
    const newDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), day);

    if (isFromDate) {
      setSalesFromDate(newDate);
    } else {
      setSalesToDate(newDate);
    }
  };

  const renderCalendar = (date: Date, isFromDate: boolean) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days = [];

    // Empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${date.getMonth()}-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = (isFromDate ? salesFromDate : salesToDate).getDate() === day &&
                         (isFromDate ? salesFromDate : salesToDate).getMonth() === date.getMonth() &&
                         (isFromDate ? salesFromDate : salesToDate).getFullYear() === date.getFullYear();
      days.push(
        <button
          key={`day-${date.getMonth()}-${day}`}
          onClick={() => selectDate(day, isFromDate)}
          className={`h-8 w-8 rounded-full text-sm font-medium flex items-center justify-center ${
            isSelected
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {day.toString().padStart(2, '0')}
        </button>
      );
    }

    return days;
  };

  // Handler to add a new ingredient to the list (logic remains, but button removed from UI)
  const handleAddIngredient = () => {
    if (selectedProduct.trim() && quantity.trim()) {
      const newIngredient: Ingredient = {
        id: (nextIngredientId.current++).toString().padStart(2, '0'),
        name: selectedProduct,
        quantity: quantity.trim(),
      };
      setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
      // Reset form fields after successful addition
      setSelectedProduct("Meals"); // Reset to default or empty string if preferred
      setQuantity("");
    } else {
      alert("Please select an ingredient name and enter a quantity to add an ingredient.");
    }
  };

  const handleSubmit = () => {
    const orderData = {
      product: "Order Product (e.g., from a separate input or implied)", // Placeholder
      quantity: "Order Quantity (e.g., from a separate input or implied)", // Placeholder
      salesFromDate: salesFromDate.toISOString().split('T')[0], // Format date for submission
      salesToDate: salesToDate.toISOString().split('T')[0],   // Format date for submission
      ingredients, // Array of ingredients added to the order
      totalIngredients, // This would ideally be calculated from 'ingredients'
      totalAmount, // This would ideally be calculated
    };
    onSubmit(orderData);
    // onClose(); // Consider if you want to close the modal automatically on submit
  };

  const handleIngredientChange = (id: string, field: 'name' | 'quantity', value: string) => {
    setIngredients(ingredients.map(ingredient =>
      ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
    ));
  };

  // Function to remove an ingredient (logic remains, but button removed from UI)
  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Add new</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Top Row - Ingredient Name and Quantity */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Ingredient Name Selection */}
            <div>
              <label htmlFor="ingredient-name" className="block text-sm font-medium text-blue-600 mb-2">
                Ingredient Name
              </label>
              <select
                id="ingredient-name"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="Meals">Meals</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks">Snacks</option>
                <option value="Ingredient A">Ingredient A</option>
                <option value="Ingredient B">Ingredient B</option>
                <option value="Ingredient C">Ingredient C</option>
              </select>
            </div>

            {/* Quantity - Removed Add Button */}
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <label htmlFor="quantity" className="block text-sm font-medium text-blue-600 mb-2">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., 2kg, 500g"
               h />
              </div>
              {/* Removed: Add Ingredient Button */}
              {/*
              <button
                onClick={handleAddIngredient}
                className="p-2 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 flex items-center justify-center h-[42px] border border-green-600 transition-colors"
                title="Add Ingredient"
              >
                <Plus size={20} />
              </button>
              */}
            </div>
          </div>

          {/* Sales Date Range - Side by Side */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Sales From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales from
              </label>
              <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {monthNames[salesFromDate.getMonth()]} {salesFromDate.getFullYear()}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSalesFromDate(navigateMonth(salesFromDate, 'prev'))}
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => setSalesFromDate(navigateMonth(salesFromDate, 'next'))}
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                  <div className="font-medium text-blue-600">Mo</div>
                  <div className="font-medium text-blue-600">Tu</div>
                  <div className="font-medium text-blue-600">We</div>
                  <div className="font-medium text-blue-600">Th</div>
                  <div className="font-medium text-blue-600">Fr</div>
                  <div className="font-medium text-blue-600">Sa</div>
                  <div className="font-medium text-blue-600">Su</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {renderCalendar(salesFromDate, true)}
                </div>
              </div>
            </div>

            {/* Sales To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales to
              </label>
              <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {monthNames[salesToDate.getMonth()]} {salesToDate.getFullYear()}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSalesToDate(navigateMonth(salesToDate, 'prev'))}
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => setSalesToDate(navigateMonth(salesToDate, 'next'))}
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-center mb-2">
                  <div className="font-medium text-blue-600">Mo</div>
                  <div className="font-medium text-blue-600">Tu</div>
                  <div className="font-medium text-blue-600">We</div>
                  <div className="font-medium text-blue-600">Th</div>
                  <div className="font-medium text-blue-600">Fr</div>
                  <div className="font-medium text-blue-600">Sa</div>
                  <div className="font-medium text-blue-600">Su</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs">
                  {renderCalendar(salesToDate, false)}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-blue-600">Ingredients</h3>
              <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700" title="Print Ingredients">
                <Printer size={16} />
              </button>
            </div>

            {/* Ingredients Table */}
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 w-16">No.</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-600">Ingredients</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 w-24">Quantity</th>
                    {/* Removed: Action column header
                    <th className="px-4 py-2 text-left text-xs font-medium text-blue-600 w-16">Action</th>
                    */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {ingredients.length > 0 ? (
                    ingredients.map((ingredient, index) => (
                      <tr key={ingredient.id}>
                        <td className="px-4 py-2 text-xs text-gray-900 font-medium">{index + 1}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)}
                            className="w-full p-1 text-xs border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientChange(ingredient.id, 'quantity', e.target.value)}
                            className="w-full p-1 text-xs border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                          />
                        </td>
                        {/* Removed: Action column content (X button)
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleRemoveIngredient(ingredient.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                            title="Remove ingredient"
                          >
                            <X size={14} />
                          </button>
                        </td>
                        */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-gray-500"> {/* colspan changed from 4 to 3 */}
                        No ingredients added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Row - Total Ingredients */}
          <div className="grid grid-cols-2 gap-6">
            {/* Total Ingredients */}
            <div>
              <label htmlFor="total-ingredients" className="block text-sm font-medium text-blue-600 mb-2">
                Total Ingredients
              </label>
              <input
                id="total-ingredients"
                type="text"
                value={totalIngredients} // This should ideally be calculated from the ingredients array
                onChange={(e) => setTotalIngredients(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                placeholder="Calculated total (e.g., 8 items)"
                readOnly // Often, totals are read-only
              />
            </div>

            {/* Total Ingredients Amount */}
            <div>
              <label htmlFor="total-amount" className="block text-sm font-medium text-blue-600 mb-2">
                Total Ingredients amount
              </label>
              <input
                id="total-amount"
                type="text"
                value={totalAmount} // This should ideally be calculated based on ingredient quantities and prices
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                placeholder="Calculated amount (e.g., $150.00)"
                readOnly // Often, totals are read-only
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;