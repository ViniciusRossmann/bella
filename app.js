const perguntas = [
    {
        texto: "Qual a minha cor favorita?",
        opcoes: ["Vermelho", "Azul", "Preto", "Amarelo"],
        correta: 1
    },
    {
        texto: "Em que cidade eu nasci?",
        opcoes: ["Vila Velha", "Pancas", "Linhares", "Colatina"],
        correta: 3
    },
    {
        texto: "Qual a minha série preferida?",
        opcoes: ["Peaky Blinders", "Black Mirror", "Breaking Bad", "The Witcher"],
        correta: 2
    },
    {
        texto: "Qual a cor da minha camisa no nosso primeiro date?",
        opcoes: ["Preta", "Branca", "Amarela", "Verde"],
        correta: 1
    },
    {
        texto: "Que tipo de música eu prefiro?",
        opcoes: ["Pagode", "Sertanejo", "Hip Hop", "Rock"],
        correta: 3
    },
    {
        texto: "Quer namorar comigo? 🤔💘",
        opcoes: ["Sim 👍", "Não 😠"],
        correta: 0,
        perguntaSacana: true
    }
];

const url = new URL(window.location);
const indicePergunta = parseInt(url.searchParams.get('p') || 0);
const acertos = parseInt(url.searchParams.get('a') || 0);
const pergunta = perguntas[indicePergunta];

setTimeout(() => {
    const loader = document.getElementById("tela-texto");
    loader.style.display = "none";
    if (pergunta.perguntaSacana) {
        loader.style.display = "flex";
        setTimeout(() => {
            loader.style.display = "none";
        }, 3000);
    }
}, 10)


document.getElementById("pontos").innerHTML = acertos;
document.getElementById("texto-pergunta").innerHTML = pergunta.texto;
document.getElementById("opcoes").innerHTML = pergunta.opcoes.map((opcao, indice) => {
    const classe = pergunta.perguntaSacana && indice != pergunta.correta ? "no" : "";
    return `<button id="btn-${indice}" class="opcao ${classe}">${opcao}</button>`;
}).join("");

$(".opcao").click(async (evt) => {
    const taCerto = evt.target.id == `btn-${pergunta.correta}`;
    if (taCerto && pergunta.perguntaSacana) {
        await alerta("Obrigado 😍", "Hmmmmm agora somos namoradinhos 🤭😊🤩<br>Espero te fazer muito feliz!!!<br>Eu sei q vc odeia sertanejo, mas...", 4000);
        window.open("https://www.youtube.com/watch?v=VWRkQARH-9o");
        return;
    }
    else if (pergunta.perguntaSacana) {
        return;
    }
    else if (taCerto) {
        url.searchParams.set('a', acertos + 1); 
        await alerta("Parabéns!!!", "Você acertou 🫡🫡");
        url.searchParams.set('p', indicePergunta + 1);
        window.location = url.toString();
    }
    else {
        await alerta("Você errou 😞😞", `A resposta certa era: ${pergunta.opcoes[pergunta.correta]}`);
        url.searchParams.set('p', indicePergunta + 1);
        window.location = url.toString();
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

async function alerta(titulo, conteudo, tempo=2000) {
    return new Promise((resolve) => {
        let timerInterval
        Swal.fire({
            title: titulo,
            html: conteudo,
            timer: tempo,
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