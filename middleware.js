function checkAuthenticated(req, res, next) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/sign-in");
  }

  next();
}

function checkAdmin(req, res, next) {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/sign-in");
  }
  
  if (user.role !== "admin") {
    return res.status(403).json({message: "Access denied. Admins only."});
  }

  next();
}

export { checkAuthenticated, checkAdmin };
