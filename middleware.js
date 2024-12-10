function checkAuthenticated(req, res, next) {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/sign-in");
  }

  next();
}

export { checkAuthenticated };
