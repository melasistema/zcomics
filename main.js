(function() {

  const cols = 3;
  const main = document.getElementById('main');
  const parts = [];
  const images = [
      "portfolio/01.jpg",
      "portfolio/02.jpg",
      "portfolio/03.jpg",
      "portfolio/04.jpg",
      "portfolio/05.jpg",
  ];
  let current = 0;
  let playing = false;
  let cursorMoving = false;

  images.forEach(image => new Image().src = image);

  for (let col = 0; col < cols; col++) {
    const part = createPart(images[current], -100/cols*col+'vw');
    main.appendChild(part);
    parts.push(part);
  }

  /**
   *
   * @param imageSrc
   * @param x
   * @returns {HTMLDivElement}
   */
  function createPart(imageSrc, x) {
    const part = document.createElement('div');
    part.className = 'part';
    const el = document.createElement('div');
    el.className = "section";
    const img = document.createElement('img');
    img.src = imageSrc;
    el.appendChild(img);
    part.style.setProperty('--x', x);
    part.appendChild(el);
    return part;
  }

  /**
   * Cursor Pointer and Circle event
   * @param start
   * @param end
   * @param amount
   * @returns {number}
   */
  function lerp(start, end, amount) {
    return (1-amount)*start+amount*end
  }

  const cursor = document.createElement('div');
  cursor.className = 'cursor';

  const cursorF = document.createElement('div');
  cursorF.className = 'cursor-f';
  let cursorX = 0;
  let cursorY = 0;
  let pageX = 0;
  let pageY = 0;
  let size = 8;
  let sizeF = 36;
  let followSpeed = .16;

  document.body.appendChild(cursor);
  document.body.appendChild(cursorF);

  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    cursorF.style.display = 'none';
  }

  cursor.style.setProperty('--size', size+'px');
  cursorF.style.setProperty('--size', sizeF+'px');

  window.addEventListener('mousemove', function(e) {
    pageX = e.clientX;
    pageY = e.clientY;
    cursor.style.left = e.clientX-size/2+'px';
    cursor.style.top = e.clientY-size/2+'px';
  });

  /**
   * Cursor Follow
   */
  function loop() {
    cursorX = lerp(cursorX, pageX, followSpeed);
    cursorY = lerp(cursorY, pageY, followSpeed);
    cursorF.style.top = cursorY - sizeF/2 + 'px';
    cursorF.style.left = cursorX - sizeF/2 + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  // Rollover UP & Down Mouse Wheel Navigation
  let animOptions = {
    duration: 0.7,
    ease: Power4.easeInOut
  };
  /**
   *
   * @param dir
   */
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

  /**
   * Press Up & Down Keyboard Arrow Event
   */
  window.addEventListener('keydown', function(e) {
    if(['ArrowDown', 'ArrowRight'].includes(e.key)){
      go(1);
    }

    else if(['ArrowUp', 'ArrowLeft'].includes(e.key)){
      go(-1);
    }
  });

  // Cursor Invent Target Touches
  let startY;
  let endY;
  let clicked = false;

  function mousedown(e) {
    gsap.to(cursor, {scale: 4.5});
    gsap.to(cursorF, {scale: .4});

    clicked = true;
    startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
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

  // Define an autoplay interval
  let autoplayInterval = null;
  const autoplayDelay = 4500; // 4,5 seconds

// Start autoplay when the page loads
  window.addEventListener('load', function() {
    autoplayInterval = setInterval(function() {
      go(1); // Move the slider forward
    }, autoplayDelay);
  });


  // Stop autoplay when the user interacts with the slider
  window.addEventListener('mousedown', function(e) {
    clearInterval(autoplayInterval); // Stop autoplay
    mousedown(e); // Call your existing mousedown function
  }, false);

  window.addEventListener('touchstart', function(e) {
    clearInterval(autoplayInterval); // Stop autoplay
    mousedown(e); // Call your existing touchstart function
  }, false);

  window.addEventListener('touchmove', function(e) {
    if (clicked) {
      endY = e.touches[0].clientY || e.targetTouches[0].clientY;
    }
  }, false);

// Restart autoplay when the user stops interacting with the slider
  window.addEventListener('touchend', function(e) {
    autoplayInterval = setInterval(function() {
      go(1); // Move the slider forward
    }, autoplayDelay);
    mouseup(e); // Call your existing touchend function
  }, false);

  window.addEventListener('mouseup', function(e) {
    autoplayInterval = setInterval(function() {
      go(1); // Move the slider forward
    }, autoplayDelay);
    mouseup(e); // Call your existing mouseup function
  }, false);



  /**
   * Mouse Wheel Scroll Transition
   */
  let scrollTimeout;
  function wheel(e) {
    clearTimeout(scrollTimeout);
    setTimeout(function() {
      if (e.deltaY < -40) {
        go(-1);
      }
      else if (e.deltaY >= 40) {
        go(1);
      }
    })
  }

  window.addEventListener('mousewheel', wheel, false);
  window.addEventListener('wheel', wheel, false);

})();
