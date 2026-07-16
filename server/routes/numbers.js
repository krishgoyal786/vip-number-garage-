const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Number = require('../models/Number');
const { adminAuth } = require('../middleware/auth');

// Multer Setup for File Uploads
const upload = multer({ dest: 'uploads/' });

// GET all numbers (Public)
router.get('/', async (req, res) => {
  try {
    const numbers = await Number.find();
    res.json(numbers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new number (Admin Only)
router.post('/', adminAuth, async (req, res) => {
  const number = new Number({
    number: req.body.number,
    price: req.body.price,
    offerPrice: req.body.offerPrice,
    category: req.body.category,
    operator: req.body.operator || 'Airtel',
    description: req.body.description
  });

  try {
    const newNumber = await number.save();
    res.status(201).json(newNumber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// BULK UPLOAD (Admin Only)
router.post('/bulk', adminAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const errors = [];
        const formattedData = [];
        const seenNumbers = new Set();

        results.forEach((row, index) => {
          const rowNum = index + 2; // Data rows start at line 2

          const getVal = (possibleKeys) => {
            const foundKey = Object.keys(row).find(k => possibleKeys.includes(k.trim().toLowerCase()));
            return foundKey ? row[foundKey] : undefined;
          };

          const rawNum = getVal(['number', 'phone', 'mobile']);
          const pr = getVal(['price', 'original price', 'mrp']);
          const offPr = getVal(['offerprice', 'offer price', 'discount price']);
          const cat = getVal(['category', 'type', 'style']);
          const oper = getVal(['operator', 'carrier', 'company', 'network']);
          const desc = getVal(['description', 'details', 'info']);

          if (!rawNum) {
            errors.push(`Row ${rowNum}: Missing number/phone column.`);
            return;
          }

          const cleanNum = rawNum.replace(/[-\s]/g, '');
          if (cleanNum.length < 8 || cleanNum.length > 15) {
            errors.push(`Row ${rowNum}: Invalid number '${rawNum}' (must be 8-15 digits).`);
            return;
          }

          const priceVal = parseInt(pr);
          if (isNaN(priceVal) || priceVal <= 0) {
            errors.push(`Row ${rowNum}: Invalid or missing original price '${pr}'.`);
            return;
          }

          const offerPriceVal = offPr ? parseInt(offPr) : undefined;
          if (offPr && (isNaN(offerPriceVal) || offerPriceVal < 0)) {
            errors.push(`Row ${rowNum}: Invalid offer price '${offPr}'.`);
            return;
          }

          if (seenNumbers.has(cleanNum)) {
            errors.push(`Row ${rowNum}: Duplicate number '${rawNum}' found within the CSV file.`);
            return;
          }
          seenNumbers.add(cleanNum);

          formattedData.push({
            number: rawNum.trim(),
            price: priceVal,
            offerPrice: offerPriceVal,
            category: (cat || 'General').trim(),
            operator: (oper || 'Airtel').trim(),
            description: (desc || `Premium VIP Number: ${rawNum}`).trim(),
            isSold: false
          });
        });

        if (formattedData.length === 0) {
          throw new Error("No valid numbers to upload. Errors:\n" + errors.join('\n'));
        }

        let insertedCount = 0;
        let skippedDuplicates = 0;
        try {
          const insertResult = await Number.insertMany(formattedData, { ordered: false });
          insertedCount = insertResult.length;
        } catch (insertErr) {
          if (insertErr.code === 11000 || insertErr.name === 'BulkWriteError') {
            insertedCount = insertErr.result ? insertErr.result.nInserted : 0;
            skippedDuplicates = formattedData.length - insertedCount;
          } else {
            throw insertErr;
          }
        }

        fs.unlinkSync(req.file.path);
        res.status(201).json({
          message: `Bulk upload completed successfully.`,
          inserted: insertedCount,
          skippedDuplicates: skippedDuplicates,
          validationErrors: errors
        });
      } catch (err) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        console.error("Bulk Upload Error:", err);
        res.status(400).json({ message: err.message });
      }
    });
});

// DELETE a number (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const number = await Number.findById(req.params.id);
    if (!number) return res.status(404).json({ message: 'Number not found' });
    
    await Number.findByIdAndDelete(req.params.id);
    res.json({ message: 'Number deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE offerPrice only (Admin Only)
router.patch('/:id/offer', adminAuth, async (req, res) => {
  try {
    const number = await Number.findById(req.params.id);
    if (!number) return res.status(404).json({ message: 'Number not found' });
    
    number.offerPrice = req.body.offerPrice || undefined;
    const updatedNumber = await number.save();
    res.json(updatedNumber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// TOGGLE sold status (Admin Only)
router.patch('/:id/toggle-sold', adminAuth, async (req, res) => {
  try {
    const number = await Number.findById(req.params.id);
    if (!number) return res.status(404).json({ message: 'Number not found' });
    
    number.isSold = req.body.isSold;
    const updatedNumber = await number.save();
    res.json(updatedNumber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
