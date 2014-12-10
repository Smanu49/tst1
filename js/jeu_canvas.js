    var x=0;
    var cercles=new Array;
    var tot_time=60;
    var x_bilan=200;
    var b_trouve=0;
    var b_atrouve=3;
    var b_down=0;
    var bad=0;
    var end_niv=false;
    var time=0;
    var chrono;
    var c_niveau=1;
    var tab_niveau= new Array;
    var tab_res=new Array;
    var tab_pts=new Array;
    var tab_pts_max=new Array;
    var end_game=false;
    var init_game=false;
    var bilan_affiche=false;
    var tab_c_init=new Array;
    tab_c_init=[['cercle1',100,0,tir_al(20,30),tir_al(3000,4000),'red'],['cercle2',200,0,tir_al(20,30),tir_al(3000,4000),'blue'],['cercle3',250,0,tir_al(20,30),tir_al(3000,4000),'grey'],['cercle4',300,0,tir_al(20,30),tir_al(3000,4000),'green']];

function init_var(){
    clearInterval(chrono);
    tot_time=60;
    x=0;
    x_bilan=200;
    b_trouve=0;
    b_atrouve=3;
    b_down=0;
    bad=0;
    end_niv=false;
    time=0;
    c_niveau=1;
    end_game=false;
    init_game=false;
    bilan_affiche=false;
    $("#canvas"). stopLayerGroup ('gp_balls');
    $("#habillage_bottom").removeLayers();
    $("#canvas").removeLayers();
    $("#habillage_top").removeLayers();
    tab_res=[];
    tab_pts=[];
    cercles=[];
    cercles=tab_c_init;
    draw_abi();
    show_bt_dep();
}


///fct d'affichage du bouton de depart pour lancer le jeu
function show_bt_dep(){
    $('#canvas').drawRect({layer:true,draggable:false,  name:'bt_start',groups:['gp_start'],
                fillStyle: '#36c',x: 200, y: 250,width: 200,height: 50,cornerRadius: 10,click : function(layer){
                                                dep();//lance le jeu
                                                $("#canvas").removeLayerGroup('gp_start').drawLayers();//retire le bt start
                                                }});
    $('#canvas').drawText({ layer:true,name :'text_bt_start',groups:['gp_start'] ,fillStyle: '#fff',x: 200, y: 250,
                            fontSize: 20,fontFamily: 'Verdana, sans-serif', text: 'Lancer le Jeu'});
}

///// fonction qui stocke les differents resultat du niveau ds un tableau + calcul des pts ds un autre tab
function stock_res_niveau(){
    var pts_b_down;
    var pts_tmp;
    var pts_b_down_max;
    pts_b_down=(tab_niveau[c_niveau-1][0]*tab_niveau[c_niveau-1][1]*2)-b_down;
    pts_b_down_max =(tab_niveau[c_niveau-1][0]*tab_niveau[c_niveau-1][1]*2);
    pts_tmp=10-(time-12);
    var tab_res_niveau=['Niveau'+c_niveau,b_trouve+' - Balles',b_down+" - Balles",bad+' - Mauvaises',time+'s.'];
    tab_res.push(tab_res_niveau); // sans calcul de points
    var tab_res_pts=['points',b_trouve*10,pts_b_down,bad*-2,pts_tmp];
    var tab_max=['Max',b_atrouve*10,pts_b_down_max,0,12+10];
    tab_pts.push(tab_res_pts);
    tab_pts_max.push(tab_max);
}
//// fct qui gere l'affichage du bilan
function aff_tab_bilan(){
    
    if (end_game==true && bilan_affiche==false){
        if($("#tab_recap caption").text()=="No Games"){
            $("#tab_recap caption").text("Bilan");
            $("#tab_recap thead tr").append('<th>Niveau</th>');
            $("#tab_recap thead tr").append('<th>Objectif</th>');
            $("#tab_recap thead tr").append('<th>Balles Tombées</th>');
            $("#tab_recap thead tr").append('<th>Mauvaises cliquées</th>');
            $("#tab_recap thead tr").append('<th>Temps</th>');
            $("#tab_recap thead tr").append('<th>Points</th>');
            
        }
        var pts_tot=0;
        var pts_tot_max=0;
        var pts;
        var max;
        for (var i=0;i<tab_res.length;i++){
            pts=0;
            max=0;

            $("#tab_recap tbody").last().append('<tr></tr>');
            var ligne_txt="";
            for (var c=0;c<5;c++){
                ligne_txt=ligne_txt+'<td>'+tab_res[i][c]+'</td>';
            }
             $("#tab_recap tbody tr").last().append(ligne_txt);
            
            $("#tab_recap tbody").last().append('<tr class="pts"></tr>');
            var ligne_txt="";

            for (var c=0;c<5;c++){
                ligne_txt=ligne_txt+'<td>'+tab_pts[i][c]+'/'+tab_pts_max[i][c]+'</td>';
                if(c>0){
                    pts=pts+tab_pts[i][c];
                    max=max+tab_pts_max[i][c];
                }               
            }
            
            ligne_txt=ligne_txt+'<td>'+pts+'/'+max+'</td>';
            $("#tab_recap tbody tr").last().append(ligne_txt);
            pts_tot=pts_tot+pts;
            pts_tot_max=pts_tot_max+max;
        }

        $("#tab_recap tbody").last().append('<tr class="tot"><td >Points Partie</td><td></td><td></td><td></td><td></td><td>'+pts_tot+'/'+pts_tot_max+'</td></tr>');
        $("#tab_recap tbody").last().append('<tr><td></td></tr>');
        bilan_affiche=true;
        init_game=false;
    }
    
}



///dessine les balles en fonction good ou pas
function draw_C(c_id,good){
    c_id.push(good);
    $('#canvas').drawArc({
        layer:true, 
        name:c_id[0], 
        data:{t_cliked : 0},
        fillStyle:c_id[5],
        x: c_id[1], y: c_id[2], radius: c_id[3],groups:['gp_balls'],
      click : function(layer){ 
                                 $('#canvas').removeLayer(layer.name);
                                 $('#canvas').stopLayer(layer.name,true);               
                                layer.data.t_cliked=1;
                                draw_b(c_id);
        }
    })  ;
    //lance l'animation
    var nom=c_id[0];
    $('#canvas').animateLayer(c_id[0], 
                             { x: c_id[1], y: c_id[2]+480,  radius: c_id[3]},    
                             c_id[4],'linear'
                              ,function(layer){relance(layer,c_id)});
}

///// dessine balles cliquée sur la bandeau du bas
function draw_b(c_id){
    if (c_id[6]==1){
        b_trouve=b_trouve+1;
        $('#habillage_bottom').drawArc({
                            layer:true, 
                            name:c_id[0], groups: ['show_b_bilan'],
                            fillStyle:  c_id[5],
                            x:x_bilan , y: 40, radius: 15,
                            });
        x_bilan=x_bilan+40;
        if (b_trouve>=b_atrouve){
            end_niv=true;
            clearInterval(chrono);
            stock_res_niveau();
            c_niveau=c_niveau+1;
            $('#canvas').removeLayers().drawLayers();//supprime les calques
            $('#canvas').drawRect({layer:true,draggable:false, groups:['gp_next'], name:'fond', fillStyle: '#eff4d9', x: 200, y: 250, width: 400, height:500});
            if (c_niveau<6){
                $('#canvas').drawRect({layer:true,draggable:false,  name:'bt_next',groups:['gp_next'],
                fillStyle: '#36c',x: 200, y: 250,width: 200,height: 50,cornerRadius: 10,click : function(layer){
                    
                    aff_niveau();
                    chrono=setInterval(decompte,1000);
                    
                }});
            $('#canvas').drawText({ layer:true,name :'text_bt_next' ,fillStyle: '#fff',x: 200, y: 250,
fontSize: 20,fontFamily: 'Verdana, sans-serif', text: 'niveau suivant'});
            }else{
                 $('#canvas').drawRect({layer:true,draggable:false,  name:'bt_end',groups:['gp_end'],
                fillStyle: '#36c',x: 200, y: 250,width: 200,height: 50,cornerRadius: 10,click : function(layer){
                    end_game=true;
                    show_bilan();
                    }});
            $('#canvas').drawText({ layer:true,name :'text_bt_End' ,fillStyle: '#fff',x: 200, y: 250,
fontSize: 20,fontFamily: 'Verdana, sans-serif', text: 'Afficher le bilan'});
            }
            
            
        }
    }else{
        bad=bad+1;
        if (bad==1){
        $('#habillage_bottom').drawArc({
                            layer:true, 
                            name:'bad'+bad, groups: ['show_b_bilan'],
                            fillStyle:  'orange',
                            x: 370 , y: 50, radius: 15,
                            });
        }
        if (bad>1){
            $('#habillage_bottom').removeLayer('bad_touch').drawLayers(); 
           var text_bad=String(bad);
          $('#habillage_bottom').drawText({ layer:true,name :'bad_touch' ,fillStyle: 'white',strokeStyle: '#25a',strokeWidth: 0,x: 370, y: 50,
fontSize: 20,fontFamily: 'Verdana, sans-serif', text: text_bad});   
        }
    }
    
    
    
    

    
}
/////////////////////////////////////////////////////////
//fonction qui boucle l'animation
function relance(layer,c_id){
    //var layer=$('#canvas').getLayer(c_id[0]);
    var test_cliked=layer.data.t_cliked;
    if (end_niv==false){
        if (test_cliked==1){
            //alert('clique');

        }else{
            //alert('test faux');
            b_down=b_down+1;
            $('#canvas').removeLayer(layer.name);//.drawLayers();
            c_id[1]=tir_al(20,400);
            c_id[3]=tir_al(20,30);
            c_id[4]=tir_al(3000,4000);
            draw_C(c_id);
            };
    }
}


/////////////////////////////////////////////////////////
//function de tirage aleatoire avec un min et un max
function tir_al(min,max){
    var number_a = Math.floor(Math.random() * (max - min + 1)) + min;
    return number_a
}


/////////////////////////////////////////////////////////
//fonction dessinant les cercles parasites
function cercle_al(){
    var n=cercles.length;
    var tab_c_niveau =tab_niveau[c_niveau-1];
    var coul_par=tab_c_niveau[2];
    if (coul_par==0){    
        cercles[n]=['cercle'+n,tir_al(10,490),0,tir_al(20,50),tir_al(3000,4000),'yellow'];
    }
    if (coul_par==1){  
        var r=tir_al(0,255);
        var g=tir_al(0,255)
        var b=tir_al(0,255)
        cercles[n]=['cercle'+n,tir_al(10,490),0,tir_al(20,50),tir_al(3000,4000),'rgb('+r+','+g+','+b+')'];
    }
    
    return cercles[n]
}

/////////////////////////////////////////////////////////
//fonction de dessin de l(habillage
function draw_abi(){
   
    x_bilan=200;
    b_trouve=0;
    b_atrouve=3;
    b_down=0;
    var largeur_fenetre = $(window).width();
    var p_left=(largeur_fenetre /4)-200;
    $("#habillage_top").css({left:p_left});
    $("#habillage_bottom").css({left:p_left});
    $("#canvas").css({left:p_left});
    
    $('#canvas').removeLayers();
    $('#habillage_bottom').removeLayers();
    
$('#habillage_top').drawRect({layer:true,draggable:false,name:'top',fillStyle: '#1383e3', x: 200, y: 25, width: 400, height: 50, 
                           shadowColor: '#000',shadowY: 5,shadowBlur: 10});
    
    $('#habillage_bottom').drawRect({layer:true,draggable:false,name:'bottom',fillStyle: '#1383e3', x: 200, y: 75, width: 400, height: 100, 
                           shadowColor: '#000',shadowY: -5,shadowBlur: 10});
    $('#habillage_bottom').drawText({ layer:true,name :'text_bottom' ,fillStyle: '#fff',strokeStyle: '#25a',strokeWidth: 0,x: 90, y: 40,
fontSize: 20,fontFamily: 'Verdana, sans-serif', text: 'Balles touchées :'}); 
    $('#canvas').drawRect({layer:true,draggable:false,  name:'fond', fillStyle: '#eff4d9', x: 200, y: 250, width: 400, height: 500});
    $('#habillage_bottom').drawPolygon({layer:true,draggable:false,  name:'shield',fillStyle: 'white',strokeStyle: '#f60',strokeWidth: 2,x: 370, y: 50,radius: 30, sides: 3,concavity: -0.5,rotate: 180});
}

/////////////////////////////////////////////////////////
//fonction gerant l'habillage lors de l'affichage du changement de niveau
function aff_niveau(){
    
    draw_obj();  
    $('#habillage_bottom').removeLayerGroup('show_b_bilan').drawLayers();
    $('#canvas').removeLayerGroup('gp_next').drawLayers();
    $('#canvas').drawRect({layer:true,draggable:false,  name:'fond', fillStyle: '#eff4d9', x: 200, y: 250, width: 400, height: 500});
    
    if (c_niveau<6/*tab_niveau.length*/){
        x_bilan=200;
        b_trouve=0;
        var tab_c_niveau=tab_niveau[c_niveau-1];
        b_atrouve=tab_c_niveau[0];
        b_down=0;
        bad=0;
        end_niv=false;
        time=0;
        launch_ball();
        
    }
        
}

/////////////////////////////////////////////////////////
//fonction gerant l'affichage des objectifs
function draw_obj(){
    $('#habillage_top').removeLayer('text_top');
    $('#habillage_top').drawText({ layer:true,name :'text_top' ,fillStyle: '#fff',x: 120, y: 25,
                                fontSize: 20,fontFamily: 'Verdana, sans-serif', text: 'niveau '+ c_niveau +'- Objectif : '});
    $('#habillage_top').removeLayer('show_obj').drawLayers();
    var tab_c_niveau=tab_niveau[c_niveau-1];
    for (var b=0;b<tab_c_niveau[0];b++){
        var x_pos=250+b*40;
        var cercle=cercles[b];
        var c_color=cercle[5];
        $('#habillage_top').drawArc({
                            layer:true, 
                            name:"b_"+b, groups: ['show_obj'],
                            fillStyle:  c_color,
                            x:x_pos , y: 25, radius: 15,
                            });   
    }
}



/////////////////////////////////////////////////////////
//fonction de dessin des balles cibles en fct du tableau de niveau
function launch_ball(){
   var tab_c_niveau=tab_niveau[c_niveau-1];
    for (var i = 0; i<tab_c_niveau[0]; i++){
        draw_C(cercle_al(),0);    
        draw_C(cercles[i],1);
        if(tab_c_niveau[1]==2){
            draw_C(cercle_al(),0);    
            }
        }  
}

/////////////////////////////////////////////////////////
function decompte(){
    tot_time=tot_time-1;
    time=time+1;
    if (tot_time>0){
        var txt_temps='temps niveau:'+time+'s. // avant fin : '+tot_time+'s.';
        $('#habillage_bottom').removeLayer('temps').drawLayers();
        $('#habillage_bottom').drawText({ layer:true,name :'temps' ,fillStyle: '#fff',strokeStyle: '#25a',strokeWidth: 0,x: 10, fromCenter: false,y: 70,
fontSize: 15,fontFamily: 'Verdana, sans-serif', text: txt_temps});
    }
    if (tot_time<=0){
        end_niv=true;
        clearInterval(chrono);
        stock_res_niveau();
        $('#canvas').removeLayers().drawLayers();//supprime les calques
        $('#canvas').drawRect({layer:true,draggable:false, groups:['gp_next'], name:'fond', fillStyle: '#eff4d9', x: 200, y: 250, width: 400, height:500});
        $('#canvas').drawRect({layer:true,draggable:false,  name:'bt_end',groups:['gp_end'],
                fillStyle: '#36c',x: 200, y: 250,width: 200,height: 50,cornerRadius: 10,click : function(layer){
                    end_game=true;
                    show_bilan();
                    }});
        $('#canvas').drawText({ layer:true,name :'text_bt_End' ,fillStyle: '#fff',x: 200, y: 250,
fontSize: 20,fontFamily: 'Verdana, sans-serif', text: 'Afficher le bilan'});
    }
}


/////////////////////////////////////////////////////////
function dep(){
    init_game=true;
    $('#habillage_top').drawText({ layer:true,name :'text_top' ,fillStyle: '#fff',x: 120, y: 25,
fontSize: 20,fontFamily: 'Verdana, sans-serif', text: 'niveau '+ c_niveau +'- Objectif : '});
    launch_ball();
    draw_obj();
    chrono=setInterval(decompte,1000);  
        
}




///extract fichier texte pour tableau de balles
/*
var tab_txt=[];
tab_txt[0]="0;3;0;5;15;0;0";
tab_txt[1]="1;4;1;10;20;0;0";
tab_txt[2]="2;5;2;15;30;0;0";
var liste_balles=[];
for (x=0 ; x<=tab_txt.length-1;x++){
    //alert(tab_txt[x]);
    liste_balles[x]=tab_txt[x].split(";");
}*/
/////////////////////////////////////////////////////////
//def tableau niveaux
tab_niveau[0]=[3,1,0];
tab_niveau[1]=[3,2,0];
tab_niveau[2]=[3,2,1];
tab_niveau[3]=[4,1,0];
tab_niveau[4]=[4,2,1];

//////////////////////////////////////////////////////////////////////
//attends que le doc soit lu
$(function(){
    var depart=false;
    cercles=tab_c_init;
    if(!$('canvas'))
        {
            alert("Impossible de récupérer le canvas");
        }else{
            $("#Consigne").text('Pour démarrer le jeu, cliquez sur le bouton lancer le jeu. Le but est de cliquer sur les balles de couleur qui vont tombées mais seulement sur celle de même couleurs que celles affichées à droite de "objectif" ( rouge bleu gris puis vert ). Vous avez 60s. pour finr le jeu, les 5 niveaux');
            init_var();
        }
    
});