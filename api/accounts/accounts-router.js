const router = require("express").Router();
const Accounts = require("./accounts-model");

const {
  checkAccountId,
  checkAccountPayload,
  checkAccountNameUnique,
} = require("../accounts/accounts-middleware");

router.get("/", async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const theAccounts = await Accounts.getAll();
    res.json(theAccounts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", checkAccountId, (req, res, next) => {
  // DO YOUR MAGIC
  res.json(req.account);
});

router.post(
  "/",
  checkAccountPayload,
  checkAccountNameUnique,
  (req, res, next) => {
    // DO YOUR MAGIC
    const { name, budget } = req.body;
    const trimmedName = name.trim();

    Accounts.create(req.body)
      .then((account) => {
        res.status(201).json({ name: trimmedName, budget: budget });
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.put(
  "/:id",
  checkAccountId,
  checkAccountPayload,
  checkAccountNameUnique,
  (req, res, next) => {
    // DO YOUR MAGIC

    Accounts.updateById(req.params.id, req.body)
      .then((account) => {
        res.status(200).json(account);
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.delete("/:id", checkAccountId, (req, res, next) => {
  // DO YOUR MAGIC
  const { id } = req.params;
  Accounts.deleteById(id)
    .then(() => {
      return res.json(req.account);
    })
    .catch((err) => {
      next(err);
    });
});

router.use((err, req, res, next) => {
  // eslint-disable-line
  // DO YOUR MAGIC
  res.status(err.status || 500).json({
    custom: "something went wrong in the projects router",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
