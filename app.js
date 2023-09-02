const perguntas = [
    {
        texto: "Qual o cor favorita do Vini?",
        opcoes: ["Vermelho", "Azul", "Preto", "Amarelo"],
        correta: 1
    },
    {
        texto: "Batata",
        opcoes: ["Vermelho", "Azul", "Preto", "Amarelo"],
        correta: 0
    },
    {
        texto: "Quer namorar comigo? 🤔♥️",
        opcoes: ["Sim", "Não"],
        correta: 0,
        perguntaSacana: true
    }
];

const url = new URL(window.location);
const indicePergunta = parseInt(url.searchParams.get('p') || 0);
const pergunta = perguntas[indicePergunta];

document.getElementById("texto-pergunta").innerHTML = pergunta.texto;
document.getElementById("opcoes").innerHTML = pergunta.opcoes.map((opcao, indice) => {
    const classe = pergunta.perguntaSacana && indice != pergunta.correta ? "no" : "";
    return `<button id="btn-${indice}" class="${classe}">${opcao}</button>`;
}).join("");

$(":button").click(async (evt) => {
    const taCerto = evt.target.id == `btn-${pergunta.correta}`;
    if (taCerto && pergunta.perguntaSacana) {
        await alerta("Obrigado 😍", "💘 Obrigado meu amor, vc é incrível 💘");
    }
    else if (taCerto) {
        await alerta("Parabéns!!!", "Você acertou 🫡🫡");
        url.searchParams.set('p', indicePergunta + 1);
        window.location = url.toString();
    }
    else {
        await alerta("Que Pena!!!", "Você errou, tente novamente 😞😞");
    }
});


const btn = document.querySelector(".no");
let position = 0;

const moveButton = () => {
    position = position ? 0 : 150;
    btn.style.transform = `translate(${position}px, 0px)`;
    btn.style.transition = "all 0.2s ease";
};

btn.addEventListener("click", moveButton);
btn.addEventListener("mouseover", moveButton);

async function alerta(titulo, conteudo) {
    return new Promise((resolve) => {
        let timerInterval
        Swal.fire({
            title: titulo,
            html: conteudo,
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            resolve();
        })
    });
}