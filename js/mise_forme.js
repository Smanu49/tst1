// fonction appelees par boutons pour effets de transitions entre les divs "pages"
function show_jeu(){
    $("#accueil").velocity('transition.flipXOut', {duration:1000});
    $("#jeux").velocity('transition.flipXIn', {duration:1000, delay:1000});
    current_ecran="jeux";
    var pos_canavs=$("#canvas").position();
    //alert(pos_canavs.top);
    //$("#hahabillage_bottom").css({top:pos_canavs.top+400px});
    init_var();
}

function show_bilan(){
    $("#jeux").velocity('transition.flipXOut', {duration:1000});
    $("#bilan").hide().velocity('transition.flipXIn', {duration:1000, delay:1000});
    aff_tab_bilan();
    current_ecran="bilan";
}
function show_accueil(){
    $("#bilan").velocity('transition.flipXOut', {duration:1000});
    $("#accueil").hide().velocity('transition.flipXIn', {duration:1000, delay:1000});
    current_ecran="accueil";
}
function play_again(){
    $("#bilan").velocity('transition.flipXOut', {duration:1000});
    $("#jeux").hide().velocity('transition.flipXIn', {duration:1000, delay:1000});
    current_ecran="jeux";
    init_var();
}

function clear_tab(){
    $("#tab_recap").text('');
    $("#tab_recap").append("<caption>No Games</caption> <colgroup> </colgroup><thead> <tr></tr> </thead> <tbody></tbody>");
    /*<caption>No Games</caption> <colgroup> </colgroup><thead> <tr></tr> </thead> <tbody></tbody> */
}


////fontion de redimensionnement des divs en fonction de la taille de la fenetre
$( window ).resize(function() {
    var largeur_fenetre = $(window).width();
	var hauteur_fenetre = $(window).height();
    $("#accueil").css({height: hauteur_fenetre-100});
    $("#jeux").css({height: hauteur_fenetre-100});
    $("#bilan").css({height: hauteur_fenetre-100});    
    $("#footer").css({top: hauteur_fenetre-100,height: '100px'});
  $("#container").css({position: 'relative', top: '0px', height: hauteur_fenetre-100,display:'block',width :largeur_fenetre /2, margin:'auto'});  
        var p_left=(largeur_fenetre /4)-200;
    $("#habillage_top").css({left:p_left});
    $("#habillage_bottom").css({left:p_left});
    $("#canvas").css({left:p_left});
});













var current_ecran="accueil";

$(function(){
    var largeur_fenetre = $(window).width();
	var hauteur_fenetre = $(window).height();
    var current_ecran="accueil";
 
	//var haut = (hauteur_fenetre - element.height()) / 2;
	//var gauche = (largeur_fenetre - element.width()) / 2;
    //$divs=$('#accueil, #jeux, #footer');
    var txt_titre="Le jeux des Balles";
    $('#titre').text(txt_titre);
    var txt_footer="";
    var txt_auteur="manu_smiet";
    var txt_date="nov_2015";
    var txt_sujet="jeux des Balles - MOOC FUN";
    
   // $("#footer").text(txt_footer);
    $("#auteur").text(txt_auteur);
    $("#date").text(txt_date);
    $("#projet").text(txt_sujet);
    
    
	$("#accueil").css({position: 'fixe', top: '0px', height: hauteur_fenetre-100});
    $("#jeux").css({position: 'fixe', top: '0px', height: hauteur_fenetre-100,display:'none'});
    $("#bilan").css({position: 'fixe', top: '0px', height: hauteur_fenetre-100,display:'none'});    
    $("#footer").css({position: 'fixe', top: hauteur_fenetre-100, left: '0px',height: '100px'});
    
    
    //$('#accueil').hide().velocity('transition.bounceUpIn', {duration:1000});
     $("#accueil").hide().velocity('transition.bounceUpIn', {duration:1000});
    $("#container").css({position: 'relative', top: '0px', height: hauteur_fenetre-100,display:'block',width :largeur_fenetre /2, margin:'auto'});    
});