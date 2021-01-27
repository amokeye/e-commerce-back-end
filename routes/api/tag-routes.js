const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// GET all tags and include associated Product data
router.get('/', (req, res) => {
  Tag.findAll(
    {
      include: {
        model: Product
      }
    }).then(tagData => {
      res.json(tagData);
    }).catch(error => {
      res.status(500).json(error);
    });
});

// GET tag by 'id' and include associated Product data
router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Product
    }
  }).then(tagById => {
    res.json(tagById);
  }).catch(error => {
    res.status(500).json(error);
  });
});

// POST new tag
router.post('/', (req, res) => {
  Tag.create({
    tag_name: req.body.tag_name
  }).then(newTag => {
    res.json(newTag);
  }).catch(error => {
    res.status(500).json(error);
  });
});

// Update/PUT new tag's name by 'id'
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(tagToUpdate => {
    if (!tagToUpdate) {
      res.status(404).json({ message: 'No tag with this ID exists in the database.' });
      return;
    }
    res.json(tagToUpdate);
  }).catch(error => {
    res.status(500).json(error);
  });
});

// DELETE tab by 'id'
router.delete('/:id', (req, res) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  }).then(tagToDelete => {
    if (!tagToDelete) {
      res.status(404).json({ message: 'No tag with this ID exists in the database.' });
      return;
    }
    res.json(tagToDelete);
  }).catch(error => {
    res.status(500).json(error);
  });
});

module.exports = router;
