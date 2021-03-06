document.addEventListener('DOMContentLoaded', () => {
   //Tabs
   const tabs = document.querySelectorAll('.tabheader__item'),
      tabsContent = document.querySelectorAll('.tabcontent'),
      tabsParent = document.querySelector('.tabheader__items');

   function hideTabsContent() {
      tabsContent.forEach(item => {
         item.classList.add('hide');
         item.classList.remove('show', 'fade');
      });

      tabs.forEach(item => {
         item.classList.remove('tabheader__item_active');
      });
   }

   function showTabsContent(i = 0) {
      tabsContent[i].classList.add('show', 'fade');
      tabsContent[i].classList.remove('hide');
      tabs[i].classList.add('tabheader__item_active');
   }

   hideTabsContent();
   showTabsContent();

   tabsParent.addEventListener('click', (event) => {
      const target = event.target;

      if (target && target.classList.contains('tabheader__item')) {
         tabs.forEach((item, i) => {
            if (target == item) {
               hideTabsContent();
               showTabsContent(i);
            }
         });
      }
   });
   //Timer

   const deadline = "2020-12-31";

   let getTimeRemaining = (endtime) => {
      const t = Date.parse(endtime) - Date.parse(new Date()),
         days = Math.floor(t / (1000 * 60 * 60 * 24)),
         hours = Math.floor((t / (1000 * 60 * 60) % 24)),
         minutes = Math.floor((t / 1000 / 60) % 60),
         seconds = Math.floor((t / 1000) % 60);

      return {
         'total': t,
         'days': days,
         'hours': hours,
         'minutes': minutes,
         'seconds': seconds
      };
   };

   let getZero = (num) => {
      if (num >= 0 && num < 10) {
         return `0${num}`;
      } else {
         return num;
      }
   };

   let setClock = (selector, endtime) => {
      const timer = document.querySelector(selector),
         days = timer.querySelector('#days'),
         hours = timer.querySelector('#hours'),
         minutes = timer.querySelector('#minutes'),
         seconds = timer.querySelector('#seconds'),
         timeInterval = setInterval(updateClock, 1000);

      updateClock();

      function updateClock() {
         const t = getTimeRemaining(endtime);

         days.innerHTML = getZero(t.days);
         hours.innerHTML = getZero(t.hours);
         minutes.innerHTML = getZero(t.minutes);
         seconds.innerHTML = getZero(t.seconds);

         if (t.total <= 0) {
            clearInterval(timeInterval);
         }
      }
   };

   setClock('.timer', deadline);

   //Modal Call Window

   const modalOpen = document.querySelectorAll('[data-modal]'),
      modal = document.querySelector('.modal'),
      pageHeight = document.documentElement.scrollHeight;

   let openModalFunc = () => {
      modal.classList.add('show');
      // modal.classList.toggle('show');
      document.body.style.overflow = 'hidden';
      modal.classList.remove('hide');
      clearInterval(modalTimer);
   };

   let closeModalFunc = () => {
      modal.classList.add('hide');
      modal.classList.remove('show');
      // modal.classList.toggle('show');
      document.body.style.overflow = '';
   };

   let showModalByScroll = () => {
      if (window.pageYOffset + document.documentElement.clientHeight >= pageHeight) {
         openModalFunc();
         window.removeEventListener('scroll', showModalByScroll);
      }
   };

   const modalTimer = setTimeout(openModalFunc, 50000);

   window.addEventListener('scroll', showModalByScroll);

   modalOpen.forEach(btn => {
      btn.addEventListener('click', openModalFunc);
   });

   modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.getAttribute('data-close') === '') {
         closeModalFunc();
      }
   });

   document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && modal.classList.contains('show')) {
         closeModalFunc();
      }
   });

   // используем Классы для карточек 

   class MenuCard {
      constructor(img, aleterImg, title, descr, price, parentSelector, ...classes) {
         this.img = img;
         this.aleterImg = aleterImg;
         this.title = title;
         this.descr = descr;
         this.price = price;
         this.classes = classes;
         this.parent = document.querySelector(parentSelector);
         this.tranfer = 27;
         this.changeCurrency();

      }
      changeCurrency() {
         this.price = this.price * this.tranfer;
      }
      render() {
         const element = document.createElement('div');
         if (this.classes.length === 0) {
            element.classList.add('menu__item');
         } else {
            this.classes.forEach(className => element.classList.add(className));
         }
         element.innerHTML = `
            <img src=${this.img} alt=${this.aleterImg}>
            <h3 class="menu__item-subtitle">${this.title}</h3>
            <div class="menu__item-descr">${this.descr}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
               <div class="menu__item-cost">Цена:</div>
               <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
            </div>
         `;
         this.parent.append(element);
      }
   }

   const getResourse = async (url) => {
      const res = await fetch(url);

      if (!res.ok) {
         throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }

      return await res.json();
   };

   axios.get('http://localhost:3000/menu')
       .then(data => {
         data.data.forEach(({img, altimg, title, descr, price}) => {
            new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
         });
      });

   // getResourse('http://localhost:3000/menu')
   //    .then(data => {
   //       data.forEach(({img, altimg, title, descr, price}) => {
   //          new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
   //       });
   //    });



   // Без Шаблонизации для "постройки" один раз:

   // getResourse('http://localhost:3000/menu')
   //    .then(data => createCard(data));

   // function createCard (data) {
   //    data.forEach(({img, altimg, title, descr, price}) => {
   //       const element = document.createElement('div');
   //          price = price * 27; // or put a function here
   //       element.classList.add('menu__item');

   //       element.innerHTML = `
   //          <img src=${img} alt=${altimg}>
   //          <h3 class="menu__item-subtitle">${title}</h3>
   //          <div class="menu__item-descr">${descr}</div>
   //          <div class="menu__item-divider"></div>
   //          <div class="menu__item-price">
   //             <div class="menu__item-cost">Цена:</div>
   //             <div class="menu__item-total"><span>${price}</span> грн/день</div>
   //          </div>
   //       `;

   //       document.querySelector('.menu .container').append(element);
   //    });
   // }

   //Forms

   const message = {
      loading: 'img/form/spinner.svg',
      success: 'We will call You soon!',
      failure: 'error'
   };

   const forms = document.querySelectorAll('form');

   forms.forEach(item => {
      bindPostData(item);
   });

   const postData = async (url, data) => {
      const res = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-type': 'application/json'
         },
         body: data
      });

      return await res.json();
   };

   function bindPostData(form) {
      form.addEventListener('submit', (e) => {
         e.preventDefault();

         const statusMessage = document.createElement('img');

         statusMessage.src = message.loading;
         statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;  
         `;
         form.insertAdjacentElement('afterend', statusMessage);

         const formData = new FormData(form);

         // fetch('server.php', {
         //    method: 'POST',
         //    body: formData
         // }).then(data => data.text())
         // .then(data =>{
         //    console.log(data);
         //    showThanksModal(message.success);
         //    statusMessage.remove();
         // })
         // .catch(() => {
         //    showThanksModal(message.failure);
         // })
         // .finally(() => {
         //    form.reset();
         // });

         // For JSON request 

         const json = JSON.stringify(Object.fromEntries(formData.entries()));

         postData('http://localhost:3000/requests', json)
            .then(data => {
               console.log(data);
               showThanksModal(message.success);
               statusMessage.remove();
            })
            .catch(() => {
               showThanksModal(message.failure);
            })
            .finally(() => {
               form.reset();
            });
         /* */
      });
   }

   function showThanksModal(message) {
      const prevModal = document.querySelector('.modal__dialog');

      prevModal.classList.add('hide');
      openModalFunc();

      const thanksWrapper = document.createElement('div');

      thanksWrapper.classList.add('modal__dialog');
      thanksWrapper.innerHTML = `
         <div class="modal__content">
            <div  class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
         </div>
      `;

      document.querySelector('.modal').append(thanksWrapper);
      setTimeout(() => {
         thanksWrapper.remove();
         prevModal.classList.add('show');
         prevModal.classList.remove('hide');
         closeModalFunc();
      }, 5000);
   }

   // Sliders
   const slides = document.querySelectorAll('.offer__slide'),
         slider = document.querySelector('.offer__slider'),
         prev = document.querySelector('.offer__slider-prev'),
         next = document.querySelector('.offer__slider-next'),
         current = document.querySelector('#current'),
         total = document.querySelector('#total'),
         slidesWrapper = document.querySelector('.offer__slider-wrapper'),
         slidesField = document.querySelector('.offer__slider-inner'),
         width = window.getComputedStyle(slidesWrapper).width;
         
   let slideIndex = 1;
   let offset = 0;

   if(slides.length < 10) {
      total.textContent ='0'+ slides.length;
      // total.textContent = `0${slides.length}`;
   } else {
      total.textContent = slides.length;
   }

   currentSlide();

   slidesField.style.width = 100 * slides.length + '%';
   slidesField.style.display = 'flex';
   slidesField.style.transition = '0.5s all';

   slidesWrapper.style.overflow = 'hidden';


   slides.forEach(slide => {
      slide.style.width = width;      
   });

   slider.style.position = 'relative';

   const indicators = document.createElement('ol'),
         dots = [];
   indicators.classList.add('carousel-indicators');
   // indicators.style.cssText =`
   //    position: absolute;
   //    right: 0;
   //    bottom: 0;
   //    left: 0;
   //    z-index: 15;
   //    display: flex;
   //    justify-content: center;
   //    margin-right: 15%;
   //    margin-left: 15%;
   //    list-style: none;
   // `;

   slider.append(indicators);

   for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement('li');

      dot.setAttribute('data-slide-to', i+1);
      dot.classList.add('dot');
      indicators.append(dot);
      dots.push(dot);
   }
   
   aciveDot();

   next.addEventListener('click', () => {
      if(offset == delNoDig(width) * (slides.length - 1)) {
         offset = 0;
      } else {
         offset += delNoDig(width);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if(slideIndex == slides.length) {
         slideIndex = 1;
      } else {
         slideIndex ++;
      }

      currentSlide();
      aciveDot();
   });

   prev.addEventListener('click', () => {
      if(offset == 0) {
         offset = delNoDig(width) * (slides.length - 1);
      } else {
         offset -= delNoDig(width);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if(slideIndex == 1) {
         slideIndex = slides.length;
      } else {
         slideIndex --;
      }

      currentSlide();
      aciveDot();
   });

   dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
         const slideTo = e.target.getAttribute('data-slide-to');
         
         slideIndex = slideTo;
         offset = delNoDig(width) * (slideTo - 1);
         slidesField.style.transform = `translateX(-${offset}px)`;

         currentSlide();
         aciveDot();
      });
   });

   function aciveDot(){
      dots.forEach(dot => dot.style.opacity = '.5');
      dots[slideIndex-1].style.opacity = 1; 
   }

   function currentSlide(){
      if(slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
   }

   function delNoDig (str) {
      return +str.replace(/\D/g, '');
   }


   // showSlides(slideIndex);

   // function showSlides(i){
   //    if (i > slides.length) {
   //       slideIndex = 1;
   //    }
   //    if (i < 1) {
   //       slideIndex = slides.length;
   //    }
   //    slides.forEach(slide => slide.style.display = 'none');
   //    slides[slideIndex-1].style.display = 'block';

   //    if(slides.length < 10) {
   //       current.textContent ='0'+ slideIndex;
   //       // current.textContent = `0${slideIndex}`;
   //    } else {
   //       current.textContent = slideIndex;
   //    }
   // }

   // function plusSlides (i) {
   //    showSlides(slideIndex += i);
   // }

   // prev.addEventListener('click', () => {
   //    plusSlides(-1);
   // });

   // next.addEventListener('click', () => {
   //    plusSlides(1);
   // });

   // if(slides.length < 10) {
   //    total.textContent ='0'+ slides.length;
   // } else {
   //    total.textContent = slides.length;
   // }

// Calc

   const result = document.querySelector('.calculating__result span');
   let sex = 'female',
       height, weight, age,
       ratio = 1.2;

   function calcTotal() {
      if(!sex || !height || !weight || !age || !ratio){
         result.textContent = '____';
         return;
      }

      if(sex == 'female') {
         result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
      } else {
         result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
      }
   }

   calcTotal();

   function getStaticInfo (parentSelector, activeClass) {
      const elements = document.querySelectorAll(`${parentSelector} div`);

      elements.forEach(elem => {
         elem.addEventListener('click', (e) => {
            if(e.target.getAttribute('data-ratio')){
               ratio = +e.target.getAttribute('data-ratio');
            } else {
               sex = e.target.getAttribute('id');
            }
   
            elements.forEach(elem => {
               elem.classList.remove(activeClass);
            });
            e.target.classList.add(activeClass);
    
            calcTotal();
         });
      });
   }

   getStaticInfo('#gender', 'calculating__choose-item_active');
   getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

   function getDynamicInfo (selector) {
      const input = document.querySelector(selector);

      input.addEventListener('input', () => {
         switch (input.getAttribute('id')) {
            case 'height':
               height = +input.value;
               break;
            case 'weight':
               weight = +input.value;
               break;
            case 'age':
               age = +input.value;
               break; 
         }
         calcTotal();
      });
   }

   getDynamicInfo('#height');
   getDynamicInfo('#weight');
   getDynamicInfo('#age');
}); 