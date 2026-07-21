const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Number = require('../models/Number');
const { adminAuth } = require('../middleware/auth');

// Multer Setup for File Uploads
const upload = multer({ dest: 'uploads/' });

// GET all numbers (Public with pagination/filters, or Admin Mode)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category = 'All', 
      carrier = 'all', 
      minPrice, 
      maxPrice, 
      excludeDigits, 
      numerologySum,
      searchDigits, // comma-separated digits for position search, e.g. "*,*,*,*,*,9,8,5,*,*"
      sort = 'none',
      adminMode = 'false',
      ids
    } = req.query;

    const query = {};

    if (ids) {
      query._id = { $in: ids.split(',') };
    }
    
    // Only exclude sold numbers for public users
    if (adminMode !== 'true') {
      query.isSold = false;
    }

    // 1. Category filter
    if (category && category !== 'All') {
      if (category === 'Offer Zone') {
        query.offerPrice = { $gt: 0 };
      } else {
        query.category = category;
      }
    }

    // 2. Carrier filter
    if (carrier && carrier !== 'all') {
      query.operator = { $regex: new RegExp(`^${carrier}$`, 'i') };
    }

    // 3. Price Filter (checking offerPrice or price)
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || Infinity;
    if (minPrice || maxPrice) {
      query.$or = [
        { offerPrice: { $exists: true, $gte: min, $lte: max } },
        { offerPrice: { $exists: false }, price: { $gte: min, $lte: max } }
      ];
    }

    // 4. Exclude Digits
    if (excludeDigits && excludeDigits.trim() !== '') {
      const excludedArray = excludeDigits.replace(/[^0-9]/g, '').split('');
      if (excludedArray.length > 0) {
        const regexStr = excludedArray.join('|');
        query.cleanNumber = { $not: new RegExp(regexStr) };
      }
    }

    // 5. Numerology single digit sum
    if (numerologySum !== '' && numerologySum !== undefined) {
      query.singleDigitSum = parseInt(numerologySum);
    }

    // 6. Position-based digit matching (searchDigits)
    if (searchDigits) {
      const digitsArr = searchDigits.split(',');
      if (digitsArr.some(d => d !== '*' && d !== '')) {
        let regexPattern = '^';
        digitsArr.forEach(digit => {
          if (digit === '*' || digit === '') {
            regexPattern += '[0-9]';
          } else {
            regexPattern += digit;
          }
        });
        regexPattern += '$';
        query.cleanNumber = { $regex: new RegExp(regexPattern) };
      }
    }

    // Sort order
    let sortObj = {};
    if (sort === 'low-high') {
      sortObj = { price: 1 };
    } else if (sort === 'high-low') {
      sortObj = { price: -1 };
    }

    // Execute paginated query
    const pageNum = parseInt(page);
    let limitNum = parseInt(limit);
    if (limit === 'all' || isNaN(limitNum)) {
      limitNum = 100000;
    }
    const skip = (pageNum - 1) * limitNum;

    const total = await Number.countDocuments(query);
    const numbers = await Number.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    res.json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      numbers
    });
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
