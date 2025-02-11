class SimpleSumElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });

		// Crear contenedor
		const container = document.createElement("div");
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.alignItems = "center";
		container.style.padding = "10px";
		container.style.background = "#f9f9f9";
		container.style.borderRadius = "10px";
		container.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
		container.style.width = "200px";

		// Crear inputs y botón
		this.input1 = document.createElement("input");
		this.input1.type = "number";
		this.input1.placeholder = "Número 1";

		this.input2 = document.createElement("input");
		this.input2.type = "number";
		this.input2.placeholder = "Número 2";

		const button = document.createElement("button");
		button.textContent = "Sumar";
		button.style.marginTop = "10px";

		this.result = document.createElement("p");
		this.result.textContent = "Resultado: ";

		// Evento para sumar
		button.addEventListener("click", () => {
			const num1 = parseFloat(this.input1.value) || 0;
			const num2 = parseFloat(this.input2.value) || 0;
			this.result.textContent = `Resultado: ${num1 + num2}`;
		});

		// Agregar elementos al contenedor
		container.appendChild(this.input1);
		container.appendChild(this.input2);
		container.appendChild(button);
		container.appendChild(this.result);

		// Agregar al Shadow DOM
		this.shadowRoot.appendChild(container);
	}
}

// Definir el custom element
customElements.define("simple-sum", SimpleSumElement);
