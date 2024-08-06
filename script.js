
    function isMobileDevice() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    if (window.matchMedia("(max-width: 767px)").matches || isMobileDevice()) {
      // Loads mobile.js for devices with a viewport width of 767px or less or for mobile devices
      var script = document.createElement('script');
      script.src = './mobile.js';
      document.head.appendChild(script);
    } else {
      // Loads script.js for devices with a viewport width greater than 767px
      var script = document.createElement('script');
      script.src = './script.js';
      document.head.appendChild(script);
    }

    let highestZ = 1;
    let currentPaperIndex = 0;
    const papers = Array.from(document.querySelectorAll('.paper'));

    function showNextPaper() {
      if (currentPaperIndex < papers.length) {
        papers[currentPaperIndex].classList.remove('visible');
        currentPaperIndex++;
        if (currentPaperIndex < papers.length) {
          papers[currentPaperIndex].classList.add('visible');
        } else {
          document.body.classList.remove('blur');
        }
      }
    }

    class Paper {
      holdingPaper = false;
      mouseTouchX = 0;
      mouseTouchY = 0;
      mouseX = 0;
      mouseY = 0;
      prevMouseX = 0;
      prevMouseY = 0;
      velX = 0;
      velY = 0;
      rotation = Math.random() * 30 - 15;
      currentPaperX = 0;
      currentPaperY = 0;
      rotating = false;

      init(paper) {
        document.addEventListener('mousemove', (e) => {
          if (!this.rotating) {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            this.velX = this.mouseX - this.prevMouseX;
            this.velY = this.mouseY - this.prevMouseY;
          }

          const dirX = e.clientX - this.mouseTouchX;
          const dirY = e.clientY - this.mouseTouchY;
          const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
          const dirNormalizedX = dirX / dirLength;
          const dirNormalizedY = dirY / dirLength;

          const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
          let degrees = 180 * angle / Math.PI;
          degrees = (360 + Math.round(degrees)) % 360;
          if (this.rotating) {
            this.rotation = degrees;
          }

          if (this.holdingPaper) {
            if (!this.rotating) {
              this.currentPaperX += this.velX;
              this.currentPaperY += this.velY;
            }
            this.prevMouseX = this.mouseX;
            this.prevMouseY = this.mouseY;

            paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
          }
        });

        paper.addEventListener('mousedown', (e) => {
          if (e.ctrlKey || e.metaKey) {
            this.rotating = true;
          } else {
            this.rotating = false;
          }
          this.holdingPaper = true;
          this.mouseTouchX = e.clientX;
          this.mouseTouchY = e.clientY;
          paper.style.zIndex = highestZ;
          highestZ++;
        });

        paper.addEventListener('mouseup', () => {
          this.holdingPaper = false;
        });

        paper.addEventListener('click', showNextPaper);
      }
    }

    window.onload = () => {
      papers.forEach((paperElement, index) => {
        if (index === 0) {
          paperElement.classList.add('visible');
        } else {
          paperElement.classList.remove('visible');
        }
        const paper = new Paper();
        paper.init(paperElement);
      });
    };