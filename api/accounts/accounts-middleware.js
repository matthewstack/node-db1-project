const Accounts = require("../accounts/accounts-model");

exports.checkAccountPayload = (req, res, next) => {
  // DO YOUR MAGIC
  // Note: you can either write "manual" validation logic
  // or use the Yup library (not currently installed)

  const { name, budget } = req.body;
  const trimmedName = name.trim();

  if (trimmedName === undefined || budget === undefined) {
    next({ status: 400, message: "name and budget are required" });
  } else if (typeof trimmedName !== "string") {
    next({ status: 400, message: "name of account must be a string" });
  } else if (trimmedName.length < 3 || trimmedName.length > 100) {
    next({ status: 400, message: "name of account must be between 3 and 100" });
  } else if (typeof budget !== "number") {
    next({ status: 400, message: "budget of account must be a number" });
  } else if (budget < 0 || budget > 1000000) {
    next({
      status: 400,
      message: "budget of account is too large or too small",
    });
  } else {
    req.name = name;
    req.budget = budget;
    next();
  }
};
exports.checkAccountNameUnique = async (req, res, next) => {
  // DO YOUR MAGIC

  const { name } = req.body;
  const trimmedName = name.trim();

  try {
    const existingUser = await Accounts.getAll()
      .where("name", trimmedName)
      .first();
    if (existingUser) {
      next({ status: 400, message: "that name is taken" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.checkAccountId = async (req, res, next) => {
  // DO YOUR MAGIC
  const { id } = req.params;
  try {
    const existingUser = await Accounts.getById(id);
    if (!existingUser) {
      next({ status: 404, message: `account not found` });
    } else {
      req.account = existingUser;
      next();
    }
  } catch (err) {
    next(err);
  }
};
