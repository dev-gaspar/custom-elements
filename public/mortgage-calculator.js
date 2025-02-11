class MortgageCalculator extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
		this.state = {
			homePrice: 312500,
			downPayment: 62500,
			annualInterestRate: 4,
			loanTerm: 30,
			annualPropertyTax: 8594,
			annualInsurance: 1031,
		};
		this.render();
	}

	connectedCallback() {
		this.updateChart();
	}

	updateState(key, value) {
		this.state[key] = value;
		this.render();
		this.updateChart();
	}

	calculateValues() {
		const {
			homePrice,
			downPayment,
			annualInterestRate,
			loanTerm,
			annualPropertyTax,
			annualInsurance,
		} = this.state;
		const principal = homePrice - downPayment;
		const monthlyInterestRate = annualInterestRate / 100 / 12;
		const numberOfPayments = loanTerm * 12;

		let monthlyPrincipalAndInterest = 0;
		if (monthlyInterestRate !== 0) {
			monthlyPrincipalAndInterest =
				(principal *
					(monthlyInterestRate *
						Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
				(Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
		} else {
			monthlyPrincipalAndInterest = principal / numberOfPayments;
		}

		const monthlyTax = annualPropertyTax / 12;
		const monthlyInsurance = annualInsurance / 12;
		const totalMonthlyPayment =
			monthlyPrincipalAndInterest + monthlyTax + monthlyInsurance;

		return {
			monthlyPrincipalAndInterest,
			monthlyTax,
			monthlyInsurance,
			totalMonthlyPayment,
		};
	}

	updateChart() {
		const { monthlyPrincipalAndInterest, monthlyTax, monthlyInsurance } =
			this.calculateValues();
		if (this.chart) {
			this.chart.data.datasets[0].data = [
				monthlyPrincipalAndInterest,
				monthlyTax,
				monthlyInsurance,
			];
			this.chart.update();
		}
	}

	render() {
		const {
			homePrice,
			downPayment,
			annualInterestRate,
			loanTerm,
			annualPropertyTax,
			annualInsurance,
		} = this.state;
		const {
			monthlyPrincipalAndInterest,
			monthlyTax,
			monthlyInsurance,
			totalMonthlyPayment,
		} = this.calculateValues();

		this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
                }
                .chart-container {
                    position: relative;
                    width: 100%;
                    max-width: 300px;
                    height: 300px;
                    margin: auto;
                }
            </style>
            <h2>Calculadora de Hipoteca</h2>
            <label>Precio de la vivienda (USD): ${homePrice}</label>
            <input type="range" min="50000" max="1000000" step="1000" value="${homePrice}" data-key="homePrice">
            <label>Cuota inicial (USD): ${downPayment}</label>
            <input type="range" min="0" max="${homePrice}" step="500" value="${downPayment}" data-key="downPayment">
            <label>Tasa de interés anual (%): ${annualInterestRate}</label>
            <input type="range" min="0" max="15" step="0.1" value="${annualInterestRate}" data-key="annualInterestRate">
            <label>Plazo (años): ${loanTerm}</label>
            <input type="range" min="5" max="40" step="1" value="${loanTerm}" data-key="loanTerm">
            <label>Impuesto anual (USD): ${annualPropertyTax}</label>
            <input type="range" min="0" max="30000" step="100" value="${annualPropertyTax}" data-key="annualPropertyTax">
            <label>Seguro anual (USD): ${annualInsurance}</label>
            <input type="range" min="0" max="10000" step="50" value="${annualInsurance}" data-key="annualInsurance">
            <div class="chart-container">
                <canvas id="doughnutChart"></canvas>
            </div>
            <p>Total Pago Mensual: $${totalMonthlyPayment.toFixed(2)}</p>
        `;

		this.shadowRoot.querySelectorAll("input[type=range]").forEach((input) => {
			input.addEventListener("input", (event) => {
				this.updateState(event.target.dataset.key, Number(event.target.value));
			});
		});

		if (!this.chart) {
			this.initChart();
		}
	}

	initChart() {
		const ctx = this.shadowRoot
			.querySelector("#doughnutChart")
			.getContext("2d");
		this.chart = new Chart(ctx, {
			type: "doughnut",
			data: {
				labels: ["Principal e Interés", "Impuesto", "Seguro"],
				datasets: [
					{
						data: [0, 0, 0],
						backgroundColor: ["#6f52ed", "#ffcf26", "#fa5c7c"],
						hoverBackgroundColor: ["#5a3ce1", "#e6b800", "#e84569"],
						borderWidth: 1,
					},
				],
			},
			options: {
				cutout: "60%",
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false },
				},
			},
		});
		this.updateChart();
	}
}

customElements.define("mortgage-calculator", MortgageCalculator);
