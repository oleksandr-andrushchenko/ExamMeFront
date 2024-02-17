enum RoutePath {
  HOME = '/',
  CATEGORIES = '/categories',
  CATEGORY = '/categories/:categoryId',
  ADD_CATEGORY = '/categories/add',
  QUESTION = '/categories/:categoryId/questions/:questionId',
  LOGIN = '/login',
  REGISTER = '/register',
  TERMS_AND_CONDITIONS = '/terms-and-conditions',
  UNAUTHORIZED = '/unauthorized',
}

export default RoutePath;