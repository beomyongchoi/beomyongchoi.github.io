// Tiny scalar autograd (micrograd-style) for the training-series toys.
// Each Value remembers how it was made; backward() walks the graph in reverse
// topological order and accumulates d(out)/d(node) into node.grad.
export class Value {
  constructor(data, children = [], op = "", label = "") {
    this.data = data;
    this.grad = 0;
    this.children = children;
    this.op = op;
    this.label = label;
    this._back = () => {};
  }
  add(o) {
    o = o instanceof Value ? o : new Value(o);
    const out = new Value(this.data + o.data, [this, o], "+");
    out._back = () => { this.grad += out.grad; o.grad += out.grad; };
    return out;
  }
  mul(o) {
    o = o instanceof Value ? o : new Value(o);
    const out = new Value(this.data * o.data, [this, o], "×");
    out._back = () => { this.grad += o.data * out.grad; o.grad += this.data * out.grad; };
    return out;
  }
  sub(o) { return this.add(o instanceof Value ? o.mul(-1) : -o); }
  square() {
    const out = new Value(this.data ** 2, [this], "²");
    out._back = () => { this.grad += 2 * this.data * out.grad; };
    return out;
  }
  relu() {
    const out = new Value(Math.max(0, this.data), [this], "ReLU");
    out._back = () => { this.grad += (this.data > 0 ? 1 : 0) * out.grad; };
    return out;
  }
  tanh() {
    const t = Math.tanh(this.data);
    const out = new Value(t, [this], "tanh");
    out._back = () => { this.grad += (1 - t * t) * out.grad; };
    return out;
  }
  // Nodes in topological order (inputs first). Reverse it for the backward sweep.
  topo() {
    const order = [], seen = new Set();
    const visit = (v) => { if (seen.has(v)) return; seen.add(v); v.children.forEach(visit); order.push(v); };
    visit(this);
    return order;
  }
  backward() {
    const order = this.topo();
    order.forEach((v) => (v.grad = 0));
    this.grad = 1;
    for (let i = order.length - 1; i >= 0; i--) order[i]._back();
    return order;
  }
}
