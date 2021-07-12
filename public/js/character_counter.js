// counter character by lucky ardhika! (ardevid.my.id)

var targett=document.getElementById("notift_fill");
var bataskarakter=50;
function cek_notift(){
    // jika jumlah karakter yg diketikkan lebih dari atau sama dengan 3000
    if(targett.value.length >= bataskarakter ){
    //disable textarea
    targett.value=targett.value.substring(0, bataskarakter)
    //memberikan warna merah pada text pemberitahuan
    document.getElementById("notift").style.color="red";
    // menampilkan pemberitahuan 
    document.getElementById("notift").innerHTML="Max 50 Character! Upgrade to pro for 120 Char";
    }else{
      // merubah warna
    document.getElementById("notift").style.color="black";
    //menghitung jumlah karakter yg sudah diketikkan
    var jumlahkarakter=targett.value.length;
    // untuk mengetahui jumlah karakter yg tersisa, maka batas_karakter dikurangi karakter yg telah diketikkan
    var sia=bataskarakter-jumlahkarakter;
    // tampilkan pemberitahuan berapa karakter lagi yg tersisa
    document.getElementById("notift").innerHTML=sia+" Character left to fill for title!";
    }
}
 
function kosongi(){
target.readOnly=false;
var notifts=document.getElementById("notift");
notifts.style.color="black";
notifts.innerHTML="50 Character left to fill for title!";
}


// javascript untuk textarea
var target=document.getElementById("area");
var batas_karakter=3000;
function cek(){
    // jika jumlah karakter yg diketikkan lebih dari atau sama dengan 3000
    if(target.value.length >= batas_karakter ){
    //disable textarea
    target.value=target.value.substring(0, batas_karakter)
    //memberikan warna merah pada text pemberitahuan
    document.getElementById("notif").style.color="red";
    // menampilkan pemberitahuan 
    document.getElementById("notif").innerHTML="Max 3000 Character! Upgrade to pro for 10k Char";
    }else{
      // merubah warna
    document.getElementById("notif").style.color="black";
    //menghitung jumlah karakter yg sudah diketikkan
    var jumlah_karakter=target.value.length;
    // untuk mengetahui jumlah karakter yg tersisa, maka batas_karakter dikurangi karakter yg telah diketikkan
    var sisa=batas_karakter-jumlah_karakter;
    // tampilkan pemberitahuan berapa karakter lagi yg tersisa
    document.getElementById("notif").innerHTML=sisa+" Character left to fill for field!";
    }
}
 
function kosongi(){
target.readOnly=false;
var notif=document.getElementById("notif");
notif.style.color="black";
notif.innerHTML="3000 Character left to fill for field!";
}
