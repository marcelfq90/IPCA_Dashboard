export default {
  ProcuraWhere(array, conditionFn) {
    const item = array.find(conditionFn);
    return array.indexOf(item);
  }
};
