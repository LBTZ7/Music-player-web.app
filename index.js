const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const btnPlay = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
      {
        name: "Đi Đi Đi X Nevada",
        singer: "Daniel Mastro",
        path: "./music/ddd.mp3",
        image: "https://i.ytimg.com/vi/Ly4pp6um_mw/hq720.jpg?sqp=-…AFwAcABBg==&rs=AOn4CLDaXzMGQmYp0MKWsgx8druzE7A1xw"
      },
      {
        name: "Mortals",
        singer: "Warriyo - (feat. Laura Brehm)",
        path: "./music/mortal.mp3",
        image:
          "https://i.ytimg.com/vi/yJg-Y5byMMw/hqdefault.jpg?s…AFwAcABBg==&rs=AOn4CLAmKIY6QpyYwke2y20r8AbLNnEQjw"
      },
      {
        name: "Ignite",
        singer: " Worlds 2016 - League of Legends",
        path:
          "./music/ignite.mp3",
        image: "https://i.ytimg.com/vi/Zasx9hjo4WY/hq720.jpg?sqp=-…AFwAcABBg==&rs=AOn4CLBMWttoS_o_MSdYpPMoBbks4VhKbA"
      },
      {
        name: "RISE",
        singer: "Worlds 2018 - League of Legends",
        path: "./music/RISE.mp3",
        image:
          "https://i.ytimg.com/vi/fB8TyLTD7EE/hqdefault.jpg?s…EIYAXABwAEG&rs=AOn4CLCkyy3PPlUM0os4EoQkeJJ5z-dAbw"
      },
      {
        name: "Courtesy Call",
        singer: "Thousand Foot Krutch",
        path: "./music/courtesycall.mp3",
        image:
          "https://i.ytimg.com/vi/ocpDEOXABWg/hq720.jpg?sqp=-…AFwAcABBg==&rs=AOn4CLCak9VBWjDMaTLQLhfCXVo_-Ft6vA"
      },
      {
        name: "Heroes Tonight",
        singer: "Janji",
        path:
          "./music/heroes.mp3",
        image:
          "https://i.ytimg.com/vi/3nQNiWdeH2Q/hqdefault.jpg?s…AFwAcABBg==&rs=AOn4CLA6Ojij-PjYgDJD9nYUQ2dLXf1AHQ"
      },
      {
        name: "Alone",
        singer: "Alan Walker",
        path: "./music/alone.mp3",
        image:
          "https://i.ytimg.com/vi/1-xGerv5FOk/hqdefault.jpg?s…EIYAXABwAEG&rs=AOn4CLAa36fpnFr9xDObXmGz5HxJvDcyKg"
      }
    ],
    setConfigs: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song, index) =>{
          return `
              <div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
                  <div class="thumb" style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
            </div>
          `
        } )
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
          get: function() {
            return this.songs[this.currentIndex];
          }
        })
        
    },
    
    handleEvents: function(){
      const _this = this;
      const cdWidth = cd.offsetWidth;
      // Xử lý CD quay và dừng 
      const cdThumAnimate = cdThumb.animate([
        {transform: 'rotate(360deg)'}
      ], {
        duration: 10000,
        iterations: Infinity
      })
      cdThumAnimate.pause()

        document.onscroll = function(){
          const scrollTop = window.scrollY || document.documentElement.scrollTop;

          const newCdWidth = cdWidth - scrollTop;

          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
          cd.style.opacity = newCdWidth / cdWidth;
        }
        btnPlay.onclick = function(){
          // xu li phat nhac
          if(_this.isPlaying){
            audio.pause();
          } 
          else {
            audio.play();  
          }
        }
        // khi dang play nhac
        audio.onplay = function(){
          _this.isPlaying = true;
          player.classList.add('playing')
          cdThumAnimate.play()
        }
        // khi pause nhac
        audio.onpause = function(){
          _this.isPlaying = false;
          player.classList.remove('playing');
          cdThumAnimate.pause()
        }
        // Khi tiến độ bài hát thay đổi 
        audio.ontimeupdate = function(){
              if(audio.duration){
                const progressPercent = Math.ceil(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
              }
        }
        // Xử lý khi tua xong 
        progress.oninput = function(e) {
          const seekTime = audio.duration / 100 * e.target.value;
          audio.currentTime = seekTime;
        }
        // Khi next song
        nextBtn.onclick = function() {
          if(_this.isRandom){
            _this.playRandomSong();
          }else{
            _this.nextSong();
          }
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
        }
        // Khi prev song
        prevBtn.onclick = function() {
          if(_this.isRandom){
            _this.playRandomSong();
          }else{
            _this.previousSong();
          }
          audio.play();
          _this.render();
          _this.scrollToActiveSong();
        }
        // Khi bật tắt random song
        randomBtn.onclick = function() {
          _this.isRandom = !_this.isRandom;
          _this.setConfigs('isRandom', _this.isRandom);
          randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Khi bật tắt repeat song
        repeatBtn.onclick = function () {
          _this.isRepeat = !_this.isRepeat;
          _this.setConfigs('isRepeat', _this.isRepeat);
          repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // xử lý sau khi song ended
        audio.onended = function() {
          if(_this.isRepeat){
            audio.play();
          }else{
            nextBtn.click();
          }
        }
        // lắng nghe hành vi click vào playlist
        playList.onclick = function(e) {
          const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')) 
            {
                // Xử lý khi click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // Xử lý khi click vào option
                if(e.target.closest('.option')){

                }
            }
        }
    },
    scrollToActiveSong: function() {
      setTimeout(() =>{
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 300)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
      this.isRandom = this.config.isRandom
      this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
          this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    previousSong: function(){
      this.currentIndex--;
      if(this.currentIndex < 0){
        this.currentIndex = this.songs.length - 1;
      }
      this.loadCurrentSong();
    },
    playRandomSong: function(){
      let newIndex;
        do{
          newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function(){
      // load các cònig đã lưu từ trước 
      this.loadConfig();

      // dinh nghia cac thuoc tinh trong object
        this.defineProperties();

        // lang nghe su kien dom
        this.handleEvents();

        // tai thong tin bai hat dau tien vao UI
        this.loadCurrentSong();

        // render bai hat
        this.render();
        
        // Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();