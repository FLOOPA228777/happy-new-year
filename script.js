// Основной скрипт для новогодней открытки

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех компонентов
    initSnowflakes();
    initTimer();
    initInteractiveElements();
    initControls();
    
    console.log('Новогодняя открытка загружена! Наслаждайтесь!');
});

// 1. Снежинки на фоне
function initSnowflakes() {
    const snowflakesContainer = document.getElementById('snowflakes');
    const snowflakeCount = 100;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Случайные параметры для снежинки
        const size = Math.random() * 5 + 3;
        const left = Math.random() * 100;
        const opacity = Math.random() * 0.7 + 0.3;
        const animationDuration = Math.random() * 10 + 5;
        const animationDelay = Math.random() * 5;
        
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${left}%`;
        snowflake.style.opacity = opacity;
        snowflake.style.animationDuration = `${animationDuration}s`;
        snowflake.style.animationDelay = `${animationDelay}s`;
        
        snowflakesContainer.appendChild(snowflake);
    }
}

// 2. Таймер до Нового года
function initTimer() {
    function updateTimer() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const newYear = new Date(`January 1, ${currentYear + 1} 00:00:00`);
        
        const diff = newYear - now;
        
        // Расчет дней, часов, минут и секунд
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Обновление элементов на странице
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        // Эффект пульсации в последние 10 секунд каждой минуты
        if (seconds <= 10) {
            document.getElementById('seconds').style.color = '#FF0000';
            document.getElementById('seconds').style.textShadow = '0 0 15px #FF0000';
        } else {
            document.getElementById('seconds').style.color = '#FF4500';
            document.getElementById('seconds').style.textShadow = '0 0 10px rgba(255, 69, 0, 0.7)';
        }
    }
    
    // Запуск таймера
    updateTimer();
    setInterval(updateTimer, 1000);
}

// 3. Интерактивные элементы с кликами
function initInteractiveElements() {
    const interactiveElements = document.querySelectorAll('.interactive-element');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Анимация клика
            this.classList.add('active');
            setTimeout(() => {
                this.classList.remove('active');
            }, 500);
            
            // Воспроизведение звука
            const soundType = this.getAttribute('data-sound');
            playSound(`${soundType}Sound`);
        });
    });
}

// 4. Управление музыкой и кнопками
function initControls() {
    // Кнопка включения/выключения музыки
    const musicBtn = document.getElementById('musicBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');
    let musicPlaying = false;
    
    // Предварительная загрузка музыки для корректной работы
    backgroundMusic.load();
    
    // Добавляем обработчик клика на всю страницу для активации аудио
    document.addEventListener('click', function activateAudio() {
        // Удаляем этот обработчик после первого клика
        document.removeEventListener('click', activateAudio);
        
        // Пробуем воспроизвести музыку тихо и сразу паузим
        backgroundMusic.volume = 0;
        backgroundMusic.play().then(() => {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
            backgroundMusic.volume = 1;
        }).catch(e => {
            console.log("Предварительная активация аудио не удалась");
        });
    }, { once: true });
    
    musicBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (!musicPlaying) {
            // Пробуем воспроизвести музыку
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Успешное воспроизведение
                    musicPlaying = true;
                    updateMusicButton();
                    
                    // Анимация кнопки
                    animateButton(this);
                }).catch(error => {
                    // Если воспроизведение заблокировано, показываем инструкцию
                    console.log("Воспроизведение заблокировано:", error);
                    showMusicInstruction(this);
                });
            }
        } else {
            // Останавливаем музыку
            backgroundMusic.pause();
            musicPlaying = false;
            updateMusicButton();
            
            // Анимация кнопки
            animateButton(this);
        }
    });
    
    // Функция для обновления вида кнопки музыки
    function updateMusicButton() {
        if (musicPlaying) {
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i> Выключить музыку';
            musicBtn.classList.add('active');
        } else {
            musicBtn.innerHTML = '<i class="fas fa-music"></i> Включить музыку';
            musicBtn.classList.remove('active');
        }
    }
    
    // Функция для показа инструкции
    function showMusicInstruction(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-hand-pointer"></i> Кликните еще раз';
        button.classList.add('active');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('active');
        }, 2000);
    }
    
    // Кнопка запуска фейерверка
    document.getElementById('fireworksBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        
        launchFireworks();
        playSound('fireworkSound');
        
        // Анимация кнопки
        animateButton(this);
    });
    
    // Кнопка "Все звуки разом"
    document.getElementById('allSoundsBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Последовательно воспроизводим все звуки
        playSoundSequence();
        
        // Анимация кнопки
        animateButton(this);
    });
}

// 5. Функция воспроизведения звука
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    
    if (sound) {
        // Сбрасываем время воспроизведения
        sound.currentTime = 0;
        
        // Пробуем воспроизвести
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log(`Не удалось воспроизвести звук ${soundId}:`, error);
                
                // Если звук не воспроизводится, пробуем загрузить его снова
                sound.load();
                
                // Показываем пользователю подсказку
                showSoundError(soundId);
            });
        }
    }
}

// 6. Функция для последовательного воспроизведения всех звуков
function playSoundSequence() {
    const sounds = ['bellSound', 'snowflakeSound', 'giftSound', 'treeSound'];
    const elements = document.querySelectorAll('.interactive-element');
    
    // Анимируем все элементы по очереди
    sounds.forEach((soundId, index) => {
        setTimeout(() => {
            if (index < elements.length) {
                // Анимация элемента
                elements[index].classList.add('active');
                setTimeout(() => {
                    elements[index].classList.remove('active');
                }, 500);
                
                // Воспроизведение звука
                playSound(soundId);
            }
        }, index * 600); // Интервал между звуками
    });
    
    // Запускаем фейерверк в конце
    setTimeout(() => {
        launchFireworks();
        playSound('fireworkSound');
    }, sounds.length * 600);
}

// 7. Фейерверк
function launchFireworks() {
    const effectsContainer = document.querySelector('.effects-container');
    if (!effectsContainer) return;
    
    // Очищаем старые фейерверки
    const oldFireworks = effectsContainer.querySelectorAll('.firework');
    oldFireworks.forEach(fw => fw.remove());
    
    // Создаем новые фейерверки
    const fireworkCount = 12;
    
    for (let i = 0; i < fireworkCount; i++) {
        setTimeout(() => {
            createFireworkParticle(effectsContainer);
        }, i * 150);
    }
}

function createFireworkParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('firework');
    
    // Случайная позиция
    const left = Math.random() * 80 + 10;
    const top = Math.random() * 80 + 10;
    
    // Случайный цвет
    const colors = ['#FF4500', '#FFD700', '#1E90FF', '#32CD32', '#8A2BE2', '#FF1493'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.left = `${left}%`;
    particle.style.top = `${top}%`;
    particle.style.backgroundColor = color;
    
    container.appendChild(particle);
    
    // Размер фейерверка
    const size = Math.random() * 40 + 20;
    
    // Анимация
    const animation = particle.animate([
        { 
            width: '5px', 
            height: '5px', 
            opacity: 0,
            transform: 'scale(0)'
        },
        { 
            width: `${size}px`, 
            height: `${size}px`, 
            opacity: 1,
            transform: 'scale(1)'
        },
        { 
            width: '0px', 
            height: '0px', 
            opacity: 0,
            transform: 'scale(0)'
        }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });
    
    // Удаляем после анимации
    animation.onfinish = () => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    };
}

// 8. Вспомогательные функции
function animateButton(button) {
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 300);
}

function showSoundError(soundId) {
    // Можно добавить уведомление для пользователя
    console.log(`Проблема с воспроизведением звука: ${soundId}`);
    
    // Временное уведомление в консоли
    const originalTitle = document.title;
    document.title = "✨ Кликните на страницу!";
    
    setTimeout(() => {
        document.title = originalTitle;
    }, 1000);
}

// 9. Автозапуск музыки после взаимодействия с пользователем
// (Опционально - можно убрать, если не нужно)
let userInteracted = false;

document.addEventListener('click', function() {
    if (!userInteracted) {
        userInteracted = true;
        
        // Можно автоматически включить музыку после первого клика
        // const musicBtn = document.getElementById('musicBtn');
        // if (musicBtn) {
        //     setTimeout(() => {
        //         musicBtn.click();
        //     }, 1000);
        // }
    }
});