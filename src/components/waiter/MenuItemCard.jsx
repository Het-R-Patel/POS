import React from "react";
import { Clock, Plus, Minus } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const MenuItemCard = ({ item, onAddToOrder, currentQuantity = 0 }) => {
  const handleIncrease = () => {
    onAddToOrder(item, currentQuantity + 1);
  };

  const handleDecrease = () => {
    if (currentQuantity > 0) {
      onAddToOrder(item, currentQuantity - 1);
    }
  };

  return (
    <Card padding="sm" className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between ">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>

          <p className="text-sm text-gray-500 mb-2">
            {/* {item.description.split(" ").slice(0, 3).join(" ")}
            {item.description.split(" ").length > 3 && "..."} */}
            {item.description}
          </p>
        </div>
        <div className="flex items-center flex-col">
          <Badge variant="default">{item.category.name}</Badge>
          <div className="flex items-center text-lg text-gray-500 mt-3 ">
            <Clock  size={20} className="mr-2" />
            {item.preparationTime}m
          </div>
        </div>
      </div>

      <div className=" items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-primary-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        {currentQuantity === 0 ? (
          <Button
            variant="primary"
            fullWidth={true}
            size="sm"
            className="mt-2"
            onClick={() => onAddToOrder(item, 1)}
          >
            Add
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-3 mt-2">
            <button
              onClick={handleDecrease}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="text-xl font-semibold text-gray-900 min-w-[2rem] text-center">
              {currentQuantity}
            </span>
            <button
              onClick={handleIncrease}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MenuItemCard;
