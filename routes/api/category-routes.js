const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET all categories
router.get('/', (req, res) => {
  // Search to find all categories and associated products/product info
  Category.findAll({
    attributes: ['id', 'category_name'],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'stock', 'price', 'category_id']
      }
    ]
  }).then(allCategories => {
    res.json(allCategories);
  }).catch(error => {
    res.status(500).json(error);
  });
});

// GET product by 'id'
router.get('/:id', (req, res) => {
  // Search for category by 'id' and include all associated products/product info
  Category.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'category_name'],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id']
      }
    ]
  }).then(catById => {
    if (!catById) {
      res.status(404).json({ message: 'A category with this ID does not exist in the database.' });
      return;
    }
    res.json(catById);
  }).catch(error => {
    res.status(500).json(error);
  });
});

// POST new category
router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  }).then(newCategory => {
    res.json(newCategory);
  }).catch(error => {
    res.status(500).json(error);
  });
});

// PUT catagory data in db to update category by 'id'
router.put('/:id', (req, res) => {
  Category.update(req.body,
    {
      where: {
        id: req.params.id
      }
    }).then(updateCategory => {
      if (!updateCategory) {
        res.status(404).json({ message: 'A category with this ID does not exist in the database.' });
        return;
      }
      res.json(updateCategory);
    }).catch(error => {
      res.status(500).json(error);
    });
});

// DELETE route to delete category by 'id'
router.delete('/:id', (req, res) => {
  Category.destroy({
    where: {
      id: req.params.id
    }
  }).then(catToDelete => {
    if (!catToDelete) {
      res.status(404).json({ message: 'A category with this ID does not exist in the database.' });
      return;
    }
    res.json(catToDelete);
  }).catch(error => {
    res.status(500).json(error);
  });
});

module.exports = router;
