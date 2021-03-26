const getTemplate = (placeholder, selectedId, data = []) => {
  let text = placeholder ?? '';

  const itemsHtml = data.map(item => {
    let classCss = '';
    if (item.id === selectedId) {
      text = item.value;
      classCss = 'active'
    }

    return `<li class="select__item ${classCss}" data-type="item" data-id="${item.id}">${item.value}</li>`
  }).join('');

  return `
    <div class="select__backdrop" data-type="backdrop"></div>
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
    this.selectedId = options.selectedId || '';

    this.#render();
    this.#setup();
  }

  #render() { // приватный метод
    const {placeholder, selectedId, data} = this.options;
    this.$el.classList.add('select');
    this.$el.innerHTML = getTemplate(placeholder, selectedId, data);
  }

  #setup() {
    this.clickHandler = this.clickHandler.bind(this);
    this.$el.addEventListener('click', this.clickHandler);
    this.$value = this.$el.querySelector('[data-type = "value"]');

    // this.selectedId ? this.select(this.selectedId) : null;
    // Сейчас как вариант элемент по умолчанию устанавливается в getTemplate()
  }

  clickHandler(event) {
    const {type, id} = event.target.dataset;

    if (type === 'input') {
      this.toggle();
    } else if (type === 'item') {
      const itemId = event.target.dataset.id

      this.select(itemId);
    } else if (type === 'backdrop') {
      this.close();
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

    this.$el.querySelectorAll('[data-type = "item"]').forEach(item => item.classList.remove('active'));

    this.$el.querySelector(`[data-id = "${this.current.id}"]`).classList.add('active');

    this.options.onSelect ? this.options.onSelect(this.current) : null;

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
    this.$el.innerHTML = '';
  }
}
