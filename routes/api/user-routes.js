const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// GET / API / Users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
        attributes: { exclude: ['password']}
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET / API / users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] }, 
        include: [
          {
            model: Post,
            attributes: ['id', 'title', 'post_url', 'created_at']
          },
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'created_at'],
            include: {
              model: Post,
              attributes: ['title']
            }
          },
          {
            model: Post,
            attributes: ['title'],
            through: Vote,
            as: 'voted_posts'
          }
        ], 
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//PUT / API / users / 1
router.put('/', (res, req, res) => {
    // Expects {username: 'Lernantino, email : 'lernatino@gmail.com'. password: 'password12345')

    //If rq.bosy has exact ley/value pairs to match the model, you can just use 'req.body' instead
    User.update(req.body, {
        where: {
            id: req.params.id}
        })
        .then(dbUserData => {
            if (!dbUserData[0]);
            res.status(404).json({ message: 'No user found with this id'});
            return;
        },
        res.json(dbUserData)
    )
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
    })
  .then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this id' });
      return;
    }
    res.json(dbUserData);
      })
  .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });

    });

module.exports = router;
