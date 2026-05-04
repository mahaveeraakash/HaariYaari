import Quote from '../models/Quote.js';

export const createQuote = async (req, res) => {
  try {
    const quote = new Quote(req.body);
    const savedQuote = await quote.save();
    res.status(201).json(savedQuote);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(400).json({ message: 'Invalid quote data' });
  }
};
