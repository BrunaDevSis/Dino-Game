AOS.init();

AOS.init({
    duration: 1000
});

$(window).on("load scroll", function(){
    var threshold = 30; // porcentagem da altura visível do elemento que aparecer na tela para iniciar a animação
    $(".mostrar").each(function(){
        var el = $(this);
        var eleHeight = el.outerHeight(); // altura da div
        var eleTopo = el.offset().top; // distancia da div ao topo do documento
        var scrlTopo = $(window).scrollTop(); // quanto foi rolada a janela
        var distance = eleTopo-scrlTopo; // distancia da div ao topo da janela
        var altJanela = window.innerHeight; // altura da janela
        if(distance <= altJanela-(eleHeight/(threshold/10))) {
            el.animate({ 'opacity': 1 }, 1200); // 1200 = 1,2 segundo da animação. Quanto menor, mais rápido
        }
    });
});

// Chamando o arquivo assim que o HTML for todo carregado
document.addEventListener('DOMContentLoaded', () => {
    $("#play-gameo").show();
    $("#modal-play").show();
    $("#gameover").hide();

    $("#btn-play").click(function () {
        $("#play-gameo").hide();
        $("#modal-play").hide();
        // Referências
        const dino = document.querySelector('.dino');
        const grid = document.querySelector('.grid');
        const body = document.querySelector('body');

        // Variáveis
        let jumping = false; //Armazena se o dinossauro está ou não pulando
        let gravity = 0.8;
        let gameo = false; //Armazena se o jogo acabou
        let dinopy = 0; //Posição vertical do dinossauro


        var fail = new Audio();
        fail.src = "sounds/fail.wav";

        //Entrada de dados
        document.addEventListener('keyup', jumpcontrol); //Ativada caso aconteça um evento de keyup
        document.addEventListener("click", jump); //Ativada caso aconteça um evento de clique em qualquer lugar da tela

        // Controle do pulo
        function jumpcontrol(e) {
            if (e.keyCode == 32 || e.keyCode == 38) {
                if (!jumping) { //Se não estiver pulando
                    jumping = true;
                    jump();
                }
            }
        }

        function jump() {
            let count = 0;
            //Chamando a função abaixo a cada 20 milisegundos
            let timerId = setInterval(function () {
                // Caindo
                if (count == 15) {
                    clearInterval(timerId); //Encerrando o SetInterval
                    //Controlando o movimento de queda
                    let downTimerId = setInterval(function () {
                        if (count == 0) {
                            clearInterval(downTimerId);
                            jumping = false;
                        }
                        dinopy -= 5;
                        count--;
                        dinopy = dinopy * gravity;
                        dino.style.bottom = dinopy + 'px';
                    }, 20)
                }
                // Subida
                dinopy += 30;
                count++;
                dinopy = dinopy * gravity;
                dino.style.bottom = dinopy + 'px'; // Convertendo a variável para a textura pixel
            }, 20)
        }

        function gerarobst() {
            let randomTime = Math.random() * 5000; //Definindo um tempo aleatório
            let obstaclepx = 2000; //Controlando a posição dos obstáculos
            const obstacle = document.createElement('div'); //Criando os obstáculos

            // Criando cópias
            if (!gameo) { //Se não aconteceu o game over
                obstacle.classList.add('obstacle');
                grid.appendChild(obstacle);
                obstacle.style.left = obstaclepx + 'px'; //Deslocando o obstáculo

                // score++;
                // document.getElementById("pontos").innerHTML = score;

                // Lógica do jogo e movimento dos obstáculos
                let timerId = setInterval(function () {
                    // Colisão com o player
                    if (obstaclepx > 0 && obstaclepx < 60 && dinopy < 60) {
                        clearInterval(timerId);
                        $("#play-gameo").show();
                        $("#gameover").show();
                        fail.play();
                        gameo = true;
                    }
                    obstaclepx -= 10;
                    obstacle.style.left = obstaclepx + 'px'; //Movimento dos obstáculos
                }, 20)

                // Garantindo que os cactos sejam criados e exibidos de maneira aleatória
                if (!gameo) {
                    setTimeout(gerarobst, randomTime)
                }
            }
        }
        gerarobst();
    })
})

function restart(){
    location.reload();
}