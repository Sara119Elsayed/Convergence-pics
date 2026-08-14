document.addEventListener('DOMContentLoaded', function(){
    const container = document.getElementById('images');
    const image1 = document.getElementById('im1');
    const image2 = document.getElementById('im2');
    const image3 = document.getElementById('im3');
    const go = document.getElementById('go');
    const stop = document.getElementById('stop');
    const reset = document.getElementById('reset');
    const speedRange = document.getElementById('speed');
    const caption = document.getElementById('caption');

    let interval = null;
    let speed = 3; 

    function initPositions(){
        const cW = container.clientWidth;
        const cH = container.clientHeight;
        if(image1.complete) image1.style.left = '0px';
        if(image2.complete) image2.style.left = (cW - image2.width) + 'px';
        if(image3.complete) image3.style.top = (cH - image3.height) + 'px';
    }

    function start(){
        if(interval) return; 
        interval = setInterval(function(){
            const step = Math.round(4 * (speed / 3));

            let left1 = parseInt(getComputedStyle(image1).left) || 0;
            if(left1 + image1.width + step < container.clientWidth){
                image1.style.left = (left1 + step) + 'px';
                image1.style.transform = 'translateY(-2px)';
            } else {
                image1.style.transform = 'translateY(0)';
            }

            let left2 = parseInt(getComputedStyle(image2).left);
            if(isNaN(left2)) left2 = container.clientWidth - image2.width;
            if(left2 > 0){
                image2.style.left = Math.max(0, left2 - step) + 'px';
                image2.style.transform = 'translateY(-2px)';
            } else {
                image2.style.transform = 'translateY(0)';
            }

            let top3 = parseInt(getComputedStyle(image3).top);
            if(isNaN(top3)) top3 = container.clientHeight - image3.height;
            if(top3 > 0){
                image3.style.top = Math.max(0, top3 - step) + 'px';
                image3.style.transform = 'translateY(-2px)';
            } else {
                image3.style.transform = 'translateY(0)';
            }

            if(caption) caption.textContent = `Positions: im1 ${left1}px, im2 ${left2}px, im3 ${top3}px`;
        }, 100);
    }

    function stopFn(){ if(interval){ clearInterval(interval); interval = null; } }

    function resetFn(){ stopFn(); initPositions(); if(caption) caption.textContent = 'Reset to start positions'; go.value='Go'; }

    function setSpeed(v){ speed = Number(v) || 3; if(caption) caption.textContent = `Speed: ${speed}`; }

    function togglePlay(){ if(interval) { stopFn(); go.value='Play'; } else { start(); go.value='Pause'; } }

    go.addEventListener('click', togglePlay);
    stop.addEventListener('click', stopFn);
    reset.addEventListener('click', resetFn);
    if(speedRange){ speedRange.addEventListener('input', (e)=> setSpeed(e.target.value)); }

    document.addEventListener('keydown', function(e){ if(e.code === 'Space'){ e.preventDefault(); togglePlay(); } });

    let pending = 0;
    [image1,image2,image3].forEach(img=>{
        if(!img.complete) {
            pending++;
            img.addEventListener('load', ()=>{ pending--; if(pending===0) initPositions(); });
        }
    });
    if(pending===0) initPositions();
});
