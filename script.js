let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let selectedNumber = null;
let isGameOver = false;

// Three.js setup for 3D animations
const batScene = new THREE.Scene();
const ballScene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const batRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const ballRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// Set up renderers
batRenderer.setSize(120, 120);
ballRenderer.setSize(120, 120);
document.getElementById('bat-container').appendChild(batRenderer.domElement);
document.getElementById('ball-container').appendChild(ballRenderer.domElement);

// Create colorful materials
const batMaterial = new THREE.MeshPhongMaterial({
    color: 0x4ecdc4,
    shininess: 100,
    specular: 0xffffff
});

const ballMaterial = new THREE.MeshPhongMaterial({
    color: 0xff6b6b,
    shininess: 100,
    specular: 0xffffff
});

// Create 3D objects
const batGeometry = new THREE.BoxGeometry(1, 4, 0.2);
const bat = new THREE.Mesh(batGeometry, batMaterial);

const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ball = new THREE.Mesh(ballGeometry, ballMaterial);

// Add lights
const addLighting = (scene) => {
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    const ambientLight = new THREE.AmbientLight(0x404040);
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    
    pointLight.position.set(0, 0, 10);
    spotLight.position.set(5, 5, 5);
    
    scene.add(pointLight);
    scene.add(ambientLight);
    scene.add(spotLight);
};

addLighting(batScene);
addLighting(ballScene);

// Add objects to scenes
batScene.add(bat);
ballScene.add(ball);

// Position camera
camera.position.z = 5;

// Colorful animation function
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Bat animation
    bat.rotation.z = Math.sin(time) * 0.3;
    bat.position.y = Math.sin(time * 2) * 0.2;
    
    // Ball animation
    ball.rotation.y = time;
    ball.rotation.x = time * 0.5;
    ball.position.y = Math.sin(time * 2) * 0.2;
    
    batRenderer.render(batScene, camera);
    ballRenderer.render(ballScene, camera);
}
animate();

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d', '#ffbe0b'];
    const confettiCount = 100;
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.body.appendChild(celebration);

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        celebration.appendChild(confetti);
    }

    setTimeout(() => {
        document.body.removeChild(celebration);
    }, 3000);
}

function selectNumber(num) {
    if (isGameOver) return;
    
    document.querySelectorAll('.number-buttons button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = document.querySelector(`.number-buttons button:nth-child(${num})`);
    selectedBtn.classList.add('selected');
    selectedNumber = num;
}

function playTurn() {
    if (isGameOver || selectedNumber === null) return;

    const computerNumber = Math.floor(Math.random() * 6) + 1;
    
    if (selectedNumber === computerNumber) {
        // Out!
        Swal.fire({
            title: 'You\'re Out! 🎯',
            html: `<div class="result-display">
                    <h3>Your Number: ${selectedNumber}</h3>
                    <h3>Computer's Number: ${computerNumber}</h3>
                   </div>`,
            icon: 'error',
            confirmButtonText: 'Next Player',
            showClass: {
                popup: 'animate__animated animate__bounceIn'
            },
            hideClass: {
                popup: 'animate__animated animate__bounceOut'
            }
        });

        if (currentPlayer === 1) {
            currentPlayer = 2;
            document.getElementById('current-player').textContent = "Player 2's Turn";
        } else {
            endGame();
            return;
        }
    } else {
        // Add score
        if (currentPlayer === 1) {
            player1Score += selectedNumber;
            document.getElementById('player1-score').textContent = player1Score;
        } else {
            player2Score += selectedNumber;
            document.getElementById('player2-score').textContent = player2Score;
        }

        // Show score update
        Swal.fire({
            title: 'Great Shot! 🏏',
            html: `<div class="result-display">
                    <h3>Your Number: ${selectedNumber}</h3>
                    <h3>Computer's Number: ${computerNumber}</h3>
                    <h2>+${selectedNumber} runs!</h2>
                   </div>`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }

    // Reset selection
    selectedNumber = null;
    document.querySelectorAll('.number-buttons button').forEach(btn => {
        btn.classList.remove('selected');
    });
}

function endGame() {
    isGameOver = true;
    const winner = player1Score > player2Score ? 'Player 1' : 'Player 2';
    
    if (player1Score > player2Score) {
        createConfetti();
        Swal.fire({
            title: '🎉 Congratulations! 🎉',
            html: `<div class="result-display">
                    <h2>${winner} Wins!</h2>
                    <h3>Player 1: ${player1Score} runs</h3>
                    <h3>Player 2: ${player2Score} runs</h3>
                   </div>`,
            icon: 'success',
            confirmButtonText: 'Play Again',
            showClass: {
                popup: 'animate__animated animate__jackInTheBox'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                resetGame();
            }
        });
    } else {
        Swal.fire({
            title: 'Game Over! 🏆',
            html: `<div class="result-display">
                    <h2>${winner} Wins!</h2>
                    <h3>Player 1: ${player1Score} runs</h3>
                    <h3>Player 2: ${player2Score} runs</h3>
                   </div>`,
            icon: 'info',
            confirmButtonText: 'Play Again',
            showClass: {
                popup: 'animate__animated animate__jackInTheBox'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                resetGame();
            }
        });
    }
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    selectedNumber = null;
    isGameOver = false;
    
    document.getElementById('player1-score').textContent = '0';
    document.getElementById('player2-score').textContent = '0';
    document.getElementById('current-player').textContent = "Player 1's Turn";
    
    document.querySelectorAll('.number-buttons button').forEach(btn => {
        btn.classList.remove('selected');
    });
}
