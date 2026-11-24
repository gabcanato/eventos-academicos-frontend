const API_URL = "https://eventos-academicos-backend.onrender.com/eventos";

const meses = [
    "JAN", "FEV", "MAR", "ABR",
    "MAI", "JUN", "JUL", "AGO",
    "SET", "OUT", "NOV", "DEZ"
];

document.addEventListener("DOMContentLoaded", () => {

    ListarEventos();

    document.getElementById("formEvento")
        .addEventListener("submit", CadastrarEvento);

});


// LISTAR EVENTOS - GET

async function ListarEventos() {

    const lista = document.getElementById("listaEventos");

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Erro ao buscar eventos.");
        }

        const eventos = await response.json();

        lista.innerHTML = "";

        if (eventos.length === 0) {
            lista.textContent = "Nenhum evento cadastrado.";
            return;
        }

        eventos.forEach(evento => {

            const data = evento.data_evento.split("/");
            const dia = data[0];
            const mes = meses[Number(data[1]) - 1];
            const ano = data[2];

            const card = document.createElement("div");

            card.className = "col-12";

            card.innerHTML = `
                <div class="evento-card">

                    <div class="evento-data">
                        <h3></h3>
                        <p></p>
                        <small></small>
                    </div>

                    <div class="evento-info">
                        <h5></h5>

                        <p class="evento-local">
                            <i class="bi bi-geo-alt-fill"></i>
                            <span class="local-texto"></span>
                        </p>

                        <p class="evento-descricao"></p>
                    </div>

                </div>
            `;

            card.querySelector(".evento-data h3").textContent = dia;
            card.querySelector(".evento-data p").textContent = mes;
            card.querySelector("small").textContent = ano;
            card.querySelector("h5").textContent = evento.titulo;
            card.querySelector(".local-texto").textContent = evento.local;
            card.querySelector(".evento-descricao").textContent = evento.descricao || "";

            lista.appendChild(card);

        });

    } catch (error) {

        console.error(error);
        lista.textContent = "Não foi possível carregar os eventos.";

    }
}


// CADASTRAR EVENTOS - POST

async function CadastrarEvento(event) {

    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const data = document.getElementById("data_evento").value;
    const local = document.getElementById("local").value.trim();

    if (!titulo || !data || !local) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const dataFormatada = data.split("-").reverse().join("/");

    const novoEvento = {
        titulo: titulo,
        descricao: descricao,
        data_evento: dataFormatada,
        local: local
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(novoEvento)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.erro || "Erro ao cadastrar evento.");
        }

        document.getElementById("formEvento").reset();

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalEvento")
        );

        modal?.hide();

        await ListarEventos();

        alert("Evento cadastrado com sucesso!");

    } catch (error) {

        console.error(error);
        alert(error.message);

    }
}