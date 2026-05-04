import axios from 'axios';

const runTest = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/quotes', {
      name: "Test",
      phone: "12345",
      city: "Test City",
      notes: "Test Notes",
      items: [{
        productId: "60c72b2f9b1d8b001c8e4a9d",
        name: "Test Product",
        quantity: 1,
        price: 100
      }],
      totalEstimatedPrice: 100
    });
    console.log("Success:", res.data);
  } catch (error) {
    console.error("Error response:", error.response?.data);
    console.error("Error message:", error.message);
  }
};

runTest();
