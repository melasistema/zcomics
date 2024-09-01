(function() {
  // Constants and variables
  const cols = 3;
  const images = [
    "portfolio/01.jpg",
    "portfolio/02.jpg",
    "portfolio/03.jpg",
    "portfolio/04.jpg",
    "portfolio/05.jpg",
    "portfolio/06.jpg",
    "portfolio/07.jpg",
    "portfolio/08.jpg",
    "portfolio/09.jpg",
    "portfolio/10.jpg",
    "portfolio/11.jpg",
    "portfolio/12.jpg",
    "portfolio/13.jpg",
    "portfolio/14.jpg",
    "portfolio/15.jpg",
    "portfolio/16.jpg",
    "portfolio/17.jpg",
    "portfolio/18.jpg",
    "portfolio/19.jpg",
    "portfolio/20.jpg",
    "portfolio/21.jpg",
    "portfolio/22.jpg",
    "portfolio/23.jpg",
    "portfolio/24.jpg",
    "portfolio/25.jpg",
    "portfolio/26.jpg",
    "portfolio/27.jpg",
    "portfolio/28.jpg",
    "portfolio/29.jpg",
    "portfolio/30.jpg",
    "portfolio/31.jpg",
    "portfolio/32.jpg",
    "portfolio/33.jpg",
    "portfolio/34.jpg",
    "portfolio/35.jpg",
    "portfolio/36.jpg",
  ];
  const main = document.getElementById('main');
  const parts = [];
  let current = 0;
  let playing = false;
  let cursorX = 0;
  let cursorY = 0;
  let pageX = 0;
  let pageY = 0;
  let size = 8;
  let sizeF = 36;
  let followSpeed = .16;
  let startY;
  let endY;
  let clicked = false;
  let autoplayInterval = null;
  const autoplayDelay = 4500; // 4,5 seconds
  let scrollTimeout;
  let animOptions = {
    duration: 1.2,
    ease: Power4.easeInOut
  };

  // Preload images
  images.forEach(image => new Image().src = image);

  // Create parts
  for (let col = 0; col < cols; col++) {
    const part = createPart(images[current], -100/cols*col+'vw');
    main.appendChild(part);
    parts.push(part);
  }

  // Create cursor
  const cursor = createCursor('cursor', size);
  const cursorF = createCursor('cursor-f', sizeF);

  // Event listeners
  window.addEventListener('mousemove', updateCursorPosition);
  window.addEventListener('keydown', handleKeydown);
 /* window.addEventListener('click', playMusicAfterDelay);*/
  window.addEventListener('load', startAutoplay);
  window.addEventListener('mousedown', handleMousedown);
  window.addEventListener('touchstart', handleTouchstart);
  window.addEventListener('touchmove', handleTouchmove);
  window.addEventListener('touchend', handleTouchend);
  window.addEventListener('mouseup', handleMouseup);
  window.addEventListener('mousewheel', handleWheel);
  window.addEventListener('wheel', handleWheel);

  // Functions
  function createPart(imageSrc, x) {
    const part = document.createElement('div');
    part.className = 'part';
    const el = document.createElement('div');
    el.className = "section";
    const img = document.createElement('img');
    img.src = imageSrc;
    img.loading = "lazy"; // Ensure lazy loading
    el.appendChild(img);
    part.style.setProperty('--x', x);
    part.appendChild(el);
    return part;
  }

  function createCursor(className, size) {
    const cursor = document.createElement('div');
    cursor.className = className;
    cursor.style.setProperty('--size', size+'px');
    document.body.appendChild(cursor);
    if ('ontouchstart' in window) {
      cursor.style.display = 'none';
    }
    return cursor;
  }

  function lerp(start, end, amount) {
    return (1-amount)*start+amount*end
  }

  function loop() {
    cursorX = lerp(cursorX, pageX, followSpeed);
    cursorY = lerp(cursorY, pageY, followSpeed);
    cursorF.style.top = cursorY - sizeF/2 + 'px';
    cursorF.style.left = cursorX - sizeF/2 + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  window.go = function(dir) {
    if (!playing) {
      playing = true;
      if (current + dir < 0) current = images.length - 1;
      else if (current + dir >= images.length) current = 0;
      else current += dir;

      function up(part, next) {
        part.appendChild(next);
        gsap.to(part, {...animOptions, y: -window.innerHeight}).then(function () {
          part.children[0].remove();
          gsap.to(part, {duration: 0, y: 0});
        })
      }

      function down(part, next) {
        part.prepend(next);
        gsap.to(part, {duration: 0, y: -window.innerHeight});
        gsap.to(part, {...animOptions, y: 0}).then(function () {
          part.children[1].remove();
          playing = false;
        })
      }

      for (let p in parts) {
        let part = parts[p];
        let next = document.createElement('div');
        next.className = 'section';
        let img = document.createElement('img');
        img.src = images[current];
        next.appendChild(img);

        if ((p - Math.max(0, dir)) % 2) {
          down(part, next);
        } else {
          up(part, next);
        }
      }
    }
  }

  function updateCursorPosition(e) {
    pageX = e.clientX;
    pageY = e.clientY;
    cursor.style.left = e.clientX-size/1+'px';
    cursor.style.top = e.clientY-size/1+'px';
  }

  function handleKeydown(e) {
    if(['ArrowDown', 'ArrowRight'].includes(e.key)){
      go(1);
    } else if(['ArrowUp', 'ArrowLeft'].includes(e.key)){
      go(-1);
    }
  }

  function handleMousedown(e) {
    clearInterval(autoplayInterval); // Stop autoplay
    gsap.to(cursor, {scale: 1.1});
    gsap.to(cursorF, {scale: 0.8});
    clicked = true;
    startY = e.clientY;
  }

  function handleTouchstart(e) {
    clearInterval(autoplayInterval); // Stop autoplay
    gsap.to(cursor, {scale: 4.5});
    gsap.to(cursorF, {scale: .4});
    clicked = true;
    startY = e.touches[0].clientY || e.targetTouches[0].clientY;
  }

  function handleTouchmove(e) {
    if (clicked) {
      endY = e.touches[0].clientY || e.targetTouches[0].clientY;
    }
  }

  function handleTouchend(e) {
    autoplayInterval = setInterval(function() {
      go(1); // Move the slider forward
    }, autoplayDelay);
    mouseup(e);
  }

  function handleMouseup(e) {
    autoplayInterval = setInterval(function() {
      go(1); // Move the slider forward
    }, autoplayDelay);
    mouseup(e);
  }

  function mouseup(e) {
    gsap.to(cursor, {scale: 1});
    gsap.to(cursorF, {scale: 1});
    endY = e.clientY || endY;
    if (clicked && startY && Math.abs(startY - endY) >= 40) {
      go(!Math.min(0, startY - endY)?1:-1);
      clicked = false;
      startY = null;
      endY = null;
    }
  }

  function PlayMusic() {
    let play = document.getElementById("music");
    play.play();
  }

  function playMusicAfterDelay() {
    setTimeout(PlayMusic, 500);
  }

  function startAutoplay() {
    autoplayInterval = setInterval(function() {
      go(1); // Move the slider forward
      // Google Chrome Blocked Autoplay
      // setTimeout(PlayMusic, 1000);
    }, autoplayDelay);
  }

  function handleWheel(e) {
    clearTimeout(scrollTimeout);
    setTimeout(function() {
      if (e.deltaY < -40) {
        go(-1);
        // Google Chrome Blocked Autoplay
        // setTimeout(PlayMusic, 1000);
      }
      else if (e.deltaY >= 40) {
        go(1);
        // Google Chrome Blocked Autoplay
        // setTimeout(PlayMusic, 1000);
      }
    })
  }
})();