export default function (num) {
  const n = Number(num);
  const parts = n.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
  return `$ ${parts}`;
}
