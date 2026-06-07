console.log('Learn-en/cscript_docFillIn.js v=1.0-Beta');
const footer=document.querySelector('footer');
const nav=document.querySelector('.nav');
const menu=document.querySelector('.menu');
let Nav1='index.html';
let Nav2='';
let Nav3='about/index.html';
const Nav4='';

footer.innerHTML=`<p>本网站由<a href='https://dash.cloudflare.com/' target='_blank'>cloudflare</a>部署</p>
<p>Developed by TSY MMXXVI</p>`;
function fixhref(h,l){
    let R='';
    for(let i=0;i<l;i++){
        R+='../';
    }
    R+=h;
    console.log('fixhref:'+R);
    return R;
}
function deving(href,l){
    if(href===''){
        href='developing.html';
        console.log(`deving:${href}`);
    }
    return href;
}
function gethref(Nav1,Nav2,Nav3,Nav4){
    const content1='首页',content2='提升',content3='关于',content4='undefined';
    nav.innerHTML=`
    <a href='${Nav1}' class='_1' style='--i:1'>${content1}</a>
    <a href='${Nav2}' class='_2' style='--i:2'>${content2}</a>
    <a href='${Nav3}' class='_3' style='--i:3'>${content3}</a>
    <a href='${Nav4}' target='_blank' class='_4' style='color:rgb(0, 76, 211);--i:4'>${content4}</a>
    `;
    menu.innerHTML=`
    <a href='${Nav1}' class='_1'>${content1}</a>
    <a href='${Nav2}' class='_2'>${content2}</a>
    <a href='${Nav3}' class='_3'>${content3}</a>
    <a href='${Nav4}' target='_blank' class='_4' style='color:rgb(0, 76, 211)'>${content4}</a>
    `;

}
Nav1=deving(Nav1,l);Nav2=deving(Nav2,l);Nav3=deving(Nav3,l);
Nav1=fixhref(Nav1,l);Nav2=fixhref(Nav2,l);Nav3=fixhref(Nav3,l);
gethref(Nav1,Nav2,Nav3,Nav4);
