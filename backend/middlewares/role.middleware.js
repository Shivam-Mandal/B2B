export const isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Seller access only"
    });
  }
  next();
};

export const isBuyer = (req, res, next) => {
  if (req.user.role !== "buyer") {
    return res.status(403).json({
      success: false,
      message: "Buyer access only"
    });
  }
  next();
};
