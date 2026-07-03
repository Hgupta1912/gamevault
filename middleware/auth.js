const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  res.status(403).render("error", {
    status: 403,
    message: "You do not have permission to do that"
  });
};

module.exports = { isLoggedIn, isAdmin };