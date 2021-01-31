const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products
router.get('/', (req, res) => {
  // Search for all products and include associated category and tag data
  Product.findAll({
    attributes: ['id', 'product_name', 'stock', 'price', 'category_id'],
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
    ]
  }).then(allProducts => {
    res.json(allProducts);
  }).catch(error => {
    res.status(500).json(error);
  });
});

// GET one product
router.get('/:id', (req, res) => {
  // find a single product by its `id` and include associated Category and Tag data
  Product.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'product_name', 'stock', 'price', 'category_id'],
    include: [
      {
        model: Category,
        attributes: ['id', 'category_name']
      },
      {
        model: Tag,
        attributes: ['id', 'tag_name']
      }
    ]
  }).then(prodById => {
    if (!prodById) {
      res.status(404).json({ message: 'A product with this ID does not exist in the database.' });
      return;
    }
    res.json(prodById);
  }).catch(error => {
    res.status(500).json(error);
  });
});

// POST new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Update product using PUT route
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  }).then((product) => {
    return ProductTag.findAll({ where: { product_id: req.params.id } });
  }).then((prodTags) => {
    const prodTagIds = prodTags.map(({ tag_id }) => tag_id);
    const newProdTags = req.body.tagIds
      .filter((tag_id) => !prodTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

    const pTagsToDel = prodTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    return Promise.all([
      ProductTag.destroy({ where: { id: pTagsToDel } }),
      ProductTag.bulkCreate(newProdTags),
    ]);
  })
    .then((updatedPTags) => res.json(updatedPTags))
    .catch((error) => {
      res.status(400).json(error);
    });
});

// DELETE one product by its `id` value
router.delete('/:id', (req, res) => {
  Product.destroy({
    where: {
      id: req.params.id
    }
  }).then(prodToDelete => {
    if (!prodToDelete) {
      res.status(404).json({ message: 'A product with this ID does not exist in the database.' });
      return;
    }
    res.json(prodToDelete);
  }).catch(error => {
    res.status(500).json(error);
  });
});

module.exports = router;
