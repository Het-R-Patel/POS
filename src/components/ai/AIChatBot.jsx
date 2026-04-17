import { useState, useRef, useEffect } from 'react';
import { Bot, X, Mic, Send, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCurrentOrder } from '../../store/features/order/orderSlice';
import { selectCurrentOrderTableId, selectCurrentOrderTableNumber, selectCurrentOrderItems } from '../../store/features/order/orderSelectors';
import { sendChatMessage } from '../../api/aiApi';import { fetchMenuItemById } from '../../api/menuitemsApi';import { useNotifications } from '../../context/NotificationContext';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi there! I can help you place orders via text or voice. What would you like today?',
      isInitial: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { addNotification } = useNotifications();
  
  const currentTableId = useSelector(selectCurrentOrderTableId);
  const currentTableNumber = useSelector(selectCurrentOrderTableNumber);
  const currentOrderItems = useSelector(selectCurrentOrderItems);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMsg);
      
      const responseData = response.data || response;
      let botMessage = responseData.botMessage || 'I processed that for you.';
      const orderAction = responseData.orderAction;
      const extractedItems = responseData.extractedItems || [];
      
      let addedItemsText = null;

      // Extract details and add to Redux cart if correct action is received
      if (orderAction === 'add_to_cart' && extractedItems.length > 0) {
        let totalVal = 0;
        const actuallyAddedItems = [];

        // Verify and fetch authentic item details from the DB before adding
        const validationPromises = extractedItems.map(async (item) => {
          // Check if the item already exists in the cart to avoid duplicates
          const existInCart = currentOrderItems.some(ci => ci.menuItem._id === item.menuItemId);
          
          if (!existInCart) {
            try {
              // Get the actual entity from the backend to ensure accurate price/data
              const verifiedItem = await fetchMenuItemById(item.menuItemId);
              const price = verifiedItem?.price ?? item.unitPrice ?? 0;
              const name = verifiedItem?.name ?? item.name;

              return {
                _id: verifiedItem?._id || item.menuItemId,
                name: name,
                price: price,
                quantity: item.quantity,
                specialRequests: item.specialRequests,
                // keep Full structure of the fetched item optionally:
                ...verifiedItem
              };
            } catch (err) {
              console.warn("Could not verify item from backend:", item.menuItemId);
              return null; // Skip adding if it doesn't exist to prevent errors
            }
          }
          return null; // skip if already exists in cart
        });

        const validatedItems = (await Promise.all(validationPromises)).filter(v => v !== null);

        validatedItems.forEach(item => {
          totalVal += item.price * item.quantity;
          
          dispatch(addItemToCurrentOrder({
            menuItem: item, // Full verified item object
            quantity: item.quantity,
            specialInstructions: item.specialRequests
          }));
          
          actuallyAddedItems.push(item);
        });
        
        if (actuallyAddedItems.length > 0) {
          addedItemsText = {
            items: actuallyAddedItems,
            total: totalVal.toFixed(2)
          };
        } else {
          // All suggested items were already in the cart, skip rendering "added" UI
          botMessage += " (It looks like those items are already in your cart!)";
        }
      }

      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: botMessage,
        addedItems: addedItemsText
      }]);
      
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Bot Error',
        message: error.message || 'Failed to process your request'
      });
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'Sorry, I hit a snag talking to the kitchen. Please try again!',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Only show the bot if a table is selected (Order Edit/Summary flow)
  if (!currentTableId && !currentTableNumber) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-[9999]"
      >
        <Bot className="h-7 w-7" />
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] flex flex-col overflow-hidden" 
      style={{ height: '500px' }}
    >
      {/* Header */}
      <div className="bg-primary-500 p-4 flex items-center justify-between text-white shadow-sm z-10">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-white" />
          <h3 className="font-bold text-lg">AI Assistant</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-primary-100 hover:text-white transition-colors p-1 rounded-md hover:bg-primary-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Area Layout (Mockup) */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'space-x-2'}`}>
            {msg.role === 'bot' && (
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-primary-600" />
              </div>
            )}
            
            <div className={`${
              msg.role === 'user' 
                ? 'bg-primary-50 p-3 rounded-2xl rounded-tr-sm border border-primary-100 shadow-sm max-w-[85%] text-gray-800' 
                : 'bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm max-w-[85%] text-gray-700'
            } text-sm ${msg.isError ? 'text-red-500 border-red-200 bg-red-50' : ''}`}>
              <p>{msg.text}</p>
              
              {/* Added items preview UI */}
              {msg.addedItems && (
                <div className="mt-3 bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Items added to cart</span>
                    <span>${msg.addedItems.total}</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    {msg.addedItems.items.map((item, i) => (
                      <div key={i}>
                        • {item.quantity}x {item.name}
                        {item.specialRequests && <div className="ml-2 italic text-[10px]">- {item.specialRequests}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-4 w-4 text-primary-600" />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm self-start flex space-x-1 items-center">
              <Loader2 className="h-4 w-4 text-primary-500 animate-spin" />
              <span className="text-xs text-gray-400">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200 flex flex-col space-y-3 relative">
        <div className="flex items-center justify-center -mt-8 relative z-20">
          {/* Voice Input Button */}
          <button className="flex items-center justify-center h-14 w-14 rounded-full bg-white text-gray-600 border border-gray-200 hover:text-red-500 hover:border-red-500 shadow-lg transition-all group">
            <Mic className="h-6 w-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <input 
            type="text" 
            placeholder="Type your order..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-gray-50 focus:bg-white transition-colors disabled:opacity-50"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="h-9 w-9 bg-primary-500 text-white rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
