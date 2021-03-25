const getTemplate = (placeholder, data = []) => {
  const text = placeholder ?? '';

  const itemsHtml = data.map(item => {
    return `<li class="select__item" data-type="item" data-id="${item.id}">${item.value}</li>`
  }).join('');

  return `
    <div class="select__input" data-type="input">
      <div class="select__input-text" data-type="value">
        ${text}
      </div>
      <i class="fal fa-angle-down select__input-caret"></i>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${itemsHtml}
      </ul>
    </div>
  `;
};

export class Select {
  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.options = options;
    this.selectedId = null;

    this.#render();
    this.#setup();
  }

  #render() { // приватный метод
    const {placeholder, data} = this.options;
    this.$el.classList.add('select');
    this.$el.innerHTML = getTemplate(placeholder, data);
  }

  #setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener('click', this.clickHandler);
    this.$value = this.$el.querySelector('[data-type = "value"]');
  }

  clickHandler(event) {
    const {type, id} = event.target.dataset;

    if (type === 'input') {
      this.toggle();
    } else if (type === 'item') {
      const itemId = event.target.dataset.id
      this.select(itemId);
    }
  }

  get isOpen() {
    return this.$el.classList.contains('open');
  }

  get current() {
    return this.options.data.find(item => item.id === this.selectedId);
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  select(id) {
    this.selectedId = id;
    this.$value.innerText = this.current.value;
    this.close();
  }

  open() {
    this.$el.classList.add('open');
  }

  close() {
    this.$el.classList.remove('open');
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler);
  }
}
