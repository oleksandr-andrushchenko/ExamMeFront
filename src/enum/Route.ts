enum Route {
  HOME = '/',
  CATEGORIES = '/categories',
  CATEGORY = '/categories/:categoryId',
  QUESTIONS = '/questions',
  QUESTION = '/categories/:categoryId/questions/:questionId',
  EXAMS = '/exams',
  EXAM = '/categories/:categoryId/exams/:examId',
  LOGIN = '/login',
  REGISTER = '/register',
  TERMS_AND_CONDITIONS = '/terms-and-conditions',
}

export default Route