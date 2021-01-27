const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

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
    console.log(error);
    res.status(500).json(error);
  });
});

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
  }).then(catsByID => {
    if (!catsByID) {
      res.status(404).json({ message: 'A category with this ID does not exist in the database.' });
      return;
    }
    res.json(catsByID);
  }).catch(error => {
    console.log(error);
    res.status(500).json(error);
  });
});

router.post('/', (req, res) => {
  // Create a new category
  Category.create({
    category_name: req.body.category_name
  }).then(newCategory => {
    res.json(newCategory);
  }).catch(error => {
    console.log(error);
    res.status(500).json(error);
  });
});

router.put('/:id', (req, res) => {
  // Update a category by its `id` value
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
      console.log(error);
      res.status(500).json(error);
    });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
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
    console.log(error);
    res.status(500).json(error);
  });
});

module.exports = router;
