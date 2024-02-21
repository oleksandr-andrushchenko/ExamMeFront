export default (...classes) => {
  return classes.filter(Boolean).join(' ');
}