const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

// Reveal-on-scroll
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
$$('.reveal').forEach(el=>revealObserver.observe(el));

// Vertical section navigator + active state
const sections=$$('.section'); const navDots=$$('.side-dot');
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navDots.forEach(b=>b.classList.toggle('active',b.dataset.target===e.target.id))}}),{rootMargin:'-40% 0px -45% 0px',threshold:0});
sections.forEach(s=>sectionObserver.observe(s));
navDots.forEach(btn=>btn.addEventListener('click',()=>$('#'+btn.dataset.target)?.scrollIntoView({behavior:'smooth'})));

// Scroll progress
addEventListener('scroll',()=>{const h=document.documentElement.scrollHeight-innerHeight; $('#progress').style.width=(scrollY/Math.max(h,1)*100)+'%';},{passive:true});

// Parallax hero layer
addEventListener('scroll',()=>{const y=scrollY; $$('.parallax').forEach(el=>{el.style.transform=`translate3d(0,${y*parseFloat(el.dataset.speed||'.15')}px,0)`})},{passive:true});

// Expandable profile card
const profile=$('#profileCard');
profile.addEventListener('click',()=>{const open=profile.classList.toggle('expanded');profile.setAttribute('aria-expanded',open)});

// Adaptive curriculum slider
const slider=$('#curriculumSlider'), slides=$$('.slide',slider), dots=$('#sliderDots'); let current=0;
slides.forEach((_,i)=>{const b=document.createElement('button');b.className='slider-dot'+(i===0?' active':'');b.ariaLabel=`Go to slide ${i+1}`;b.onclick=()=>goSlide(i);dots.appendChild(b)});
function goSlide(i){current=(i+slides.length)%slides.length;slider.style.transform=`translateX(-${current*100}%)`;$$('.slider-dot',dots).forEach((d,n)=>d.classList.toggle('active',n===current));}
$('#prevSlide').onclick=()=>goSlide(current-1);$('#nextSlide').onclick=()=>goSlide(current+1);
let sx=0,dx=0; slider.addEventListener('pointerdown',e=>{sx=e.clientX;slider.setPointerCapture?.(e.pointerId)});slider.addEventListener('pointerup',e=>{dx=e.clientX-sx;if(Math.abs(dx)>45)goSlide(current+(dx<0?1:-1))});

// Card swipe effect — drag horizontally
const track=$('#swipeTrack'), cards=$$('.swipe-card',track), counter=$('#swipeCounter'); let startX=0,startScroll=0,drag=false;
function updateCounter(){let i=Math.round(track.scrollLeft/(cards[0].offsetWidth+12));i=Math.max(0,Math.min(cards.length-1,i));counter.textContent=`0${i+1} / 0${cards.length}`}
track.addEventListener('pointerdown',e=>{drag=true;startX=e.clientX;startScroll=track.scrollLeft;track.classList.add('dragging');track.setPointerCapture?.(e.pointerId)});
track.addEventListener('pointermove',e=>{if(drag)track.scrollLeft=startScroll-(e.clientX-startX)});
track.addEventListener('pointerup',()=>{drag=false;track.classList.remove('dragging');const w=cards[0].offsetWidth+12;track.scrollTo({left:Math.round(track.scrollLeft/w)*w,behavior:'smooth'});updateCounter()});
track.addEventListener('scroll',updateCounter,{passive:true});

// Floating tilt on folder/project cards
$$('.bento-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(matchMedia('(max-width:900px)').matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${-y*3}deg) rotateY(${x*4}deg) translateY(-5px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});

// Keyboard navigation for slider
addEventListener('keydown',e=>{if(e.key==='ArrowRight')goSlide(current+1);if(e.key==='ArrowLeft')goSlide(current-1)});
