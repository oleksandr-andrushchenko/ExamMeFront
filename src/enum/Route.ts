enum Route {
  HOME = '/',
  CATEGORIES = '/categories',
  CATEGORY = '/categories/:categoryId',
  QUESTION = '/categories/:categoryId/questions/:questionId',
  ADD_QUESTION = '/categories/:categoryId/questions/add',
  LOGIN = '/login',
  REGISTER = '/register',
  TERMS_AND_CONDITIONS = '/terms-and-conditions',
}

export default Route